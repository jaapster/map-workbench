import bind from 'autobind-decorator';
import React from 'react';
import mapboxGL from 'mapbox-gl';
import { DOM } from '../../map-control/utils/util-dom';
import { connect } from 'react-redux';
import { mergeClasses } from '../app/utils/util-merge-classes';
import { disableInteractions } from '../../map-control/utils/util-map';
import {
	Co,
	State,
	Feature,
	Polygon,
	MapboxStyle } from '../../types';
import {
	zoom,
	extent,
	center,
	overviewVisible,
	referenceStyles,
	currentReferenceStyleId } from '../../reducers/selectors/index.selectors';

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
	center: Co;
	extent: Feature<Polygon>;
	overviewVisible: boolean;
	referenceLayers: [string, string | MapboxStyle][];
	currentReferenceLayer: string | MapboxStyle;
}

@bind
class SlaveMap extends React.PureComponent<any> {
	private _ref: any;
	private _currentReferenceLayer: string | MapboxStyle = '';

	private _setRef(e: any) {
		this._ref = e;
	}

	componentDidMount() {
		this._ref.appendChild(_map.getContainer());

		_map.resize();

		this.forceUpdate();
	}

	render() {
		const { center, extent, zoom, referenceLayers, currentReferenceLayer } = this.props;

		_map.setZoom(zoom - 4);
		_map.setCenter(center);

		if (currentReferenceLayer !== this._currentReferenceLayer) {
			this._currentReferenceLayer = currentReferenceLayer;

			const [, style] = referenceLayers.find(([id]: [string]) => id === currentReferenceLayer);

			_map.setStyle(style);
		}

		const { width, height } = _map.getContainer().getBoundingClientRect();

		const d = extent.geometry.coordinates[0].slice().reverse().reduce((m: string, co: Co, i: number) => {
			const { x, y } = _map.project(co);
			return `${ m }${ i ? 'L' : 'M' }${ x } ${ y }`;
		}, `M0 0L${ width } 0L${ width } ${ height }L0 ${ height }L0 0`);

		return (
			<div ref={ this._setRef }>
				<svg>
					<path className="extent" d={ d } />
				</svg>
			</div>
		);
	}
}

export class _OverView extends React.PureComponent<any> {
	render() {
		const { center, extent, zoom, referenceLayers, currentReferenceLayer, overviewVisible } = this.props;

		const className = mergeClasses(
			'overview',
			{
				visible: overviewVisible
			}
		);

		return (
			<div className={ className }>
				{
					overviewVisible
						? (
							<SlaveMap
								zoom={ zoom }
								center={ center }
								extent={ extent }
								referenceLayers={ referenceLayers }
								currentReferenceLayer={ currentReferenceLayer }
							/>
						)
						: null
				}
			</div>
		);
	}
}

const mapStateToProps = (state: State) => (
	{
		zoom: zoom(state),
		center: center(state),
		extent: extent(state),
		overviewVisible: overviewVisible(state),
		referenceLayers: referenceStyles(state),
		currentReferenceLayer: currentReferenceStyleId(state)
	}
);

export const OverView = connect(mapStateToProps)(_OverView);
