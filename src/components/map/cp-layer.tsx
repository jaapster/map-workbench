import bind from 'autobind-decorator';
import React from 'react';
import { Point } from './cp-point';
import { Circle } from './cp-circle';
import { Polygon } from './cp-polygon';
import { Rectangle } from './cp-rectange';
import { MultiPoint } from './cp-multi-point';
import { LineString } from './cp-line-string';
import { MapControl } from '../../map-control/map-control';
import { MultiPolygon } from './cp-multi-polygon';
import { SelectedVertex } from './cp-selected-vertex';
import { MultiLineString } from './cp-multi-line-string';
import { FeatureCollectionModel } from '../../models/feature-collection/feature-collection.model';
import {
	POINT,
	CIRCLE,
	POLYGON,
	RECTANGLE,
	LINE_STRING,
	MULTI_POINT,
	MULTI_POLYGON,
	MULTI_LINE_STRING } from '../../constants';

interface Props {
	model: FeatureCollectionModel;
}

@bind
export class Layer extends React.Component<Props> {
	componentDidMount() {
		const { model } = this.props;

		model.on('update', this._update);

		MapControl.instance.on('move', this._update);
		MapControl.instance.on('zoom', this._update);
	}

	componentWillUnmount() {
		const { model } = this.props;

		model.off('update', this._update);

		MapControl.instance.off('move', this._update);
		MapControl.instance.off('zoom', this._update);
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
