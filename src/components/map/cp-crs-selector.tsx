import React from 'react';
import { crs } from '../../store/selectors/index.selectors';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { ActionSetMapControlCRS } from '../../store/actions/actions';
import {
	EPSG,
	State } from '../../types';
import {
	Button,
	ButtonGroup } from '../app/cp-button';
import {
	PROJECTED,
	GEOGRAPHIC } from '../../constants/constants';

interface Props {
	CRS: EPSG;
	setCRS: (CRS: EPSG) => void;
}

export const _CRSSelector = React.memo(({ CRS, setCRS }: Props) => (
	<ButtonGroup>
		<Button
			onClick={ () => setCRS(PROJECTED) }
			depressed={ CRS === PROJECTED }
		>
			{ PROJECTED }
		</Button>
		<Button
			onClick={ () => setCRS(GEOGRAPHIC) }
			depressed={ CRS === GEOGRAPHIC }
		>
			{ GEOGRAPHIC }
		</Button>
	</ButtonGroup>
));

const mapStateToProps = (state: State) => (
	{
		CRS: crs(state)
	}
);

const mapDispatchToProps = (dispatch: Dispatch) => (
	{
		setCRS(CRS: EPSG) {
			dispatch(ActionSetMapControlCRS.create({ CRS }));
		}
	}
);

export const CRSSelector = connect(mapStateToProps, mapDispatchToProps)(_CRSSelector);
