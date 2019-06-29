import { InteractionMode } from '../interaction-mode';
import { updateCoordinate } from './update-coordinate';
import { nearestCoordinate } from './nearest-coordinate';
import { layers } from './draw-mode-layers';
import { data } from './draw-mode-dev-data';
import { POINT, FEATURE, THRESHOLD } from '../../../../services/constants';
import { FeatureCollection, Co } from '../../../../types';

export class DrawMode extends InteractionMode {
	static create(map: any) {
		return new	DrawMode(map);
	}

	_index: number[] | null = null;
	_data: FeatureCollection = data;

	onPointerDown(e: any) {
		// look for the nearest geometry coordinate
		const { coordinate, distance, index } = nearestCoordinate(
			e.point,
			this._data,
			this._map.project.bind(this._map)
		);

		this._index = distance < THRESHOLD ? index : null;

		this._data = {
			...this._data,
			features: this._data.features.map((feature, i) => {
				return {
					...feature,
					properties: {
						...(feature.properties || {}),
						selected: distance < THRESHOLD && i === index[0]
					}
				};
			})
		};

		this.draw(this._data, distance < THRESHOLD ? coordinate : null);
	}

	onPointerDragMove({ lngLat: { lng, lat } }: any) {
		if (this._index != null) {
			this._data = updateCoordinate(this._data, this._index, [lng, lat]);
			this.draw(this._data, [lng, lat]);
		}
	}

	onStyleLoaded() {
		this._map.addSource('draw', { type: 'geojson', data: this._data });
		layers.forEach(layer => this._map.addLayer(layer));
	}

	draw(data: any, coordinates: Co | null) {
		this._map.getSource('draw').setData(
			coordinates != null
				? {
					...data,
					features: [
						...data.features,
						{
							type: FEATURE,
							geometry: {
								type: POINT,
								coordinates
							},
							properties: {
								type: 'vertex'
							}
						}
					]
				}
				: data
		);
	}
}
