import { addAtIndex } from './fn/add-at-index';
import { moveGeometry } from './fn/move-geometry';
import { EventEmitter } from '../../event-emitter';
import { deleteAtIndex } from './fn/delete-at-index';
import { nearestVertex } from './fn/nearest-vertex';
import { updateCoordinates } from './fn/update-coordinate';
import { setPropertyAtIndex } from './fn/set-property-at-index';
import { nearestPointOnGeometry } from './fn/nearest-point-on-geometry';
import {
	Co,
	Point,
	LngLat,
	Feature,
	FeatureCollection } from '../../types';

export class FeatureCollectionModel extends EventEmitter {
	private _data: FeatureCollection;
	private _index: number[];
	private _prevIndex: number;

	static create(data: FeatureCollection) {
		return new FeatureCollectionModel(data);
	}

	constructor(data: FeatureCollection) {
		super();

		this._data = data;
		this._index = [];
		this._prevIndex = -1;
	}

	get data(): FeatureCollection {
		return this._data;
	}

	set data(data: FeatureCollection) {
		this._data = data;
		this.trigger('update');
	}

	get index(): number[] {
		return this._index;
	}

	set index(index: number[]) {
		this._prevIndex = this._index[0];
		this._index = index;
		this.trigger('update');
	}

	get prevIndex(): number {
		return this._prevIndex;
	}

	moveGeometry(index: number[], movement: Point) {
		this.data = moveGeometry(this.data, index, movement);
	}

	updateCoordinates(entries: [number[], Co][]) {
		this.data = updateCoordinates(this.data, entries);
	}

	addFeature(feature: Feature<any>) {
		this.data = {
			...this.data,
			features: this.data.features.concat(feature)
		};

		this.index = [this.data.features.length - 1];
	}

	addAtIndex(coordinate: Co, index?: number[]) {
		this.data = addAtIndex(
			this.data,
			index != null ? index : this._index,
			coordinate
		);
	}

	deleteAtIndex() {
		if (this._index.length) {
			this._data = deleteAtIndex(this.data, this._index);
			this._index = this._index.length === 1
				? []
				: [this._index[0]];

			this.trigger('update');
		}
	}

	setPropertyAtIndex(key: string, value: any) {
		this.data = setPropertyAtIndex(this.data, this._index[0], key, value);
	}

	nearestVertex(lngLat: LngLat) {
		return nearestVertex(lngLat, this.data);
	}

	nearestPointOnGeometry(lngLat: LngLat) {
		return nearestPointOnGeometry(lngLat, this.data);
	}

	cleanUp() {
		this.index = [];
	}
}
