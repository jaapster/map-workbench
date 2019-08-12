import React from 'react';
import { extent } from '../../reducers/selectors/index.selectors';
import { connect } from 'react-redux';
// import { BBoxSVG } from './geometries/cp-bbox';
import { PointSVG } from './geometries/cp-point';
import { CircleSVG } from './geometries/cp-circle';
import { PolygonSVG } from './geometries/cp-polygon';
import { bboxOverlap } from '../../utils/util-bbox-overlap';
import { RectangleSVG } from './geometries/cp-rectangle';
import { MultiPointSVG } from './geometries/cp-multi-point';
import { LineStringSVG } from './geometries/cp-line-string';
import { MultiPolygonSVG } from './geometries/cp-multi-polygon';
import { SelectedVertex } from './cp-selected-vertex';
import { MultiLineStringSVG } from './geometries/cp-multi-line-string';
import { getSelectedVertices } from '../../utils/util-get selected-vertices';
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
	State,
	Feature,
	Geometry,
	SelectionVector,
	FeatureCollection } from '../../types';

interface Props {
	extent: Feature<Geometry>;
	selection: SelectionVector[];
	featureCollection: FeatureCollection;
}

export const _FeatureCollectionLayer = React.memo(({ extent, featureCollection, selection }: Props) => {
	const selectedFeatureIndices = selection.map(([i]) => i);

	return (
		<g>
			<g>
				{
					featureCollection.features
						.map(({ geometry: { coordinates }, properties: { id, type }, bbox }, i) => {
							if (!bboxOverlap(bbox, extent.bbox)) {
								return null;
							}

							const selected = selectedFeatureIndices.includes(i);

							const p = { id, selected, coordinates };

							return (
								<g key={ id }>
									{
										// selected && bbox
										// 	? <BBoxSVG bbox={ bbox } />
										// 	: null
									}
									{
										type === POINT
											? <PointSVG {...p} />
											: type === MULTI_POINT
												? <MultiPointSVG { ...p } />
												: type === LINE_STRING
													? <LineStringSVG { ...p } />
													: type === MULTI_LINE_STRING
														? <MultiLineStringSVG { ...p } />
														: type === POLYGON
															? <PolygonSVG { ...p } />
															: type === MULTI_POLYGON
																? <MultiPolygonSVG { ...p } />
																: type === RECTANGLE
																	? <RectangleSVG { ...p } />
																	: type === CIRCLE
																		? <CircleSVG { ...p } />
																		: null
									}
								</g>
							);
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
