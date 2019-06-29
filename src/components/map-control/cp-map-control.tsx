import React from 'react';
import bind from 'autobind-decorator';
import * as mapboxGL from 'mapbox-gl';
import './style/cp-map-control.scss';
import { Portal } from '../app/cp-portal';
import { ID_MAP_CONTROL, ID_MAP_CONTROL_TOOLS } from '../../services/constants';
import { disableInteractions, add3dBuildings, styles } from './utils/util-map';
import { MapPointerEvents } from './utils/util-map-pointer-events';
import { token } from '../../token';
import { Button, ButtonGroup } from '../app/cp-button';
import { InteractionMode } from './interaction-modes/interaction-mode';
import { NavigationMode } from './interaction-modes/navigation-mode';
import { DrawMode } from './interaction-modes/draw-mode/draw-mode';

// @ts-ignore
mapboxGL.accessToken = token;

interface Props {
	center?: any;
	zoom?: number;
}

interface State {
	mode: InteractionMode;
	style: string;
	d3: boolean;
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

		const container = document.createElement('div');
		container.className = 'map-container';

		const {
			zoom = 1,
			center = [0, 0]
		} = props;

		this.map = new mapboxGL.Map({
			zoom,
			center,
			container,
			style: styles[2][1]
		});

		this.map.on('style.load', this.onStyleLoaded);

		this.navigationMode = NavigationMode.create(this.map);
		this.drawMode = DrawMode.create(this.map);

		disableInteractions(this.map);

		MapControl.instance = this;

		this.state = {
			mode: this.navigationMode,
			style: styles[2][1],
			d3: true
		};
	}

	componentDidMount() {
		this.ref.appendChild(this.map.getContainer());
		this.map.resize();

		const events = MapPointerEvents.create(this.map);

		events.on('blur', () => this.state.mode.onBlur());
		events.on('wheel', (e: any) => this.state.mode.onWheel(e));

		events.on('pointerup', (e: any) => this.state.mode.onPointerUp(e));
		events.on('pointerdown', (e: any) => this.state.mode.onPointerDown(e));
		events.on('pointermove', (e: any) => this.state.mode.onPointerMove(e));

		events.on('pointerdragstart', (e: any) => this.state.mode.onPointerDragStart(e));
		events.on('pointerdragmove', (e: any) => this.state.mode.onPointerDragMove(e));
		events.on('pointerdragend', (e: any) => this.state.mode.onPointerDragEnd(e));

		events.on('pointerclick', (e: any) => this.state.mode.onPointerClick(e));
		events.on('pointerdblclick', (e: any) => this.state.mode.onPointerDblClick(e));
		events.on('pointerlongpress', (e: any) => this.state.mode.onPointerLongPress(e));
	}

	componentWillUnmount() {
		this.map.off('style.load', this.onStyleLoaded);
	}

	private onStyleLoaded() {
		add3dBuildings(this.map);

		this.navigationMode.onStyleLoaded();
		this.drawMode.onStyleLoaded();
	}

	private setRef(e: any) {
		this.ref = e;
	}

	private setStyle(style: string) {
		this.map.setStyle(style);
		this.setState({ style });
	}

	private toggle3d() {
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

		mode.reset();

		this.setState({ mode: this.navigationMode });
	}

	activateDrawMode() {
		const { mode } = this.state;

		mode.reset();

		this.setState({ mode: this.drawMode });
	}

	render() {
		const { mode, style, d3 } = this.state;

		return (
			<>
				<Portal destination={ ID_MAP_CONTROL }>
					<div className="map-container" ref={ this.setRef } />
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
									onClick={ () => this.setStyle(url) }
								>
									{ name }
								</Button>
							))
						}
					</ButtonGroup>
					<ButtonGroup>
						<Button
							depressed={ d3 }
							onClick={ this.toggle3d }
						>
							3D Buildings
						</Button>
					</ButtonGroup>
				</Portal>
			</>
		);
	}
}
