import bind from 'autobind-decorator';
import { POINT } from '../../constants';
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
		// check if already selected
		const same = this._selection.find(v => (
			JSON.stringify(v) === JSON.stringify(index)
		));

		if (same) {
			if (!add) {
				// selecting the same thing again
				return;
			}

			this._selection = this._selection.filter(v => (
				JSON.stringify(v) !== JSON.stringify(index)
			));
		} else {
			this._selection = index.length
				? add
					? [...this._selection, index]
					: [index]
				: [];
		}

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
		let selection = this._selection.slice();

		while (selection.length) {
			const v = selection.pop();

			if (v && v.length) {
				this._featureCollection = deleteAtIndex(this._featureCollection, v);

				if (v.length === 1) {
					selection = selection.reduce((m, w) => (
						w[0] === v[0]
							? m
							: w[0] > v[0]
								? m.concat([[w[0] - 1, ...w.slice(1)]])
								: m.concat([w])
					), [] as any);
				} else if (v.length === 2) {
					selection = selection.reduce((m, w) => (
						w[0] === v[0]
							? w[1] === v[1]
								? m
								: w[1] > v[1]
									? m.concat([w[0], w[1] - 1, ...w.slice(2)])
									: m.concat([w])
							: m.concat([w])
					), [] as any);
				} else if (v.length === 3) {
					selection = selection.reduce((m, w) => (
						w[0] === v[0] &&
						w[1] === v[1]
							? w[2] === v[2]
								? m
								: w[2] > v[2]
									? m.concat([w[0], w[1], w[2] - 1])
									: m.concat([w])
							: m.concat([w])
					), [] as any);
				}
			}
		}

		this._selection = [];

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
