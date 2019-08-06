import React from 'react';
import { mergeClasses } from '../app/utils/util-merge-classes';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { ActionSetActiveTab } from '../../reducers/actions';
import { State } from '../../types';
import { Button } from '../app/cp-button';

interface AttributeProps {
	open?: () => any;
	close?: () => any;
	first?: boolean;
	primary?: boolean;
	children?: any;
	position?: number;
	vertical?: boolean;
	horizontal?: boolean;
	onPointerDown?: (e: React.PointerEvent<HTMLDivElement>) => void;

	tabGroupId: string;
	tabs: any;
}

interface MappedStateProps {
	tabData?: any;
}

interface MappedDispatchProps {
	setActiveTab?: (tabGroup: string, tab: number) => void;
}

type Props = AttributeProps & MappedStateProps & MappedDispatchProps;

export const _PanelTabbed = (props: Props) => {
	const {
		primary,
		horizontal,
		position,
		first,
		onPointerDown,
		tabs,
		tabGroupId,
		tabData,
		open,
		close,
		setActiveTab
	} = props;

	const { activeTab } = tabData[tabGroupId] || { activeTab: 0 };

	const onTabClick = (tab: number) => {
		if (tab === activeTab) {
			if (close) {
				close();
			}

			if (setActiveTab) {
				setActiveTab(tabGroupId, -1);
			}
		} else {
			if (open) {
				open();
			}

			if (setActiveTab) {
				setActiveTab(tabGroupId, tab);
			}
		}
	};

	const className = mergeClasses(
		'panel',
		'panel-tabbed',
		{
			'panel-primary': primary
		}
	);

	const style = {
		[
			primary
				? horizontal
					? 'width'
					: 'height'
				: horizontal
					? first
						? 'right'
						: 'left'
					: first
						? 'bottom'
						: 'top'
			]: position
	};

	return (
		<div className={ className } style={ style }>
			<div className="active-content">
				{
					tabs[ activeTab ]
				}
			</div>
			<div className="toggles">
				{
					tabs.map((tab: any, i: number) => {
						return (
							<div key={ i } className="button-group">
								<Button
									onClick={ () => onTabClick(i) }
									depressed={ activeTab === i }
								>
									{ i }
								</Button>
							</div>
						);
					})
				}
			</div>
			{
				primary && activeTab > -1
					? (
						<div
							className="panel-drag-handle"
							onPointerDown={ onPointerDown }
						/>
					)
					: null
			}
		</div>
	);
};

const mapStateToProps = (state: State): MappedStateProps => (
	{
		tabData: state.ui.tabs
	}
);

const mapDispatchToProps = (dispatch: Dispatch): MappedDispatchProps => (
	{
		setActiveTab(tabGroupId: string, activeTab: number) {
			dispatch(ActionSetActiveTab.create({ tabGroupId, activeTab }));
		}
	}
);

export const PanelTabbed = connect(mapStateToProps, mapDispatchToProps)(_PanelTabbed);
