import bind from 'autobind-decorator';
import { addAtIndex } from './fn/add-at-index';
import { moveGeometry } from './fn/move-geometry';
import { EventEmitter } from '../../event-emitter';
import { deleteAtIndex } from './fn/delete-at-index';
import { nearestVertex } from './fn/nearest-vertex';
import { updateCoordinates } from './fn/update-coordinate';
import { nearestPointOnGeometry } from './fn/nearest-point-on-geometry';
import {
	Co,
	Point,
	LngLat,
	Feature,
	FeatureCollection } from '../../types';
import { POINT } from '../../constants';

@bind
export class FeatureCollectionModel extends EventEmitter {
	private readonly _title: string;

	private _featureCollection: FeatureCollection;
	private _selection: number[][] = [];

	static create(data: FeatureCollection, title: string) {
		return new FeatureCollectionModel(data, title);
	}

	constructor(data: FeatureCollection, title: string) {
		super();

		this._featureCollection = data;
		this._title = title;
	}

	getTitle() {
		return this._title;
	}

	get selection(): number[][] {
		return this._selection;
	}

	getSelection() {
		return this._selection;
	}

	getFeatureCollection() {
		return this._featureCollection;
	}

	setFeatureCollection(data: FeatureCollection) {
		this._featureCollection = data;

		this.trigger('update');
	}

	getFeatures() {
		return this._featureCollection.features;
	}

	getFeatureAtIndex(index: number) {
		return this._featureCollection.features[index];
	}

	select(index: number[] = [], add: boolean = false) {
		this._selection = index.length
			? add
				? [...this._selection, index]
				: [index]
			: [];

		this.trigger('update');
	}

	moveGeometry(index: number[], movement: Point) {
		this._featureCollection = moveGeometry(this._featureCollection, index, movement);

		this.trigger('update');
	}

	updateCoordinates(entries: [number[], Co][]) {
		this._featureCollection = updateCoordinates(this._featureCollection, entries);

		this.trigger('update');
	}

	addFeature(feature: Feature<any>) {
		this._featureCollection = {
			...this._featureCollection,
			features: this._featureCollection.features.concat({ ...feature })
		};

		this.select([this._featureCollection.features.length - 1]);
	}

	addAtIndex(coordinate: Co, index: Co) {
		this._featureCollection = addAtIndex(
			this._featureCollection,
			index,
			coordinate
		);

		this.trigger('update');
	}

	deleteSelection() {
		this._selection.slice().reverse().forEach((index: number[]) => {
			if (index.length) {
				this._featureCollection = deleteAtIndex(this._featureCollection, index);
			}
		});

		this._selection = this._selection.reduce((m1, index: number[]) => (
			index.length === 1
				? m1
				: m1.concat([[index[0]]])
		), [] as number[][]);

		this.trigger('update');
	}

	clearSelection() {
		if (this._selection.length) {
			this.select([]);
		}
	}

	getNearestVertex(lngLat: LngLat) {
		return nearestVertex(lngLat, this._featureCollection);
	}

	getNearestPointOnGeometry(lngLat: LngLat) {
		return nearestPointOnGeometry(lngLat, this._featureCollection);
	}

	getSelectedFeatureIndex() {
		return this._selection[0]
			? this._selection[0][0]
			: undefined;
	}

	getSelectedFeatureIndices() {
		return this._selection.map(([i]) => i);
	}

	getSelectedVertices(): Co[] {
		return this.getSelection().reduce((m, s) => {
			const l = s.length;
			const [_i, _j, _k, _l] = s;

			const {
				geometry: { coordinates },
				properties: { type }
			} = this.getFeatureAtIndex(_i);

			if (_j == null) {
				return type === POINT
					? m.concat([coordinates])
					: m;
			}

			return m.concat([
				l === 0
					? [0, 0]
					: l === 1
					? coordinates
					: l === 2
						? coordinates[_j]
						: l === 3
							? coordinates[_j][_k]
							: coordinates[_j][_k][_l]
			]);
		}, [] as Co[]);
	}

	setData(featureCollection: FeatureCollection) {
		this._featureCollection = featureCollection;

		this.trigger('update');
	}
}
