import bind from 'autobind-decorator';
import React from 'react';
import './scss/cp-map.scss';
import { Scale } from './cp-scale';
import { connect } from 'react-redux';
import { Bearing } from './cp-bearing';
import { Dispatch } from 'redux';
import { ZoomLevel } from './cp-zoom-level';
import { OverView } from './cp-overview';
import { HashParams } from '../app/cp-hash';
import { PopUpMenu } from './cp-pop-up-menu';
import { MapControl } from '../../map-control/map-control';
import { DrawingTools } from './cp-drawing-tool';
import { mergeClasses } from '../app/utils/util-merge-classes';
import { MarkerVertex } from './cp-marker-vertex';
import { OverViewToggle } from './cp-overview-toggle';
import { MarkerArrowHead } from './cp-marker-arrow-head';
import { CenterCoordinate } from './cp-center-coordinate';
import { ActionToggleOverview } from '../../reducers/actions';
import { FeatureCollectionLayer } from './cp-feature-collection-layer';
import {
	Dict,
	State,
	CollectionData,
	MapControlMode } from '../../types';
import {
	mode,
	overviewVisible,
	currentWorldCollections } from '../../reducers/selectors/index.selectors';

interface Props {
	mode: MapControlMode;
	collections: Dict<CollectionData>;
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
		const { collections, mode } = this.props;

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
					<OverViewToggle />
				</div>
				<div className="bottom-bar">
					<Bearing />
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
