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
import { State } from '../../types';
import { scale } from '../../reducers/selectors/index.selectors';
import { connect } from 'react-redux';

interface Props {
	scale: number;
}

export const _Main = React.memo(({ scale }: Props) => {
	return (
		<div className="app" style={ { fontSize: `${ scale }em` } }>
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
							[<i className="icon-list" />, <Selection />],
							[<i className="icon-box" />, <LayerPanels />],
							[<i className="icon-star" />, <Bookmarks />],
							[<i className="icon-layers" />, <MultiverseSettings />],
							[<i className="icon-settings" />, <Settings />]
						]
					}
				>
				</PanelTabbed>
			</PanelPair>
		</div>
	);
});

const mapStateToProps = (state: State) => (
	{
		scale: scale(state)
	}
);

export const Main = connect(mapStateToProps)(_Main);
