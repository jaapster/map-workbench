import React from 'react';
import './style/cp-app.scss';
import { Panel } from '../panels/cp-panel';
import { PanelPair } from '../panels/cp-panel-pair';
import { MainToolBar } from './cp-main-tool-bar';
import { ID_MAP_CONTROL, ASTORIA } from '../../constants';
import { MapControl } from '../map-control/cp-map-control';
import { Side } from './cp-side';
import { TrailService } from '../../services/trail.service';
import { GeoNoteService } from '../../services/geo-note.service';

export class App extends React.Component {
	private _mounted = false;

	componentDidMount() {
		this._mounted = true;

		this.forceUpdate();
	}

	render() {
		return (
			<div className="app">
				<PanelPair // footer
					fixed
					vertical
					initial={ 0 }
					onResize={ MapControl.resize }
				>
					<Panel>
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
											<Panel primary>
											</Panel>
											<Panel>
												<MainToolBar />
												<div id={ ID_MAP_CONTROL } />
											</Panel>
										</PanelPair>
									</Panel>
								</PanelPair>
							</Panel>
							<Panel primary>
								<Side
									model={ TrailService.getModel() }
								/>
								<Side
									model={ GeoNoteService.getModel() }
								/>
							</Panel>
						</PanelPair>
					</Panel>
					<Panel primary />
				</PanelPair>
				{
					this._mounted
						? (
							<MapControl
								center={ ASTORIA }
								zoom={ 14 }
							/>
						)
						: null
				}
			</div>
		);
	}
}
