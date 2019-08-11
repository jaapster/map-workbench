import React from 'react';
import { PointSVG } from './geometries/cp-point';
import { CircleSVG } from './geometries/cp-circle';
import { PolygonSVG } from './geometries/cp-polygon';
import { RectangleSVG } from './geometries/cp-rectangle';
import { MultiPointSVG } from './geometries/cp-multi-point';
import { LineStringSVG } from './geometries/cp-line-string';
import { MultiPolygonSVG } from './geometries/cp-multi-polygon';
import { SelectedVertex } from './cp-selected-vertex';
import { MultiLineStringSVG } from './geometries/cp-multi-line-string';
import {
	POINT,
	CIRCLE,
	POLYGON,
	RECTANGLE,
	LINE_STRING,
	MULTI_POINT,
	MULTI_POLYGON,
	MULTI_LINE_STRING } from '../../constants';
import {
	Co,
	Feature,
	SelectionVector,
	FeatureCollection, State, Geometry
} from '../../types';
import { connect } from 'react-redux';
import { extent } from '../../reducers/selectors/index.selectors';

interface Props {
	extent: Feature<Geometry>;
	selection: SelectionVector[];
	featureCollection: FeatureCollection;
}

const getSelectedVertices = ({ features }: any, selection: any): Co[] => {
	return selection.reduce((m: any, s: any) => {
		const l = s.length;
		const [_i, _j, _k, _l] = s;

		const {
			geometry: { coordinates },
			properties: { type }
		} = features[_i];

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
};

export const _FeatureCollectionLayer = React.memo(({ featureCollection, selection }: Props) => {
	const selectedFeatureIndices = selection.map(([i]) => i);

	const f = featureCollection.features;

	return (
		<g>
			<g>
				{
					f
						.map((f, i) => {
							const p = {
								id: f.properties.id,
								key: f.properties.id,
								selected: selectedFeatureIndices.includes(i),
								coordinates: f.geometry.coordinates
							};

							switch (f.properties.type) {
								case POINT:
									return <PointSVG { ...p } />;
								case MULTI_POINT:
									return <MultiPointSVG { ...p } />;
								case LINE_STRING:
									return <LineStringSVG { ...p } />;
								case MULTI_LINE_STRING:
									return <MultiLineStringSVG { ...p } />;
								case POLYGON:
									return <PolygonSVG { ...p } />;
								case MULTI_POLYGON:
									return <MultiPolygonSVG { ...p } />;
								case CIRCLE:
									return <CircleSVG { ...p } />;
								case RECTANGLE:
									return <RectangleSVG { ...p } />;
								default:
									return null;
							}
						})
				}
			</g>
			<g>
				{
					getSelectedVertices(featureCollection, selection)
						.map((coordinates, i) => (
							<SelectedVertex
								key={ i }
								animate={ true }
								coordinates={ coordinates }
							/>
						))
				}
			</g>
		</g>
	);
});

const mapStateToProps = (state: State) => (
	{
		extent: extent(state)
	}
);

export const FeatureCollectionLayer = connect(mapStateToProps)(_FeatureCollectionLayer);
