import { Co, FeatureCollection, ProjectFn, UnprojectFn } from '../../../../types';
import {
	POINT,
	POLYGON,
	LINE_STRING,
	MULTI_POINT,
	MULTI_POLYGON,
	MULTI_LINE_STRING
} from '../../../../services/constants';

export const moveGeometry = (data: FeatureCollection, index: number[], dx: number, dy: number, project: ProjectFn, unproject: UnprojectFn) => {
	const moveCo = ([lng, lat]: Co) => {
		const { x, y } = project({ lng, lat });
		const lngLat = unproject({ x: x + dx, y: y + dy });
		return [lngLat.lng, lngLat.lat];
	};

	return {
		...data,
		features: data.features.map((feature, i) => {
			// @ts-ignore
			if (i === index[0]) {
				const { geometry: { type, coordinates } } = feature;
				return {
					...feature,
					geometry: {
						...feature.geometry,
						// @ts-ignore
						coordinates: type === POINT
							? moveCo(coordinates as Co)
							: (coordinates as any).map((c1: any) => {
								if (type === LINE_STRING || type === MULTI_POINT) {
									return moveCo(c1 as Co);
								}

								if (type === POLYGON || type === MULTI_LINE_STRING) {
									return (c1 as Co[]).map(moveCo);
								}

								if (type === MULTI_POLYGON) {
									return (c1 as Co[][]).map(c2 => c2.map(moveCo));
								}

								return c1;
							})
					}
				};
			}

			return feature;
		})
	};
};