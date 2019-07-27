import { Universe } from './model.universe';
import { EventEmitter } from '../event-emitter';
import { FeatureCollection } from './feature-collection/model.feature-collection';
import { EPSG, FeatureCollectionJSON } from '../types';
import { UniverseMap } from './model.map';

export interface WorldProps {
	id: string;
	trails: FeatureCollectionJSON;
	universe: Universe;
}

export class World extends EventEmitter {
	static create(props: WorldProps) {
		return new World(props);
	}

	private readonly _id: string;
	private readonly _trails: FeatureCollection;
	private readonly _universe: Universe;

	constructor({ id, trails, universe }: WorldProps) {
		super();

		this._id = id;
		this._trails = FeatureCollection.create(trails, `${ id }-trails`);
		this._universe = universe;
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
}
