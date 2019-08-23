import React from 'react';
import { Extent } from './cp-extent';
import { connect } from 'react-redux';
import { Crosshair } from './cp-crosshair';
import { PrimaryMapControl } from '../../misc/map-control/primary-map-control';
import { SecondaryMapControl } from 'lite/misc/map-control/secondary-map-control';
import {
	Co,
	State,
	Feature,
	Polygon } from 'se';
import {
	zoom,
	mouse,
	glare,
	extent,
	center,
	glareLevel,
	overviewOffset,
	overviewVisible,
	currentMapLayers } from 'lite/store/selectors/index.selectors';
import { StyleRenderer } from 'lite/components/map/cp-style-renderer';

interface GlareProps {
	mouse: Co;
	glareLevel: number;
}

const _GlareMap = React.memo((props: GlareProps) => {
	const { mouse, glareLevel } = props;

	SecondaryMapControl.setCenter(mouse);
	SecondaryMapControl.setZoom(glareLevel);

	return (
		<div className="overview" ref={ SecondaryMapControl.attachTo }>
			<Crosshair />
		</div>
	);
});

const mapStateToPropsGlare = (state: State): GlareProps => (
	{
		mouse: mouse(state),
		glareLevel: glareLevel(state)
	}
);

const GlareMap = connect(mapStateToPropsGlare)(_GlareMap);

interface OverviewProps {
	zoom: number;
	layers: any[];
	center: Co;
	extent: Feature<Polygon>;
	offset: number;
}

const _OverviewMap = React.memo((props: OverviewProps) => {
	const { zoom, center, extent, offset, layers } = props;

	SecondaryMapControl.setCenter(center);
	SecondaryMapControl.setZoom(zoom - offset);

	const { width, height } = SecondaryMapControl
		.getContainer()
		.getBoundingClientRect();

	return (
		<div className="overview" ref={ SecondaryMapControl.attachTo }>
			{
				layers
					.slice()
					.reverse()
					.filter(layer => layer.visible)
					.map(layer => (
						<StyleRenderer
							key={ layer.name }
							style={ layer.currentStyle }
							control={ SecondaryMapControl.instance }
						/>
					))
			}
			<Extent w={ width } h={ height } extent={ extent } />
		</div>
	);
});

const mapStateToPropsOverview = (state: State): OverviewProps => (
	{
		zoom: zoom(state),
		layers: currentMapLayers(state),
		center: center(state),
		extent: extent(state),
		offset: overviewOffset(state)
	}
);

const OverviewMap = connect(mapStateToPropsOverview)(_OverviewMap);

interface SecondaryMapProps {
	glare: boolean;
	overview: boolean;
}

const _SecondaryMap = React.memo((props: SecondaryMapProps) => {
	const { glare, overview } = props;

	if (glare || overview) {
		SecondaryMapControl.resize();

		const { width } = SecondaryMapControl
			.getContainer()
			.getBoundingClientRect();

		if (width === 0) {
			// todo: find a way to force update of functional component
			setTimeout(() => PrimaryMapControl.setZoom(PrimaryMapControl.getZoom() + 0.0001));
		}

		return glare ? <GlareMap /> : <OverviewMap />;
	}

	return null;
});

const mapStateToProps = (state: State) => (
	{
		glare: glare(state),
		overview: overviewVisible(state)
	}
);

export const SecondaryMap = connect(mapStateToProps)(_SecondaryMap);
