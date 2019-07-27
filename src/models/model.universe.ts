import { MapProps, UniverseMap } from './model.map';
import { EPSG } from '../types';

export interface UniverseProps {
	crs: EPSG;
	maps: MapProps[];
}

export class Universe {
	static create(props: UniverseProps, index: number) {
		return new Universe(props, index);
	}

	private readonly _crs: EPSG;
	private readonly _maps: UniverseMap[];
	private readonly _index: number;

	constructor({ crs, maps }: UniverseProps, index: number) {
		this._crs = crs;
		this._maps = maps.map(UniverseMap.create);
		this._index = index;
	}

	get CRS(): EPSG {
		return this._crs;
	}

	get maps(): UniverseMap[] {
		return [...this._maps];
	}

	get index(): number {
		return this._index;
	}
}
