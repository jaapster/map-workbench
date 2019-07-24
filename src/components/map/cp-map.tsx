import bind from 'autobind-decorator';
import React from 'react';
import mapboxGL from 'mapbox-gl';
import './style/cp-map.scss';
import { token } from '../../token';
import { Layer } from './cp-layer';
import { Location } from '../../types';
import { ZoomLevel } from './cp-zoom-level';
import { MapControl } from '../../map-control/map-control';
import { PopUpMenu } from './cp-pop-up-menu';
import { ModeSelector } from './cp-mode-selector';
import { mergeClasses } from '../../utils/util-merge-classes';
import { TrailService } from '../../services/trail.service';
import { MarkerVertex } from './cp-marker-vertex';
import { StyleSelector } from './cp-style-selector';
import { GeoNoteService } from '../../services/geo-note.service';
import { MarkerArrowHead } from './cp-marker-arrow-head';
import { CenterCoordinate } from './cp-center-coordinate';
import { SelectionService } from '../../services/selection.service';

// @ts-ignore
mapboxGL.accessToken = token;

interface Props {
	location: Location;
}

const models = [
	TrailService.getModel(),
	GeoNoteService.getModel(),
	SelectionService.getModel()
];

@bind
export class Map extends React.Component<Props> {
	private readonly _mapControl: MapControl;

	private _ref: any;

	constructor(props: Props) {
		super(props);

		this._mapControl = MapControl.create(props);
	}

	componentDidMount() {
		this._ref.appendChild(this._mapControl.getContainer());
		this._mapControl.resize();
	}

	private _setRef(e: any) {
		this._ref = e;
	}

	render() {
		const className = mergeClasses(
			'map-container',
			`mode-${ this._mapControl.getMode() }`
		);

		return (
			<div>
				<div className={ className } ref={ this._setRef } />
				<svg>
					<MarkerVertex />
					<MarkerArrowHead />
					{
						models.map(model => (
							<Layer
								key={ model.getTitle() }
								model={ model }
							/>
						))
					}
				</svg>
				<CenterCoordinate mapControl={ this._mapControl } />
				<ZoomLevel mapControl={ this._mapControl } />
				<div className="main-tool-bar">
					<ModeSelector mapControl={ this._mapControl } />
					<StyleSelector mapControl={ this._mapControl } />
				</div>
				<PopUpMenu />
			</div>
		);
	}
}
