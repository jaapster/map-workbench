import { UIData } from '../types';
import {
	Action,
	ActionSetActiveTab,
	ActionSetPanelPosition,
	ActionSetPanelCollapsed } from './actions';

const STATE: UIData = {
	tabs: {},
	panels: {}
};

export const uiReducer = (state: UIData = STATE, action: Action): UIData => {
	if (ActionSetActiveTab.validate(action)) {
		const { tabGroupId, activeTab } = ActionSetActiveTab.data(action);

		return {
			...state,
			tabs: {
				...state.tabs,
				[tabGroupId]: {
					...state.tabs[tabGroupId],
					activeTab
				}
			}
		};
	}

	if (ActionSetPanelCollapsed.validate(action)) {
		const { panelGroupId, collapsed } = ActionSetPanelCollapsed.data(action);

		return {
			...state,
			panels: {
				...state.panels,
				[panelGroupId]: {
					...state.panels[panelGroupId],
					collapsed
				}
			}
		};
	}

	if (ActionSetPanelPosition.validate(action)) {
		const { panelGroupId, position } = ActionSetPanelPosition.data(action);

		return {
			...state,
			panels: {
				...state.panels,
				[panelGroupId]: {
					...state.panels[panelGroupId],
					position
				}
			}
		};
	}

	return state;
};
