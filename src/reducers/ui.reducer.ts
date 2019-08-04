import { UIData } from '../types';
import {
	Action,
	ActionSetActiveTab,
	ActionSetPanelCollapsed, ActionShowPropertiesPanel
} from './actions';

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

	if (ActionShowPropertiesPanel.validate(action)) {
		return {
			...state,
			tabs: {
				...state.tabs,
				mainTabs: {
					...state.tabs.mainTabs,
					activeTab: 0
				}
			},
			panels: {
				...state.panels,
				sidePanelsRight: {
					...state.tabs.sidePanelsRight,
					collapsed: false
				}
			}
		};
	}

	return state;
};
