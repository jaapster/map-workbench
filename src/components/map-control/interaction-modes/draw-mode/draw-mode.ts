import { dis } from '../../utils/util-point';
import { dropLast } from '../../utils/util-list';
import { THRESHOLD } from '../../../../services/constants';
import { InteractionMode } from '../interaction-mode';
import { FeatureCollectionLayer } from '../layer-feature-collection';
import {
	coToLngLat,
	lngLatToCo } from '../../utils/util-lng-lat-to-co';
import {
	newPolygon,
	newLineString } from './new-feature';

export class DrawMode extends InteractionMode {
	static create(map: any) {
		return new DrawMode(map);
	}

	private _model?: FeatureCollectionLayer;

	onPointerDown(e: any) {
		if (!this._model) {
			return;
		}

		const co = lngLatToCo(e.lngLat);

		if (!this._model.index.length) {
			this._model.addFeature(newLineString([co, co]));
		} else {
			const [_i] = this._model.index;
			const {
				geometry: { coordinates: cos }
			} = this._model.data.features[_i];

			if (cos.length > 2) {
				const p0 = this._map.project(coToLngLat(cos[0]));

				if (dis(p0, e.point) < THRESHOLD) {
					this._model.data = {
						...this._model.data,
						features: this._model.data.features.map((f, i) => (
							i !== _i
								? f
								: newPolygon([dropLast(1, cos).concat([cos[0]])])
						))
					};

					this.trigger('finishDrawing');

					return;
				}
			}

			this._model.addAtIndex(co, [_i, cos.length - 1]);
		}
	}

	onPointerMove(e: any) {
		if (!this._model) {
			return;
		}

		const [_i] = this._model.index;

		if (!_i) {
			return;
		}

		const { geometry: { coordinates } } = this._model.data.features[_i];

		this._model.updateCoordinates([
			[[_i, coordinates.length - 1], lngLatToCo(e.lngLat)]
		]);
	}

	onPointerDblClick() {
		if (!this._model) {
			return;
		}

		const [_i] = this._model.index;

		if (!_i) {
			return;
		}

		this._model.data = {
			...this._model.data,
			features: this._model.data.features.map((f, i) => (
				i !== _i
					? f
					: {
						...f,
						geometry: {
							...f.geometry,
							coordinates: dropLast(2, f.geometry.coordinates)
						}
					}
			))
		};

		this.trigger('finishDrawing');
	}

	setModel(model: any) {
		this._model = model;
	}
}
