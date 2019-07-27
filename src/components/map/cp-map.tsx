import bind from 'autobind-decorator';
import React from 'react';
import './style/cp-map.scss';
import { Location } from '../../types';
import { ZoomLevel } from './cp-zoom-level';
import { MapControl } from '../../map-control/map-control';
import { PopUpMenu } from './cp-pop-up-menu';
import { CRSSelector } from './cp-crs-selector';
import { ModeSelector } from './cp-mode-selector';
import { mergeClasses } from '../../utils/util-merge-classes';
import { MarkerVertex } from './cp-marker-vertex';
import { StyleSelector } from './cp-style-selector';
import { MessageService } from '../../services/service.message';
import { ServiceGeoNote } from '../../services/service.geo-note';
import { MarkerArrowHead } from './cp-marker-arrow-head';
import { CenterCoordinate } from './cp-center-coordinate';
import { FeatureCollectionLayer } from './cp-feature-collection-layer';
import { UniverseService } from '../../services/service.universe';

interface Props {
	location: Location;
}

@bind
export class Map extends React.Component<Props> {
	private readonly _mapControl: MapControl;

	private _ref: any;

	constructor(props: Props) {
		super(props);

		this._mapControl = MapControl.create(props);
	}

	componentDidMount() {
		this._ref.appendChild(MapControl.getContainer());
		MapControl.resize();
		MessageService.on('update:crs', this._update);
	}

	componentWillUnmount() {
		MessageService.off('update:crs', this._update);
	}

	private _update() {
		this.forceUpdate();
	}

	private _setRef(e: any) {
		this._ref = e;
	}

	render() {
		const className = mergeClasses(
			'map-container',
			`mode-${ MapControl.getMode() }`
		);

		const models = [
			UniverseService.getCurrentWorld().trails,
			ServiceGeoNote.getModel()
		];

		return (
			<div>
				<div className={ className } ref={ this._setRef } />
				<svg>
					<MarkerVertex />
					<MarkerArrowHead />
					{
						models.map(model => (
							<FeatureCollectionLayer
								key={ model.getTitle() }
								model={ model }
							/>
						))
					}
				</svg>
				<CenterCoordinate />
				<ZoomLevel />
				<div className="main-tool-bar">
					<ModeSelector />
					<StyleSelector />
					<CRSSelector />
				</div>
				<PopUpMenu />
			</div>
		);
	}
}
