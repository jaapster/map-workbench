export interface Ev {
	merc: Pt;
	point: Pt;
	lngLat: LngLat;
	movement: Pt;
	originalEvent: any;
}

export type Dict<T> = { [key: string]: T };

export type EPSG = 4326 | 3857;

export interface Location {
	epsg: EPSG;
	zoom: number;
	title?: string;
	center: Co;
}

export interface Pt {
	x: number;
	y: number;
}

export interface LngLat {
	lng: number;
	lat: number;
}

export type BBox = [number, number, number, number];

export type Co = [number, number];

export type Cos = Co | Co[] | Co[][] | Co[][][];

export type GeometryType = 'Point' | 'MultiPoint' | 'LineString' | 'MultiLineString' | 'Polygon' | 'MultiPolygon';

export interface Geometry {
	type: GeometryType;
	coordinates: Cos;
}

export interface Point extends Geometry {
	type: 'Point';
	coordinates: Co;
}

export interface MultiPoint extends Geometry {
	type: 'MultiPoint';
	coordinates: Co[];
}

export interface LineString extends Geometry {
	type: 'LineString';
	coordinates: Co[];
}

export interface MultiLineString extends Geometry {
	type: 'MultiLineString';
	coordinates: Co[];
}

export interface Polygon extends Geometry {
	type: 'Polygon';
	coordinates: Co[][];
}

export interface MultiPolygon extends Geometry {
	type: 'MultiPolygon';
	coordinates: Co[][][];
}

export interface Feature<Geometry> {
	type: string;
	geometry: Geometry;
	properties: {
		id: string,
		type: string,
		text?: string
	};
	bbox: BBox;
}

export interface FeatureCollection {
	type: string;
	features: Feature[];
}

export type Bounds = [Co, Co];

export interface MapboxLayer {
	id: string;
	type: string;
	source: string;
}

export interface MapboxSource {
	type: string;
	tiles: string[];
}

export interface MapboxStyle {
	layers: MapboxLayer[];
	sources: Dict<MapboxSource>;
}

export type ReferenceStyle = string | MapboxStyle;

type SelectionVector = number[];

interface CollectionData {
	name: string;
	selection: SelectionVector[];
	featureCollection: FeatureCollection;
}

interface LayerData {
	id: string;
	style: MapboxStyle;
	opacity: number;
	visible: boolean;
}

interface MapData {
	id: string;
	layers: LayerData[];
	opacity: number;
	visible: boolean;
}

interface WorldData {
	id: string;
	collections: CollectionData[];
	currentMapId: string;
	universeIndex: number;
	currentCollectionId: string;
}

interface UniverseData {
	crs: EPSG;
	maps: MapData[];
}

export interface MultiverseData {
	worlds: WorldData[];
	universes: UniverseData[];
	currentWorldId: string;
	referenceLayers: [string, (string | MapboxStyle)][];
	currentReferenceLayer: string | MapboxStyle;
}

export type MapControlMode = 'navigate' | 'update' | 'drawPoint' | 'drawCircle' | 'drawRectangle' | 'drawSegmented' | 'menu';

export interface MapControlData {
	mode: MapControlMode;
	zoom: number;
	pitch: number;
	glare: boolean;
	mouse: Co;
	center: Co;
	extent: Feature<Polygon>;
	bearing: number;
	glareLevel: number;
	overviewOffset: number;
	overviewVisible: boolean;
}

export interface PanelGroup {
	collapsed: boolean;
}

export interface UIData {
	tabs: {
		[tabGroupId: string]: {
			activeTab: number;
		}
	};
	panels: {
		[panelGroupId: string]: PanelGroup
	};
}

export interface Box {
	width: number;
	height: number;
}

export interface GeoLocationData {
	position: Co;
	accuracy: number;
	follow: boolean;
	trace: boolean;
}

export type UnitSystem = 'metric' | 'imperial';

export interface SettingsData {
	unitSystem: UnitSystem;
	language: string;
	scale: number;
	scales: number[];
}


export type LanguagePack = Dict<string | LanguagePack>;

export interface LanguageData {
	language: string;
	languagePacks: LanguagePack[];
}

export interface SystemData {
	appId: string;
	appPhase: string;
	authorized: boolean;
	authenticated: boolean;
	requestPending: boolean;
	authenticationError: string | null;
}

export interface State {
	ui: UIData;
	system: SystemData;
	settings: SettingsData;
	appPhase: string;
	bookmarks: Location[];
	languages: LanguageData;
	multiverse: MultiverseData;
	mapControl: MapControlData;
	geoLocation: GeoLocationData;
}
