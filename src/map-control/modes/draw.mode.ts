import { Ev } from '../../types';
import { dis } from '../utils/util-point';
import { dropLast } from '../utils/util-list';
import { THRESHOLD } from '../../constants';
import { InteractionMode } from './interaction.mode';
import { FeatureCollectionModel } from '../../models/feature-collection/feature-collection.model';
import {
	coToLl,
	llToCo } from '../utils/util-geo';
import {
	newPolygon,
	newLineString } from '../utils/util-geo-json';

export class DrawMode extends InteractionMode {
	static create(map: any) {
		return new DrawMode(map);
	}

	private _model?: FeatureCollectionModel;

	onPointerDown(e: Ev) {
		if (!this._model && true) {
			return;
		}

		const co = llToCo(e.lngLat);

		if (this._model.getSelectedFeatureIndex() == null) {
			this._model.addFeature(newLineString([co, co]));
		} else {
			const _i = this._model.getSelectedFeatureIndex();

			if (_i == null) {
				return;
			}

			const {
				geometry: { coordinates: cos }
			} = this._model.getFeatureAtIndex(_i);

			if (cos.length > 2) {
				const p0 = this._map.project(coToLl(cos[0]));

				if (dis(p0, e.point) < THRESHOLD) {
					this._model.setFeatureCollection({
						...this._model.getFeatureCollection(),
						features: this._model.getFeatures().map((f, i) => (
							i !== _i
								? f
								: newPolygon([dropLast(1, cos).concat([cos[0]])])
						))
					});

					this.trigger('finish');

					return;
				}
			}

			this._model.addAtIndex(co, [_i, cos.length - 1]);
		}
	}

	onPointerMove(e: Ev) {
		if (!this._model) {
			return;
		}

		const _i = this._model.getSelectedFeatureIndex();

		if (_i == null) {
			return;
		}

		const { geometry: { coordinates } } = this._model.getFeatureAtIndex(_i);

		this._model.updateCoordinates([
			[[_i, coordinates.length - 1], llToCo(e.lngLat)]
		]);
	}

	onPointerUp(e: Ev) {}

	onPointerDblClick() {
		if (!this._model) {
			return;
		}

		const _i = this._model.getSelectedFeatureIndex();

		if (_i == null) {
			return;
		}

		this._model.setFeatureCollection({
			...this._model.getFeatureCollection(),
			features: this._model.getFeatures().map((f, i) => (
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
		});

		this.trigger('finish');
	}

	onEscapeKey() {
		if (this._model) {
			this._model.deleteSelection();
			this._model.clearSelection();
		}

		this.trigger('finish');
	}

	setModel(model: FeatureCollectionModel) {
		this._model = model;
	}
}
