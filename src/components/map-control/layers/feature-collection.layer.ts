import bind from 'autobind-decorator';
import { geoDis, coToLl } from '../utils/util-geo';
import { toPairs } from '../utils/util-list';
import { multiPointToCircle } from '../utils/util-geo-json';
import { FeatureCollectionModel } from '../../../models/feature-collection/feature-collection.model';
import {
	Co,
	Feature,
	LineString, MultiPoint } from '../../../types';
import {
	POINT,
	EMPTY,
	CIRCLE,
	VERTEX,
	FEATURE,
	POLYGON,
	SEGMENT,
	PRECISION,
	LINE_STRING,
	MULTI_POINT,
	MULTI_POLYGON,
	MULTI_LINE_STRING } from '../../../constants';
import { isClockwise } from '../utils/util-math';

export const realise = (features: Feature<any>[]) =>
	features.reduce((m1, f1) => (
		f1.properties.type === CIRCLE
			? m1.concat(multiPointToCircle(f1 as Feature<MultiPoint>))
			: m1.concat([f1])
	), [] as Feature<any>[]);

export const foo = (ring: Co[], i: number) => {
	if (i % 2) {
		return !isClockwise(ring)
			? ring
			: ring.slice().reverse();
	}

	return isClockwise(ring)
		? ring
		: ring.slice().reverse();
};

const emptySource = {
	type: 'geojson',
	data: EMPTY
};

@bind
export class FeatureCollectionLayer {
	private readonly _map: any;
	private readonly _style: any;
	private readonly _model: FeatureCollectionModel;

	static create(map: any, model: FeatureCollectionModel, style: any) {
		return new FeatureCollectionLayer(map, model, style);
	}

	constructor(map: any, model: FeatureCollectionModel, style: any) {
		this._map = map;
		this._model = model;
		this._style = style;

		this._model.on('update', this._render);
		this._map.on('style.load', this._onStyleLoaded);
	}

	private _onStyleLoaded() {
		this._map.addSource(`${ this._style.source }`, emptySource);
		this._map.addSource(`${ this._style.source }Selected`, emptySource);

		this._style.layers.forEach((layer: any) => this._map.addLayer(layer));

		this._render(true);
	}

	private _render(forceDrawNonSelected: boolean = false) {
		const { source } = this._style;

		if (this._model.prevIndex !== this._model.index[0] || forceDrawNonSelected) {
			this._map.getSource(source).setData({
				...this._model.data,
				features: this._model.data.features.reduce((m1, f1, i) => (
					i !== this._model.index[0]
						? m1.concat(realise([f1]))
						: m1
				), [])
			});
		}

		if (this._model.index.length) {
			const { features } = this._model.data;
			const [_i, _j, _k, _l] = this._model.index;
			const l = this._model.index.length;

			const { geometry: { type, coordinates }, properties: { id } } = features[_i];

			this._map.getSource(`${ source }Selected`).setData({
				...this._model.data,
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
								type: VERTEX,
								id
							}
						}
					])
					.concat(
						this._model.index.length
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
									type: 'selected-vertex',
									id
								}
							}]
							: []
					)
					.concat(
						(
							type === LINE_STRING
								? [coordinates]
								: type === MULTI_LINE_STRING
									? coordinates
									: type === POLYGON
										? coordinates.map(foo)
										: type === MULTI_POLYGON
											? coordinates.flat(1).map(foo)
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
														coToLl(xs[j - 1]),
														coToLl(co2)
													).toFixed(PRECISION)
												}`,
												id
											}
										})
								), m1)
							), [] as Feature<LineString>[])
					)
			});
		} else {
			this._map.getSource(`${ source }Selected`).setData(EMPTY);
		}
	}
}
