import bind from 'autobind-decorator';
import { geoDis } from '../utils/util-geo';
import { layers } from './draw-mode/draw-mode-layers';
import { realise } from './draw-mode/realise-features';
import { toPairs } from '../utils/util-to-pairs';
import { coToLngLat } from '../utils/util-lng-lat-to-co';
import { addAtIndex } from './draw-mode/add-at-index';
import { moveGeometry } from './draw-mode/move-geometry';
import { deleteAtIndex } from './draw-mode/delete-at-index';
import { nearestVertex } from './draw-mode/nearest-vertex';
import { updateCoordinates } from './draw-mode/update-coordinate';
import { setPropertyAtIndex } from './draw-mode/set-property-at-index';
import { nearestPointOnGeometry } from './draw-mode/nearest-point-on-geometry';
import {
	Co,
	Point,
	Feature,
	LineString,
	FeatureCollection, LngLat
} from '../../../types';
import {
	POINT,
	EMPTY,
	FEATURE,
	POLYGON,
	SEGMENT,
	PRECISION,
	LINE_STRING,
	MULTI_POINT,
	MULTI_POLYGON,
	MULTI_LINE_STRING } from '../../../services/constants';

@bind
export class FeatureCollectionLayer {
	private readonly _map: any;

	private _data: FeatureCollection;
	private _index: number[];
	private _prevIndex: number;

	static create(map: any, data: FeatureCollection) {
		return new FeatureCollectionLayer(map, data);
	}

	constructor(map: any, data: FeatureCollection) {
		this._map = map;
		this._data = data;
		this._index = [];
		this._prevIndex = -1;

		this._map.on('style.load', this._onStyleLoaded);
	}

	get data(): FeatureCollection {
		return this._data;
	}

	set data(data: FeatureCollection) {
		this._data = data;
		this._render();
	}

	get index(): number[] {
		return this._index;
	}

	set index(index: number[]) {
		this._index = index;
		this._render();
	}

	private _onStyleLoaded() {
		this._map.addSource('draw', {
			type: 'geojson',
			data: EMPTY
		} as any);

		this._map.addSource('draw-selected', {
			type: 'geojson',
			data: EMPTY
		} as any);

		layers.forEach(layer => this._map.addLayer(layer as any));

		this._render(true);
	}

	private _render(forceDrawNonSelected: boolean = false) {
		if (this._prevIndex !== this._index[0] || forceDrawNonSelected) {
			this._prevIndex = this._index[0];

			this._map.getSource('draw').setData({
				...this._data,
				features: this._data.features.reduce((m1, f1, i) => (
					i !== this._index[0]
						? m1.concat(realise([f1]))
						: m1
				), [])
			});
		}

		if (this._index.length) {
			const { features } = this._data;
			const [_i, _j, _k, _l] = this._index;
			const l = this._index.length;

			const { geometry: { type, coordinates } } = features[_i];

			this._map.getSource('draw-selected').setData({
				...this._data,
				features: ([] as Feature<any>[])
					.concat(
						realise([features[_i]])
					)
					.concat([
						{
							type: FEATURE,
							geometry: {
								type: MULTI_POINT,
								coordinates: (
									type === POINT
										? [coordinates]
										: toPairs((coordinates).flat(4))
								)
							},
							properties: {
								type: 'vertex'
							}
						}
					])
					.concat(
						this._index.length
							? [{
								type: FEATURE,
								geometry: {
									type: POINT,
									coordinates:
										l === 1
											? coordinates
											: l === 2
											? coordinates[_j]
											: l === 3
												? coordinates[_j][_k]
												: coordinates[_j][_k][_l]
								},
								properties: {
									type: 'selected-vertex'
								}
							}]
							: []
					)
					.concat(
						(
							type === LINE_STRING
								? [coordinates]
								: type === MULTI_LINE_STRING || type === POLYGON
								? coordinates
								: type === MULTI_POLYGON
									? coordinates.flat(1)
									: []
						)
							.reduce((m1: any, co1: Co[]) => (
								co1.reduce((
									m2: Feature<LineString>[],
									co2: Co,
									j: number,
									xs: Co[]
								) => (
									j === 0
										? m2
										: m2.concat({
											type: FEATURE,
											geometry: {
												type: LINE_STRING,
												coordinates: [xs[j - 1], co2]
											},
											properties: {
												type: SEGMENT,
												text: `${
													geoDis(
														coToLngLat(xs[j - 1]),
														coToLngLat(co2)
													).toFixed(PRECISION)
												}`
											}
										})
								), m1)
							), [] as Feature<LineString>[])
					)
			});
		} else {
			this._map.getSource('draw-selected').setData(EMPTY);
		}
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
			index != null
				? index
				: this._index,
			coordinate
		);
	}

	deleteAtIndex() {
		if (this._index.length) {
			this._data = deleteAtIndex(this.data, this._index);
			this._index = this._index.length === 1
				? []
				: [this._index[0]];

			this._render();
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
