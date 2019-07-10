import bind from 'autobind-decorator';
import React from 'react';
import mapboxGL from 'mapbox-gl';
import './style/cp-map-control.scss';
import { DOM } from './utils/util-dom';
import { token } from '../../token';
import { Portal } from '../app/cp-portal';
import { DrawMode } from './modes/draw.mode';
import { UpdateMode } from './modes/update.mode';
import { trailStyle } from './styles/trails.styles';
import { TrailService } from '../../services/trail.service';
import { PointerDevice } from './devices/pointer.device';
import { selectionStyle } from './styles/selection.styles';
import { KeyboardDevice } from './devices/keyboard.device';
import { NavigationMode } from './modes/navigation.mode';
import { InteractionMode } from './modes/interaction.mode';
import { SelectionService } from '../../services/selection.service';
import { FeatureCollectionLayer } from './layers/feature-collection.layer';
import {
	ID_MAP_CONTROL,
	ID_MAP_CONTROL_TOOLS } from '../../constants';
import {
	styles,
	disableInteractions } from './utils/util-map';
import {
	Button,
	ButtonGroup } from '../app/cp-button';
import { Ev } from '../../types';

// @ts-ignore
mapboxGL.accessToken = token;

interface Props {
	center?: any;
	zoom?: number;
}

interface State {
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

	private readonly _map: any;
	private readonly _drawMode: DrawMode;
	private readonly _updateMode: UpdateMode;
	private readonly _pointerDevice: PointerDevice;
	private readonly _keyboardDevice: KeyboardDevice;
	private readonly _navigationMode: NavigationMode;

	private _ref: any;

	constructor(props: Props) {
		super(props);

		const {
			zoom = 1,
			center = [0, 0]
		} = props;

		const style = styles[1][1];

		this._map = new mapboxGL.Map({
			zoom,
			style,
			center,
			container: DOM.create('div', 'map-container'),
			fadeDuration: 0
		});

		const trails = TrailService.getModel();
		const selection = SelectionService.getModel();

		FeatureCollectionLayer.create(this._map, trails, trailStyle);
		FeatureCollectionLayer.create(this._map, selection, selectionStyle);

		this._drawMode = DrawMode.create(this._map);
		this._drawMode.setModel(trails);
		this._drawMode.on('finish', this.activateNavigationMode);

		this._updateMode = UpdateMode.create(this._map);
		this._updateMode.setModel(trails);
		this._updateMode.on('finish', this.activateNavigationMode);

		this._navigationMode = NavigationMode.create(this._map);
		this._navigationMode.on('select', this.activateUpdateMode);

		this._pointerDevice = PointerDevice.create(this._map);
		this._keyboardDevice = KeyboardDevice.create();

		this._pointerDevice.on('pointerup', (e: Ev) => this.state.mode.onPointerUp(e));
		this._pointerDevice.on('pointerdown', (e: Ev) => this.state.mode.onPointerDown(e));
		this._pointerDevice.on('pointermove', (e: Ev) => this.state.mode.onPointerMove(e));

		this._pointerDevice.on('pointerdragstart', (e: Ev) => this.state.mode.onPointerDragStart(e));
		this._pointerDevice.on('pointerdragmove', (e: Ev) => this.state.mode.onPointerDragMove(e));
		this._pointerDevice.on('pointerdragend', (e: Ev) => this.state.mode.onPointerDragEnd(e));

		this._pointerDevice.on('pointerclick', (e: Ev) => this.state.mode.onPointerClick(e));
		this._pointerDevice.on('pointerdblclick', (e: Ev) => this.state.mode.onPointerDblClick(e));
		this._pointerDevice.on('pointerlongpress', (e: Ev) => this.state.mode.onPointerLongPress(e));

		this._pointerDevice.on('blur', () => this.state.mode.onBlur());
		this._pointerDevice.on('wheel', (e: Ev) => this.state.mode.onWheel(e));
		this._pointerDevice.on('context', (e: Ev) => this.state.mode.onContext(e));

		this._keyboardDevice.on('deleteKey', () => this.state.mode.onDeleteKey());
		this._keyboardDevice.on('escapeKey', () => this.state.mode.onEscapeKey());

		disableInteractions(this._map);

		MapControl.instance = this;

		this.state = {
			mode: this._navigationMode,
			style,
			center
		};
	}

	componentDidMount() {
		this._ref.appendChild(this._map.getContainer());
		this._map.resize();

		// todo: get this from map events class
		this._map.on('move', this._onMapMove);
	}

	componentWillUnmount() {
		this._map.off('move', this._onMapMove);

		this._updateMode.destroy();
		this._navigationMode.destroy();
		this._keyboardDevice.destroy();
		this._pointerDevice.destroy();
	}

	private _onMapMove() {
		const { lng, lat } = this._map.getCenter();

		this.setState({
			center: [lng.toFixed(3), lat.toFixed(3)]
		});
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

	resize() {
		this._map.resize();
	}

	activateNavigationMode() {
		this._navigationMode.engage();

		this.setState({
			mode: this._navigationMode
		});
	}

	activateDrawMode() {
		this.state.mode.cleanUp();
		this._drawMode.engage();

		this.setState({
			mode: this._drawMode
		});
	}

	activateUpdateMode() {
		this._updateMode.engage();

		this.setState({
			mode: this._updateMode
		});
	}

	render() {
		const { style, center: [lng, lat], mode } = this.state;

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
							disabled
						>
							Navigate
						</Button>
						<Button
							depressed={ mode instanceof UpdateMode }
							disabled
						>
							Update
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
				</Portal>
			</>
		);
	}
}
