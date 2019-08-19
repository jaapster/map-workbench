import React from 'react';
import './scss/cp-map.scss';
import { Scale } from './cp-scale';
import { connect } from 'react-redux';
import { Bearing } from './cp-bearing';
import { Dispatch } from 'redux';
import { ZoomLevel } from './cp-zoom-level';
import { SecondaryMap } from './cp-overview';
import { PopUpMenu } from './cp-pop-up-menu';
import { HashParams } from '../app/cp-hash';
import { SystemMenu } from '../app/cp-system-menu';
import { MapControl } from 'lite/misc/map-control/map-control';
import { DrawingTools } from './cp-drawing-tool';
import { mergeClasses } from 'lite/utils/util-merge-classes';
import { MarkerVertex } from './cp-marker-vertex';
import { OverViewToggle } from './cp-overview-toggle';
import { MarkerArrowHead } from './cp-marker-arrow-head';
import { CenterCoordinate } from './cp-center-coordinate';
import { FeatureCollectionLayer } from './cp-feature-collection-layer';
import {
	ActionToggleOverview,
	ActionSetOverviewOffset } from 'lite/store/actions/actions';
import {
	State,
	MapboxStyle,
	MapboxLayer,
	CollectionData,
	MapControlMode } from 'se';
import {
	mode,
	glare,
	visibleLayers,
	overviewOffset,
	overviewVisible,
	currentWorldCollections } from 'lite/store/selectors/index.selectors';
import {
	Button,
	ButtonGroup } from '../app/cp-button';

interface Props {
	mode: MapControlMode;
	glare: boolean;
	offset: number;
	layers: any[];
	overview: boolean;
	collections: CollectionData[];
	setOverviewOffset: (offset: number) => void;
}

export const _Map = ({ mode, glare, offset, overview, collections, setOverviewOffset, layers }: Props) => {
	const className = mergeClasses(
		'map-container',
		`mode-${ mode }`
	);

	layers.forEach((layer: MapboxStyle) => {
		const { sources, layers } = layer;

		Object.keys(sources).forEach(key => MapControl.instance.addSource(key, sources[key]));
		layers.forEach((layer: MapboxLayer) => MapControl.instance.addLayer(layer));
	});

	return (
		<div>
			<div className={ className } ref={ MapControl.attachTo }/>
			<svg className="geometries">
				<MarkerVertex />
				<MarkerArrowHead />
				{
					collections.map(({ name, featureCollection, selection }) => (
						<FeatureCollectionLayer
							key={ name }
							featureCollection={ featureCollection }
							selection={ selection }
						/>
					))
				}
			</svg>
			<div className="top-bar">
				<span>
					<SystemMenu />
					<DrawingTools />
				</span>
				<span>
					{
						glare || overview
							? (
								<ButtonGroup>
									<Button
										onClick={ () => setOverviewOffset(offset - 1) }
										disabled={ glare }
									>
										<i className="icon-plus1" />
									</Button>
									<Button
										onClick={ () => setOverviewOffset(offset + 1) }
										disabled={ glare }
									>
										<i className="icon-minus1" />
									</Button>
								</ButtonGroup>
							)
							: null
					}

					<OverViewToggle />
				</span>
			</div>
			<div className="top-bar-right">

			</div>
			<div className="bottom-bar">
				<Bearing />
				<ZoomLevel />
				<CenterCoordinate />
				<Scale />
			</div>
			<PopUpMenu />
			<HashParams />
			<SecondaryMap />
		</div>
	);
};

const mapStateToProps = (state: State) => (
	{
		mode: mode(state),
		glare: glare(state),
		layers: visibleLayers(state),
		offset: overviewOffset(state),
		overview: overviewVisible(state),
		collections: currentWorldCollections(state),
		overviewVisible: overviewVisible(state)
	}
);

const mapDispatchToProps = (dispatch: Dispatch) => (
	{
		toggle() {
			dispatch(ActionToggleOverview.create({}));
		},
		setOverviewOffset(offset: number) {
			dispatch(ActionSetOverviewOffset.create({ offset }));
		}
	}
);

export const Map = connect(mapStateToProps, mapDispatchToProps)(_Map);
