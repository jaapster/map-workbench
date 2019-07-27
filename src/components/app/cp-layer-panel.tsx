import bind from 'autobind-decorator';
import React from 'react';
import { MapControl } from '../../map-control/map-control';
import { FeatureCollection } from '../../models/feature-collection/model.feature-collection';
import { Properties } from './cp-properties';

interface Props {
	model: FeatureCollection;
}

@bind
export class LayerPanel extends React.Component<Props> {
	componentDidMount() {
		const { model } = this.props;

		model.on('update', this._update);
	}

	componentWillUnmount() {
		const { model } = this.props;

		model.off('update', this._update);
	}

	private _update() {
		this.forceUpdate();
	}

	render() {
		const { model } = this.props;
		const indices = model.getSelection().map(([i]: any) => i);

		return (
			<Properties>
				<h2>{ model.getTitle() }</h2>
				<div className="list">
					{
						model.getFeatures().map((feature: any, j: number) => (
							<div
								key={ feature.properties.id }
								className={
									`list-item ${
										indices.includes(j)
											? 'selected'
											: ''
									}`
								}
								onClick={ (e: React.MouseEvent<HTMLElement>) => {
									model.select([j], e.shiftKey);
								} }
								onDoubleClick={ () => {
									MapControl.fitFeatures([model.getFeatureAtIndex(j)]);
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
			</Properties>
		);
	}
}
