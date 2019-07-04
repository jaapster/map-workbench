import React from 'react';
import bind from 'autobind-decorator';
import mapboxGL from 'mapbox-gl';
import { token } from '../../token';
import './style/cp-map-control.scss';
import { Portal } from '../app/cp-portal';
import { Button, ButtonGroup } from '../app/cp-button';
import { DrawMode } from './interaction-modes/draw-mode/draw-mode';
import { NavigationMode } from './interaction-modes/navigation-mode';
import { InteractionMode } from './interaction-modes/interaction-mode';
import { MapPointerEvents } from './utils/util-map-pointer-events';
import { ID_MAP_CONTROL, ID_MAP_CONTROL_TOOLS } from '../../services/constants';
import { disableInteractions, add3dBuildings, styles } from './utils/util-map';
import { DOM } from './utils/util-dom';

// @ts-ignore
mapboxGL.accessToken = token;

interface Props {
	center?: any;
	zoom?: number;
}

interface State {
	d3: boolean;
	mode: InteractionMode;
	style: string;
	center: any;
}

@bind
export class MapControl extends React.Component<Props, State> {
	static instance: MapControl;

	static resize() {
		MapControl.instance.resize();
	}

	static activateDrawMode() {
		MapControl.instance.activateDrawMode();
	}

	static activateNavigationMode() {
		MapControl.instance.activateNavigationMode();
	}


	private readonly _map: any;
	private readonly _drawMode: DrawMode;
	private readonly _navigationMode: NavigationMode;

	private _ref: any;

	constructor(props: Props) {
		super(props);

		const {
			zoom = 1,
			center = [0, 0]
		} = props;

		const style = styles[5][1];

		this._map = new mapboxGL.Map({
			zoom,
			style,
			center,
			container: DOM.create('div', 'map-container')
		});

		this._drawMode = DrawMode.create(this._map);
		this._navigationMode = NavigationMode.create(this._map);

		const events = MapPointerEvents.create(this._map);

		events.on('pointerup', (e: any) => this.state.mode.onPointerUp(e));
		events.on('pointerdown', (e: any) => this.state.mode.onPointerDown(e));
		events.on('pointermove', (e: any) => this.state.mode.onPointerMove(e));

		events.on('pointerdragstart', (e: any) => this.state.mode.onPointerDragStart(e));
		events.on('pointerdragmove', (e: any) => this.state.mode.onPointerDragMove(e));
		events.on('pointerdragend', (e: any) => this.state.mode.onPointerDragEnd(e));

		events.on('pointerclick', (e: any) => this.state.mode.onPointerClick(e));
		events.on('pointerdblclick', (e: any) => this.state.mode.onPointerDblClick(e));
		events.on('pointerlongpress', (e: any) => this.state.mode.onPointerLongPress(e));

		events.on('blur', () => this.state.mode.onBlur());
		events.on('wheel', (e: any) => this.state.mode.onWheel(e));
		events.on('context', (e: any) => this.state.mode.onContext(e));

		document.addEventListener('keyup', (e: any) => this.state.mode.onKeyUp(e));

		this._map.on('load', this._onMapReady);

		disableInteractions(this._map);

		MapControl.instance = this;

		this.state = {
			d3: true,
			mode: this._navigationMode,
			style,
			center
		};
	}

	componentDidMount() {
		this._ref.appendChild(this._map.getContainer());
		this._map.resize();

		// todo: get this from map events class
		this._map.on('style.load', this._onStyleLoaded);
		this._map.on('move', this._onMapMove);
	}

	componentWillUnmount() {
		this._map.off('style.load', this._onStyleLoaded);
		this._map.off('move', this._onMapMove);

		this._navigationMode.destroy();
		this._drawMode.destroy();
	}

	private _onMapMove() {
		const { lng, lat } = this._map.getCenter();

		this.setState({
			center: [lng.toFixed(3), lat.toFixed(3)]
		});
	}

	private _onMapReady() {
		console.log('map ready');
	}

	private _onStyleLoaded() {
		add3dBuildings(this._map);
	}

	private _setRef(e: any) {
		this._ref = e;
	}

	private _setStyle(_style: string) {
		const { style } = this.state;

		if (style !== _style) {
			this._map.setStyle(_style);
			this.setState({ style: _style });
		}
	}

	private _toggle3d() {
		this.setState({ d3: !this.state.d3 }, () => {
			this._map.setLayoutProperty(
				'3d-buildings',
				'visibility',
				this.state.d3 ? 'visible' : 'none'
			);
		});
	}

	resize() {
		this._map.resize();
	}

	activateNavigationMode() {
		this.state.mode.cleanUp();

		this.setState({
			mode: this._navigationMode
		});
	}

	activateDrawMode() {
		this.state.mode.cleanUp();

		this.setState({
			mode: this._drawMode
		});
	}

	render() {
		const { style, d3, center: [lng, lat], mode } = this.state;

		return (
			<>
				<Portal destination={ ID_MAP_CONTROL }>
					<div className="map-container" ref={ this._setRef }>
						<div className="center-coordinate">
							{ lng }, { lat }
						</div>
					</div>
				</Portal>
				<Portal destination={ ID_MAP_CONTROL_TOOLS }>
					<ButtonGroup>
						<Button
							depressed={ mode instanceof NavigationMode }
							onClick={ this.activateNavigationMode }
						>
							Navigate
						</Button>
						<Button
							depressed={ mode instanceof DrawMode }
							onClick={ this.activateDrawMode }
						>
							Draw
						</Button>
					</ButtonGroup>
					<ButtonGroup>
						{
							styles.map(([name, url]) => (
								<Button
									key={ name }
									depressed={ style === url }
									onClick={ () => this._setStyle(url) }
								>
									{ name }
								</Button>
							))
						}
					</ButtonGroup>
					<ButtonGroup>
						<Button
							depressed={ d3 }
							onClick={ this._toggle3d }
						>
							3D Buildings
						</Button>
					</ButtonGroup>
				</Portal>
			</>
		);
	}
}