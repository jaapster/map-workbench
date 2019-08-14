import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { capitalize } from '../../utils/util-string';
import { MapControl } from '../../misc/map-control/map-control';
import { Properties } from './cp-properties';
import {
	State,
	SelectionVector,
	FeatureCollection } from '../../types';
import {
	currentCollectionId,
	currentSelectionVectors,
	currentFeatureCollection } from '../../store/selectors/index.selectors';
import {
	ActionSelect,
	ActionDeleteSelection } from '../../store/actions/actions';
import { batchActions } from 'redux-batched-actions';

interface Props {
	del: (collectionId: string, vector: SelectionVector) => void;
	select: (props: { collectionId: string, vector: SelectionVector, multi: boolean }) => void;
	selection: SelectionVector[];
	collectionId: string;
	featureCollection: FeatureCollection;
}

export const _LayerPanel = React.memo((props: Props) => {
	const {
		del,
		select,
		selection,
		collectionId,
		featureCollection } = props;

	const indices = selection.map(([i]: any) => i);

	return (
		<Properties>
			<h2>{ capitalize(collectionId) }</h2>
			<div className="list">
				{
					featureCollection.features.map((feature: any, j: number) => (
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
								select({ collectionId, vector: [j], multi: e.shiftKey });
							} }
							onDoubleClick={ () => {
								MapControl.fitFeatures([featureCollection.features[j]]);
							} }
						>
							{ feature.properties.type }
							<div
								className="delete"
								onClick={ (e: React.MouseEvent<HTMLElement>) => {
									e.stopPropagation();

									del(collectionId, [j]);
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
});

const mapStateToProps = (state: State) => (
	{
		selection: currentSelectionVectors(state),
		collectionId: currentCollectionId(state),
		featureCollection: currentFeatureCollection(state)
	}
);

const mapDispatchToProps = (dispatch: Dispatch) => (
	{
		select(props: { collectionId: string, vector: SelectionVector, multi: boolean }) {
			dispatch(ActionSelect.create(props));
		},

		del(collectionId: string, vector: SelectionVector) {
			dispatch(batchActions([
				ActionSelect.create({ vector, multi: false }),
				ActionDeleteSelection.create({ collectionId })
			]));
		}
	}
);

export const LayerPanel = connect(mapStateToProps, mapDispatchToProps)(_LayerPanel);
