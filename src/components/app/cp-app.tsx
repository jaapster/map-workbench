import React from 'react';
import './style/cp-app.scss';
import './style/list.scss';
import { Map } from '../map/cp-map';
import { Panel } from '../panels/cp-panel';
import { PanelPair } from '../panels/cp-panel-pair';
import { LOCATIONS } from '../../constants';
import { Locations } from './cp-locations';
import { MapControl } from '../../map-control/map-control';
import { LayerPanels } from '../map/cp-layer-panels';

export const App = () => (
	<div className="app">
			<PanelPair // panel right
				horizontal
				max={ 500 }
				initial={ 200 }
				onResize={ MapControl.resize }
			>
				<Panel>
					<PanelPair // panel left
						fixed
						horizontal
						initial={ 0 }
						onResize={ MapControl.resize }
					>
						<Panel primary />
						<Panel>
							<PanelPair // header
								fixed
								vertical
								initial={ 0 }
								onResize={ MapControl.resize }
							>
								<Panel primary />
								<Panel>
									<Map location={ LOCATIONS[0] } />
								</Panel>
							</PanelPair>
						</Panel>
					</PanelPair>
				</Panel>
				<Panel primary>
					<LayerPanels />
					<Locations locations={ LOCATIONS }/>
				</Panel>
			</PanelPair>
	</div>
);

// export const App = () => (
// 	<div className="app">
// 		<PanelPair // footer
// 			fixed
// 			vertical
// 			initial={ 0 }
// 			onResize={ MapControl.resize }
// 		>
// 			<Panel>
// 				<PanelPair // panel right
// 					horizontal
// 					max={ 500 }
// 					initial={ 200 }
// 					onResize={ MapControl.resize }
// 				>
// 					<Panel>
// 						<PanelPair // panel left
// 							fixed
// 							horizontal
// 							initial={ 0 }
// 							onResize={ MapControl.resize }
// 						>
// 							<Panel primary />
// 							<Panel>
// 								<PanelPair // header
// 									fixed
// 									vertical
// 									initial={ 0 }
// 									onResize={ MapControl.resize }
// 								>
// 									<Panel primary />
// 									<Panel>
// 										<Map location={ LOCATIONS[0] } />
// 									</Panel>
// 								</PanelPair>
// 							</Panel>
// 						</PanelPair>
// 					</Panel>
// 					<Panel primary>
// 						<LayerPanels />
// 						<Locations locations={ LOCATIONS }/>
// 					</Panel>
// 				</PanelPair>
// 			</Panel>
// 			<Panel primary />
// 		</PanelPair>
// 	</div>
// );
