import bind from 'autobind-decorator';
import React from 'react';
import './scss/cp-map.scss';
import { Scale } from './cp-scale';
import { connect } from 'react-redux';
import { ZoomLevel } from './cp-zoom-level';
import { OverView } from './cp-overview';
import { HashParams } from '../app/cp-hash';
import { PopUpMenu } from './cp-pop-up-menu';
import { MapControl } from '../../map-control/map-control';
import { DrawingTools } from './cp-drawing-tool';
import { mergeClasses } from '../app/utils/util-merge-classes';
import { MarkerVertex } from './cp-marker-vertex';
import { MarkerArrowHead } from './cp-marker-arrow-head';
import { CenterCoordinate } from './cp-center-coordinate';
import { FeatureCollectionLayer } from './cp-feature-collection-layer';
import {
	Dict,
	State,
	CollectionData,
	MapControlMode } from '../../types';
import {
	mode,
	currentWorldCollections, overviewVisible
} from '../../reducers/selectors/index.selectors';
import { Button } from '../app/cp-button';
import { Dispatch } from 'redux';
import { ActionToggleOverview } from '../../reducers/actions';

interface Props {
	mode: MapControlMode;
	toggle: () => void;
	collections: Dict<CollectionData>;
	overviewVisible: boolean;
}

@bind
export class _Map extends React.PureComponent<Props> {
	private _ref: any;

	componentDidMount() {
		this._ref.appendChild(MapControl.getContainer());
		MapControl.resize();
	}

	private _setRef(e: any) {
		this._ref = e;
	}

	render() {
		const { collections, toggle, mode, overviewVisible } = this.props;

		const className = mergeClasses(
			'map-container',
			`mode-${ mode }`
		);

		return (
			<div>
				<div className={ className } ref={ this._setRef } />
				<svg>
					<MarkerVertex />
					<MarkerArrowHead />
					{
						Object.entries(collections).map(([key, { featureCollection, selection }]) => (
							<FeatureCollectionLayer
								key={ key }
								featureCollection={ featureCollection }
								selection={ selection }
							/>
						))
					}
				</svg>
				<div className="top-bar">
					<DrawingTools />
				</div>
				<div className="top-bar-right">
					<div className="button-group">
						<Button onClick={ toggle } depressed={ overviewVisible }>T</Button>
					</div>
				</div>
				<div className="bottom-bar">
					<ZoomLevel />
					<CenterCoordinate />
					<Scale />
				</div>
				<PopUpMenu />
				<HashParams />
				<OverView />
			</div>
		);
	}
}

const mapStateToProps = (state: State) => (
	{
		mode: mode(state),
		collections: currentWorldCollections(state),
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

export const Map = connect(mapStateToProps, mapDispatchToProps)(_Map);
