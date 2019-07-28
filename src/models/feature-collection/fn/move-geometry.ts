import {
	Co,
	Cos,
	Point,
	FeatureCollectionData
} from '../../../types';
import {
	POINT,
	POLYGON,
	LINE_STRING,
	MULTI_POINT,
	MULTI_POLYGON,
	MULTI_LINE_STRING } from '../../../constants';
import {
	geoProject,
	geoUnproject } from '../../../map-control/utils/util-geo';

export const moveGeometry = (
	data: FeatureCollectionData,
	index: number[],
	{ x: dx, y: dy }: Point
) => {
	const moveCo = ([lng, lat]: Co) => {
		const { x, y } = geoProject({ lng, lat });
		const lngLat = geoUnproject({ x: x + dx, y: y + dy });
		return [lngLat.lng, lngLat.lat];
	};

	return {
		...data,
		features: data.features.map((feature, i) => {
			if (i === index[0]) {
				const { geometry,  geometry: { type, coordinates } } = feature;

				return {
					...feature,
					geometry: {
						...geometry,
						coordinates: type === POINT
							? moveCo(coordinates as Co)
							: (coordinates as any).map((c1: Cos) => (
								type === LINE_STRING || type === MULTI_POINT)
									? moveCo(c1 as Co)
									: type === POLYGON || type === MULTI_LINE_STRING
										? (c1 as Co[]).map(moveCo)
										: type === MULTI_POLYGON
											? (c1 as Co[][]).map(c2 => c2.map(moveCo))
											: c1
							)
					}
				};
			}

			return feature;
		})
	};
};
