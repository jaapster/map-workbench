import { Button } from '../app/cp-button';
import React from 'react';
import { State } from '../../types';
import { overviewVisible } from '../../store/selectors/index.selectors';
import { Dispatch } from 'redux';
import { ActionToggleOverview } from '../../store/actions/actions';
import { connect } from 'react-redux';

interface Props {
	toggle: () => void;
	overviewVisible: boolean;
}

export const _OverViewToggle = React.memo(({ overviewVisible, toggle }: Props) => {
	return (
		<div className="button-group">
			<Button onClick={ toggle } depressed={ overviewVisible }>
				<i className={
					overviewVisible
						? 'icon-arrow-up-right'
						: 'icon-arrow-down-left'
				} />
			</Button>
		</div>
	);
});

const mapStateToProps = (state: State) => (
	{
		overviewVisible: overviewVisible(state)
	}
);

const mapDispatchToProps = (dispatch: Dispatch) => (
	{
		toggle() {
			dispatch(ActionToggleOverview.create({}));
		}
	}
);

export const OverViewToggle = connect(mapStateToProps, mapDispatchToProps)(_OverViewToggle);
