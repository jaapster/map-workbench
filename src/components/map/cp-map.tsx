import bind from 'autobind-decorator';
import React from 'react';
import './scss/cp-map.scss';
import { Scale } from './cp-scale';
import { connect } from 'react-redux';
import { ZoomLevel } from './cp-zoom-level';
import { HashParams } from '../app/cp-hash';
import { PopUpMenu } from './cp-pop-up-menu';
import { MapControl } from '../../map-control/map-control';
import { ModeSelector } from './cp-mode-selector';
import { mergeClasses } from '../app/utils/util-merge-classes';
import { MarkerVertex } from './cp-marker-vertex';
import { WorldSelector } from './cp-world-selector';
import { StyleSelector } from './cp-style-selector';
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
				<div className="bottom-bar">
					<ZoomLevel />
					<CenterCoordinate />
					<Scale />
				</div>
				<div className="main-tool-bar">
					<ModeSelector />
					<StyleSelector />
					<WorldSelector />
				</div>
				<PopUpMenu />
				<HashParams />
			</div>
		);
	}
}

const mapStateToProps = (state: State) => (
	{
		mode: mode(state),
		collections: currentWorldCollections(state)
	}
);

export const Map = connect(mapStateToProps)(_Map);
