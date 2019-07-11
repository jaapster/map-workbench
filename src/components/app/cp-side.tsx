import React from 'react';
import bind from 'autobind-decorator';
import './style/cp-side.scss';
import { MapControl } from '../map-control/cp-map-control';
import { capitalize } from '../map-control/utils/util-string';
import { FeatureCollectionModel } from '../../models/feature-collection/feature-collection.model';

interface Props {
	model: FeatureCollectionModel;
}

@bind
export class Side extends React.Component<Props> {
	componentDidMount() {
		const { model } = this.props;

		model.on('update', this._onModelUpdate);
	}

	componentWillUnmount() {
		const { model } = this.props;

		model.off('update', this._onModelUpdate);
	}

	_onModelUpdate() {
		this.forceUpdate();
	}

	render() {
		const { model } = this.props;

		return (
			<div className="side">
				<h2>
					{ capitalize(model.title) }
				</h2>
				{
					model.data.features.map((feature: any, i: number) => {
						return (
							<div
								key={ feature.properties.id }
								className={
									`feature ${
										model.index[0] === i
											? 'selected'
											: ''
									}`
								}
								onClick={ (e: React.MouseEvent<HTMLElement>) => MapControl.select(model, [i], e.shiftKey) }
							>
								{ feature.properties.type }
								<div
									className="delete"
									onClick={ (e: React.MouseEvent<HTMLElement>) => {
										e.stopPropagation();
										model.select([i]);
										model.deleteSelection();
									} }
								>
									x
								</div>
							</div>
						);
					})
				}
			</div>
		);
	}
}
