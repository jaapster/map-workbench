import bind from 'autobind-decorator';
import React from 'react';
import './scss/cp-map.scss';
import { connect } from 'react-redux';
import { ZoomLevel } from './cp-zoom-level';
import { HashParams } from '../app/cp-hash';
import { PopUpMenu } from './cp-pop-up-menu';
import { MapControl } from '../../map-control/map-control';
import { CRSSelector } from './cp-crs-selector';
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
	MapControlMode
} from '../../types';

interface Props {
	collections: Dict<CollectionData>;
	mode: MapControlMode;
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
						Object.keys(collections).map((key) => {
							const { featureCollection, selection } = collections[key];

							return (
								<FeatureCollectionLayer
									key={ key }
									featureCollection={ featureCollection }
									selection={ selection }
								/>
							);
						})
					}
				</svg>
				<CenterCoordinate />
				<ZoomLevel />
				<div className="main-tool-bar">
					<ModeSelector />
					<StyleSelector />
					<CRSSelector />
					<WorldSelector />
				</div>
				<PopUpMenu />
				<HashParams />
			</div>
		);
	}
}

const mapStateToProps = (state: State) => {
	const { multiverse: { worlds, currentWorldId } } = state;

	return {
		collections: worlds[currentWorldId].collections,
		mode: state.mapControl.mode
	};
};

export const Map = connect(mapStateToProps)(_Map);
