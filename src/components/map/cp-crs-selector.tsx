import React from 'react';
import { EPSG } from '../../types';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { getCurrentCRS } from '../../reducers/selectors/index.selectors';
import { ActionSetMapControlCRS } from '../../reducers/actions';
import {
	Button,
	ButtonGroup } from '../app/cp-button';
import {
	PROJECTED,
	GEOGRAPHIC } from '../../constants';

interface Props {
	CRS: EPSG;
	setCRS: (CRS: EPSG) => void;
}

export const _CRSSelector = ({ CRS, setCRS }: Props) => (
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
);

const mapStateToProps = () => (
	{
		CRS: getCurrentCRS()
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
