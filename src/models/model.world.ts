import { Universe } from './model.universe';
import { UniverseMap } from './model.map';
import { EventEmitter } from '../event-emitter';
import { DEFAULT_LOCATION, LOCATIONS } from '../constants';
import { FeatureCollection } from './feature-collection/model.feature-collection';
import {
	EPSG,
	Location,
	FeatureCollectionJSON, Dict, MapboxStyle
} from '../types';

export interface WorldProps {
	id: string;
	trails: FeatureCollectionJSON;
	universe: Universe;
}

interface Visibility {
	visible: boolean;
	opacity: number;
}

interface WorldMap {
	id: string;
	layers: {
		id: string;
		style: MapboxStyle
	}[];
}

export class World extends EventEmitter {
	static create(props: WorldProps) {
		return new World(props);
	}

	private readonly _id: string;
	private readonly _trails: FeatureCollection;
	private readonly _universe: Universe;
	private readonly _visibility: Dict<Dict<Visibility>> = {};

	private _location: Location = DEFAULT_LOCATION;
	private _currentMapId: string;

	constructor({ id, trails, universe }: WorldProps) {
		super();

		this._id = id;
		this._trails = FeatureCollection.create(trails, `${ id }-trails`);
		this._universe = universe;
		this._location = LOCATIONS[0];
		this._currentMapId = universe.maps[0].id;

		this._visibility = {
			[this._currentMapId]: universe.maps[0].layers.reduce((m, l) => (
				{
					...m,
					[l.id]: {
						visible: true,
						opacity: 1
					}
				}
			), {})
		};
	}

	get id(): string {
		return this._id;
	}

	get CRS(): EPSG {
		return this._universe.CRS;
	}

	get maps(): UniverseMap[] {
		return this._universe.maps;
	}

	get trails(): FeatureCollection {
		return this._trails;
	}

	get location(): Location {
		return this._location;
	}

	setLocation(location: Location) {
		this._location = location;
	}

	get currentMap(): WorldMap {
		const map = this._universe.getMap(this._currentMapId) || this._universe.maps[0];

		return {
			...map.json,
			layers: map.layers.map((layer) => {
				return {
					...layer.json,
					...this._visibility[this._currentMapId][layer.id]
				};
			})
		};
	}

	setMap(id: string) {
		this._currentMapId = id;
	}

	export() {
		return {
			id: this._id,
			trails: this._trails.getFeatureCollection(),
			location: this._location
		};
	}

	setLayerVisibility(id: string, visible: boolean) {
		this._visibility[this._currentMapId][id].visible = visible;

		this.trigger('update');
	}

	setLayerOpacity(id: string, opacity: number) {
		this._visibility[this._currentMapId][id].opacity = opacity;

		this.trigger('update');
	}
}
