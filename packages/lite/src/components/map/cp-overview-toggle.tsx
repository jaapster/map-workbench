import React from 'react';
import { State } from 'se';
import { Button } from 'lite/components/app/cp-button';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { overviewVisible } from 'lite/store/selectors/index.selectors';
import { ActionToggleOverview } from 'lite/store/actions/actions';

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
