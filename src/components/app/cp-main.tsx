import React from 'react';
import './scss/cp-main.scss';
import './scss/list.scss';
import { Map } from '../map/cp-map';
import { Panel } from '../panels/cp-panel';
import { Settings } from './cp-settings';
import { Selection } from './cp-selection';
import { PanelPair } from '../panels/cp-panel-pair';
import { Bookmarks } from './cp-locations';
import { MapControl } from '../../map-control/map-control';
import { LayerPanels } from '../map/cp-layer-panels';
import { PanelTabbed } from '../panels/cp-panel-tabbed';
import { MultiverseSettings } from './cp-multiverse';

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
							[<i className="icon-th-list" />, <Selection />],
							[<i className="icon-pencil" />, <LayerPanels />],
							[<i className="icon-bookmark" />, <Bookmarks />],
							[<i className="icon-globe" />, <MultiverseSettings />],
							[<i className="icon-cog" />, <Settings />]
						]
					}
				>
				</PanelTabbed>
			</PanelPair>
		</div>
	);
});
