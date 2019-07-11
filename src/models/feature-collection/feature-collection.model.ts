import bind from 'autobind-decorator';
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

@bind
export class FeatureCollectionModel extends EventEmitter {
	private _data: FeatureCollection;
	private _index: number[] = [];
	private _prevIndex: number = -1;
	private _selection: number[][] = [];

	private readonly _title: string;

	static create(data: FeatureCollection, title: string) {
		return new FeatureCollectionModel(data, title);
	}

	constructor(data: FeatureCollection, title: string) {
		super();

		this._data = data;
		this._title = title;
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

		this._selection = [this._index];

		this.trigger('update');
	}

	get prevIndex(): number {
		return this._prevIndex;
	}

	get title(): string {
		return this._title;
	}

	get selection(): number[][] {
		return this._selection;
	}

	select(index: number[] = [], add: boolean = false) {
		this._selection = index.length
			? add
				? [...this._selection, index]
				: [index]
			: [];

		this._prevIndex = this._index[0];
		this._index = index;

		this.trigger('update');
	}

	moveGeometry(index: number[], movement: Point) {
		this.data = moveGeometry(this.data, index, movement);
	}

	updateCoordinates(entries: [number[], Co][]) {
		this.data = updateCoordinates(this.data, entries);
	}

	addFeature(feature: Feature<any>) {
		const i = this.data.features.length;

		this.data = {
			...this.data,
			features: this.data.features.concat(feature)
		};

		this.select([i]);
	}

	addAtIndex(coordinate: Co, index?: number[]) {
		this.data = addAtIndex(
			this.data,
			index != null ? index : this._index,
			coordinate
		);
	}

	deleteSelection() {
		this._selection.slice().reverse().forEach((index: number[]) => {
			if (index.length) {
				this._data = deleteAtIndex(this.data, index);
			}
		});

		this._selection = this._selection.reduce((m1: number[][], index: number[]) => {
			return index.length === 1
				? m1
				: m1.concat([[index[0]]]);
		}, [] as number[][]);

		this._index = this._selection[0] || [];

		this.trigger('update');
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
		this.select([]);
	}
}
