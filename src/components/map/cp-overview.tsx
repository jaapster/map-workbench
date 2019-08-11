import React from 'react';
import { Extent } from './cp-extent';
import { connect } from 'react-redux';
import { Crosshair } from './cp-crosshairs';
import { MapControl } from '../../map-control/map-control';
import { OverviewControl } from '../../map-control/overview-control';
import {
	Co,
	State,
	Feature,
	Polygon } from '../../types';
import {
	zoom,
	scale,
	mouse,
	glare,
	extent,
	center,
	glareLevel,
	overviewOffset,
	overviewVisible } from '../../reducers/selectors/index.selectors';

interface Props {
	zoom: number;
	glare: boolean;
	mouse: Co;
	center: Co;
	extent: Feature<Polygon>;
	offset: number;
	overview: boolean;
	glareLevel: number;
}

const _Overview = React.memo(({ zoom, glare, mouse, center, extent, offset, overview, glareLevel }: Props) => {
	if (!(overview || glare)) {
		return null;
	}

	OverviewControl.resize();
	OverviewControl.setCenter(glare ? mouse : center);
	OverviewControl.setZoom(glare ? glareLevel : zoom - offset);

	const { width, height } = OverviewControl.getContainer().getBoundingClientRect();

	if (width === 0) {
		// todo: find a way to force update of functional component
		setTimeout(() => MapControl.setZoom(MapControl.getZoom() + 0.0001));
	}

	return (
		<div className="overview" ref={ OverviewControl.attachTo }>
			{
				glare
					? <Crosshair />
					: overview
						? <Extent w={ width } h={ height } extent={ extent } />
						: null
			}
		</div>
	);
});

const mapStateToProps = (state: State) => (
	{
		zoom: zoom(state),
		scale: scale(state),
		mouse: mouse(state),
		glare: glare(state),
		center: center(state),
		extent: extent(state),
		offset: overviewOffset(state),
		overview: overviewVisible(state),
		glareLevel: glareLevel(state)
	}
);

export const OverView = connect(mapStateToProps)(_Overview);
