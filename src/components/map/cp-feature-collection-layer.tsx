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
import { FeatureCollection } from '../../models/feature-collection/model.feature-collection';
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

interface Props {
	model: FeatureCollection;
}

@bind
export class FeatureCollectionLayer extends React.Component<Props> {
	componentDidMount() {
		const { model } = this.props;

		model.on('update', this._update);

		MessageService.on('update:center', this._update);
		MessageService.on('update:zoom', this._update);
	}

	componentWillUnmount() {
		const { model } = this.props;

		model.off('update', this._update);

		MessageService.off('update:center', this._update);
		MessageService.off('update:zoom', this._update);
	}

	private _update() {
		this.forceUpdate();
	}

	render() {
		const { model } = this.props;

		const selection = model.getSelectedFeatureIndices();

		return (
			<g>
				<g>
					{
						model.getFeatures().map((f, i) => {
							const p = {
								id: f.properties.id,
								key: f.properties.id,
								selected: selection.includes(i),
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
						model.getSelectedVertices().map((coordinates, i) => (
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
