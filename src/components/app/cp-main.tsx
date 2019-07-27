import React from 'react';
import './style/cp-main.scss';
import './style/list.scss';
import { Map } from '../map/cp-map';
import { Panel } from '../panels/cp-panel';
import { Selection } from './cp-selection';
import { PanelPair } from '../panels/cp-panel-pair';
import { LOCATIONS } from '../../constants';
import { Locations } from './cp-locations';
import { MapControl } from '../../map-control/map-control';
import { LayerPanels } from '../map/cp-layer-panels';
import { PanelTabbed } from '../panels/cp-panel-tabbed';
import { PanelPairTabbed } from '../panels/cp-panel-pair-tabbed';
import '../../services/service.hash';

export const Main = () => {
	return (
		<div className="app">
			<PanelPairTabbed // panel right
				horizontal
				max={500}
				min={300}
				initial={300}
				onResize={MapControl.resize}
			>
				<Panel>
					<PanelPair // panel left
						fixed
						horizontal
						initial={0}
						onResize={MapControl.resize}
					>
						<Panel primary />
						<Panel>
							<PanelPair // header
								fixed
								vertical
								initial={0}
								onResize={MapControl.resize}
							>
								<Panel primary />
								<Panel>
									<Map location={LOCATIONS[0]} />
								</Panel>
							</PanelPair>
						</Panel>
					</PanelPair>
				</Panel>
				<PanelTabbed
					primary
					tabs={
						[
							<Selection />,
							<LayerPanels />,
							<Locations locations={LOCATIONS} />
						]
					}
				>
				</PanelTabbed>
			</PanelPairTabbed>
		</div>
	);
};
