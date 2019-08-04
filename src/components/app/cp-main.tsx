import React from 'react';
import './scss/cp-main.scss';
import './scss/list.scss';
import { Map } from '../map/cp-map';
import { Panel } from '../panels/cp-panel';
import { Selection } from './cp-selection';
import { PanelPair } from '../panels/cp-panel-pair';
import { LOCATIONS } from '../../constants';
import { Locations } from './cp-locations';
import { MapControl } from '../../map-control/map-control';
import { LayerPanels } from '../map/cp-layer-panels';
import { PanelTabbed } from '../panels/cp-panel-tabbed';

export const Main = React.memo(() => {
	return (
		<div className="app">
			<PanelPair
				panelGroupId="sidePanelsRight"
				horizontal
				max={ 500 }
				min={ 300 }
				initial={ 300 }
				onResize={ MapControl.resize }
			>
				<Panel>
					<PanelPair
						panelGroupId="sidePanelsLeft"
						fixed
						horizontal
						initial={ 0 }
						onResize={ MapControl.resize }
					>
						<Panel primary />
						<Panel>
							<PanelPair
								panelGroupId="header"
								fixed
								vertical
								initial={ 0 }
								onResize={ MapControl.resize }
							>
								<Panel primary />
								<Panel>
									<Map />
								</Panel>
							</PanelPair>
						</Panel>
					</PanelPair>
				</Panel>
				<PanelTabbed
					primary
					tabGroupId="mainTabs"
					tabs={
						[
							<Selection />,
							<LayerPanels />,
							<Locations locations={ LOCATIONS } />
						]
					}
				>
				</PanelTabbed>
			</PanelPair>
		</div>
	);
});
