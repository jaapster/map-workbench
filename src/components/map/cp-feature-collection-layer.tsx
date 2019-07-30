import bind from 'autobind-decorator';
import React from 'react';
import { Point } from './geometries/cp-point';
import { Circle } from './geometries/cp-circle';
import { Polygon } from './geometries/cp-polygon';
import { Rectangle } from './geometries/cp-rectangle';
import { MultiPoint } from './geometries/cp-multi-point';
import { LineString } from './geometries/cp-line-string';
import { MultiPolygon } from './geometries/cp-multi-polygon';
import { SelectedVertex } from './cp-selected-vertex';
import { MultiLineString } from './geometries/cp-multi-line-string';
import {
	POINT,
	CIRCLE,
	POLYGON,
	RECTANGLE,
	LINE_STRING,
	MULTI_POINT,
	MULTI_POLYGON,
	MULTI_LINE_STRING } from '../../constants';
import { MessageService } from '../../services/service.message';
import { Co, FeatureCollectionData, SelectionVector } from '../../types';

interface Props {
	featureCollection: FeatureCollectionData;
	selection: SelectionVector[];
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

@bind
export class FeatureCollectionLayer extends React.Component<Props> {
	componentDidMount() {
		MessageService.on('update:center', this._update);
		MessageService.on('update:zoom', this._update);
	}

	componentWillUnmount() {
		MessageService.off('update:center', this._update);
		MessageService.off('update:zoom', this._update);
	}

	private _update() {
		this.forceUpdate();
	}

	render() {
		const { featureCollection, selection } = this.props;

		const selectedFeatureIndices = selection.map(([i]) => i);

		return (
			<g>
				<g>
					{
						featureCollection.features.map((f, i) => {
							const p = {
								id: f.properties.id,
								key: f.properties.id,
								selected: selectedFeatureIndices.includes(i),
								coordinates: f.geometry.coordinates
							};

							switch (f.properties.type) {
								case POINT:
									return <Point { ...p } />;
								case MULTI_POINT:
									return <MultiPoint { ...p } />;
								case LINE_STRING:
									return <LineString { ...p } />;
								case MULTI_LINE_STRING:
									return <MultiLineString { ...p } />;
								case POLYGON:
									return <Polygon { ...p } />;
								case MULTI_POLYGON:
									return <MultiPolygon { ...p } />;
								case CIRCLE:
									return <Circle { ...p } />;
								case RECTANGLE:
									return <Rectangle { ...p } />;
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
	}
}
