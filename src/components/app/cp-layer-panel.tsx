import React from 'react';
import { MapControl } from '../../map-control/map-control';
import { FeatureCollectionModel } from '../../models/feature-collection/feature-collection.model';

interface Props {
	model: FeatureCollectionModel;
}

export class LayerPanel extends React.Component<Props> {
	componentDidMount() {
		const { model } = this.props;

		model.on('update', () => this.forceUpdate());
	}

	componentWillUnmount() {
		const { model } = this.props;

		model.off('update', () => this.forceUpdate());
	}

	render() {
		const { model } = this.props;
		const indices = model.getSelection().map(([i]: any) => i);

		return (
			<div key={ model.getTitle() } className="side">
				<h2>{ model.getTitle() }</h2>
				{
					model.getFeatures().map((feature: any, j: number) => (
						<div
							key={ feature.properties.id }
							className={
								`feature ${
									indices.includes(j)
										? 'selected'
										: ''
								}`
							}
							onClick={ (e: React.MouseEvent<HTMLElement>) => {
								model.select([j], e.shiftKey);
							} }
							onDoubleClick={ () => {
								MapControl.fitFeature(model.getFeatureAtIndex(j));
							} }
						>
							{ feature.properties.type }
							<div
								className="delete"
								onClick={ (e: React.MouseEvent<HTMLElement>) => {
									e.stopPropagation();

									model.select([j], e.shiftKey);
									model.deleteSelection();
								} }
							>
								&#10761;
							</div>
						</div>
					))
				}
			</div>
		);
	}
}
