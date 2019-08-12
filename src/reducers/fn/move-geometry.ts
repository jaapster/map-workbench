import { getBBox, getCircleBBox } from '../../utils/util-get-bbox';
import {
	Co,
	Cos,
	Pt,
	FeatureCollection } from '../../types';
import {
	POINT,
	POLYGON,
	LINE_STRING,
	MULTI_POINT,
	MULTI_POLYGON,
	MULTI_LINE_STRING, CIRCLE
} from '../../constants';
import {
	geoProject,
	geoUnproject } from '../../utils/util-geo';

export const moveGeometry = (
	data: FeatureCollection,
	index: number[],
	{ x: dx, y: dy }: Pt
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
				const { geometry,  geometry: { type, coordinates }, properties } = feature;

				const newCoordinates = type === POINT
					? moveCo(coordinates as Co)
					: (coordinates as any).map((c1: Cos) => (
						type === LINE_STRING || type === MULTI_POINT)
							? moveCo(c1 as Co)
							: type === POLYGON || type === MULTI_LINE_STRING
								? (c1 as Co[]).map(moveCo)
								: type === MULTI_POLYGON
									? (c1 as Co[][]).map(c2 => c2.map(moveCo))
									: c1
					);

				return {
					...feature,
					geometry: {
						...geometry,
						coordinates: newCoordinates
					},
					bbox: properties.type === CIRCLE
						? getCircleBBox(newCoordinates)
						: getBBox(newCoordinates)
				};
			}

			return feature;
		})
	};
};
