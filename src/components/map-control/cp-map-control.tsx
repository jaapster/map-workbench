import React from 'react';
import bind from 'autobind-decorator';
import mapboxGL from 'mapbox-gl';
import { token } from '../../token';
import './style/cp-map-control.scss';
import { Portal } from '../app/cp-portal';
import { Button, ButtonGroup } from '../app/cp-button';
import { MapPointerEvents } from './utils/util-map-pointer-events';
import { InteractionMode } from './interaction-modes/interaction-mode';
import { NavigationMode } from './interaction-modes/navigation-mode';
import { DrawMode } from './interaction-modes/draw-mode/draw-mode';
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
		MapControl.instance.map.resize();
	}

	private ref: any;
	private readonly navigationMode: any;
	private readonly drawMode: any;
	private readonly map: any;

	constructor(props: Props) {
		super(props);

		const {
			zoom = 1,
			center = [0, 0]
		} = props;

		this.map = new mapboxGL.Map({
			zoom,
			center,
			style: styles[1][1],
			container: DOM.create('div', 'map-container')
		});

		this.navigationMode = NavigationMode.create(this.map);
		this.drawMode = DrawMode.create(this.map);

		disableInteractions(this.map);

		MapControl.instance = this;

		this.state = {
			mode: this.navigationMode,
			style: styles[1][1],
			d3: true,
			center
		};
	}

	componentDidMount() {
		this.ref.appendChild(this.map.getContainer());
		this.map.resize();

		const events = MapPointerEvents.create(this.map);

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

		// todo: get this from map events class
		this.map.on('move', this._onMapMove);
		this.map.on('style.load', this._onStyleLoaded);

		document.addEventListener('keyup', (e: any) => this.state.mode.onKeyUp(e));
	}

	componentWillUnmount() {
		this.map.off('style.load', this._onStyleLoaded);
		this.map.off('move', this._onMapMove);

		this.navigationMode.destroy();
		this.drawMode.destroy();
	}

	private _onStyleLoaded() {
		add3dBuildings(this.map);
	}

	private _onMapMove() {
		const { lng, lat } = this.map.getCenter();
		this.setState({
			center: [lng.toFixed(4), lat.toFixed(4)]
		});
	}

	private _setRef(e: any) {
		this.ref = e;
	}

	private _setStyle(_style: string) {
		const { style } = this.state;

		if (style !== _style) {
			this.map.setStyle(_style);
			this.setState({ style: _style });
		}
	}

	private _toggle3d() {
		this.setState({ d3: !this.state.d3 }, () => {
			if (this.state.d3) {
				this.map.setLayoutProperty('3d-buildings', 'visibility', 'visible');
			} else {
				this.map.setLayoutProperty('3d-buildings', 'visibility', 'none');
			}
		});
	}

	activateNavigationMode() {
		const { mode } = this.state;

		mode.cleanUp();

		this.setState({ mode: this.navigationMode });
	}

	activateDrawMode() {
		const { mode } = this.state;

		mode.cleanUp();

		this.setState({ mode: this.drawMode });
	}

	render() {
		const { mode, style, d3, center: [lng, lat] } = this.state;

		return (
			<>
				<Portal destination={ ID_MAP_CONTROL }>
					<div className="map-container" ref={ this._setRef }>
						<div className="center-coordinate">{ lng }, { lat }</div>
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
