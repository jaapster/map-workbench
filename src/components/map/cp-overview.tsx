import bind from 'autobind-decorator';
import React from 'react';
import mapboxGL from 'mapbox-gl';
import { DOM } from '../../map-control/utils/util-dom';
import { connect } from 'react-redux';
import { MapControl } from '../../map-control/map-control';
import { mergeClasses } from '../app/utils/util-merge-classes';
import { disableInteractions } from '../../map-control/utils/util-map';
import {
	Ev,
	Co,
	State,
	Feature,
	Polygon,
	MapboxStyle } from '../../types';
import {
	zoom,
	scale,
	glare,
	extent,
	center,
	bearing,
	overviewVisible,
	referenceStyles,
	currentReferenceStyleId } from '../../reducers/selectors/index.selectors';
import { Crosshair } from './cp-crosshairs';

const _map = new mapboxGL.Map({
	zoom: 1,
	style: 'mapbox://styles/mapbox/light-v10',
	center: [0, 0],
	container: DOM.create('div', 'map-container'),
	fadeDuration: 0
});

disableInteractions(_map);

interface Props {
	zoom: number;
	scale: number;
	glare: boolean;
	center: Co;
	bearing: number;
	extent: Feature<Polygon>;
	overviewVisible: boolean;
	referenceLayers: [string, string | MapboxStyle][];
	referenceLayer: string | MapboxStyle;
}

@bind
class SlaveMap extends React.PureComponent<Props> {
	private _e?: Ev;
	private _ref: any;
	private _scale: number = 0;
	private _referenceLayer: string | MapboxStyle = '';

	private _setRef(e: any) {
		this._ref = e;
	}

	componentDidMount() {
		this._ref.appendChild(_map.getContainer());
		this.forceUpdate();

		_map.resize();

		MapControl.instance.on('mouseMove', this._onMouseMove);
	}

	componentWillUnmount() {
		MapControl.instance.off('mouseMove', this._onMouseMove);
	}

	private _onMouseMove(e: Ev) {
		const { glare } = this.props;

		this._e = e;

		if (glare) {
			_map.setCenter(e.lngLat);
		}
	}

	render() {
		const {
			zoom,
			scale,
			glare,
			center,
			extent,
			referenceLayers,
			referenceLayer
		} = this.props;

		if (scale !== this._scale) {
			this._scale = scale;

			_map.resize();
		}

		if (referenceLayer !== this._referenceLayer) {
			this._referenceLayer = referenceLayer;

			const s = referenceLayers.find(([id]) => id === referenceLayer);

			if (s) {
				// @ts-ignore
				_map.setStyle(s[1]);
			}
		}

		const { width: w, height: h } = _map.getContainer().getBoundingClientRect();

		if (glare) {
			if (this._e) {
				this._onMouseMove(this._e);
			}

			_map.setBearing(0);
			_map.setZoom(19);

			return (
				<div ref={ this._setRef }>
					<Crosshair w={ w } h={ h }/>
				</div>
			);
		}

		_map.setCenter(center);
		_map.setZoom(zoom - 4);
		// _map.setBearing(bearing);

		const d = extent.geometry.coordinates[0]
			.slice()
			.reverse()
			.reduce((m: string, co: Co, i: number) => {
				const { x, y } = _map.project(co);
				return `${ m }${ i ? 'L' : 'M' }${ x } ${ y }`;
			}, `M0 -1L${ w + 1 } -1L${ w + 1 } ${ h }L0 ${ h }L0 -1`);

		return (
			<div ref={ this._setRef }>
				<svg>
					<path className="extent" d={ d } />
				</svg>
			</div>
		);
	}
}

export const _OverView = React.memo((props: Props) => {
	const { glare, overviewVisible } = props;

	const visible = overviewVisible || glare;

	const className = mergeClasses(
		'overview',
		{
			visible
		}
	);

	return (
		<div className={ className }>
			{
				visible
					? <SlaveMap { ...props } />
					: null
			}
		</div>
	);
});

const mapStateToProps = (state: State) => (
	{
		zoom: zoom(state),
		scale: scale(state),
		glare: glare(state),
		center: center(state),
		extent: extent(state),
		bearing: bearing(state),
		referenceLayer: currentReferenceStyleId(state),
		overviewVisible: overviewVisible(state),
		referenceLayers: referenceStyles(state)
	}
);

export const OverView = connect(mapStateToProps)(_OverView);
