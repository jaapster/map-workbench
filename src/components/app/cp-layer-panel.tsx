import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { MapControl } from '../../map-control/map-control';
import { Properties } from './cp-properties';
import {
	State,
	SelectionVector,
	FeatureCollectionData } from '../../types';
import {
	currentCollectionId,
	currentSelectionVectors,
	currentFeatureCollection } from '../../reducers/selectors/index.selectors';
import {
	ActionSelect,
	ActionDeleteSelection } from '../../reducers/actions';

interface Props {
	del: (collectionId: string, vector: SelectionVector) => void;
	select: (props: { collectionId: string, vector: SelectionVector, multi: boolean }) => void;
	selection: SelectionVector[];
	collectionId: string;
	featureCollection: FeatureCollectionData;
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
			<h2>{ collectionId }</h2>
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
			dispatch(ActionSelect.create({ collectionId, vector, multi: false }));
			dispatch(ActionDeleteSelection.create({ collectionId }));
		}
	}
);

export const LayerPanel = connect(mapStateToProps, mapDispatchToProps)(_LayerPanel);
