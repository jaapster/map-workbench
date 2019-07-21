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
				{
					model.getFeatures().map((f, i) => {
						const props = {
							key: i,
							id: f.properties.id,
							coordinates: f.geometry.coordinates,
							selected: selection.includes(i)
						};

						switch (f.properties.type) {
							case POINT:
								return <Point { ...props } />;
							case MULTI_POINT:
								return <MultiPoint { ...props } />;
							case LINE_STRING:
								return <LineString { ...props } />;
							case MULTI_LINE_STRING:
								return <MultiLineString { ...props } />;
							case POLYGON:
								return <Polygon { ...props } />;
							case MULTI_POLYGON:
								return <MultiPolygon { ...props } />;
							case CIRCLE:
								return <Circle { ...props } />;
							case RECTANGLE:
								return <Rectangle { ...props } />;
							default:
								return null;
						}
					})
				}
				{
					model.getSelectedVertices().map((coordinates, i) => (
						<SelectedVertex key={ `v${ i }`} coordinates={ coordinates } />
					))
				}
			</g>
		);
	}
}
