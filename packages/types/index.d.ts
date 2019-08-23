export interface Response {
	data: any;
}

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
	name?: string;
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

interface WorldData {
	id: string;
	maps: Dict<{ layers: Dict<any> }>;
	mapSettings: Dict<any>;
	collections: CollectionData[];
	currentCRS: number;
	currentMapId: string;
	currentCollectionId: string;
}

export interface MultiverseData {
	worlds: WorldData[];
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

export interface UserData {
	groups: string[];
	isAuthenticated: boolean;
	profile: {
		id: string;
		tags: { id: string; }[];
		isLocal: true;
		userName: string;
		lastName: string;
		initials: string;
		firstName: string;
		middleName: string;
		isImplicit: boolean;
		displayName: string;
		emailAddress: string;
		canChangePassword: boolean;
	};
}

export interface WorldInfoData {
	id: string;
	universeIndex: number;
	defaultEnvelope: Polygon & {
		crs: {
			properties: {
				href: string;
				type: string;
			};
			type: string;
		};
		metadata: {
			epsgCode: number;
			measurementInfo: number;
			world: {
				universeIndex: number;
				worldId: string
			}
		}
	};
	description: string;
	transform: {
		scale: number;
	};
	unitFactor: number;
}

export interface ApplicationInfoData {
	anonymousLoginAllowed: boolean;
	automaticLoginEnabled: boolean;
	projects: {
		name: string;
		projectID: string;
		title: string
	}[];
	settings: Dict<{
		defaultValue: any;
		values: any[];
	}>;
}

export interface ServerInfoData {
	apiVersion: string;
	globalEnumerations: {
		fieldType: { [key: number]: string };
	};
	name: string;
	serverBuildDate: string;
	serviceEndpoints: {
		api: string;
		static: string;
		tiles: string;
	};
	serviceProviders: {
		geoCoders: {
			isDirect: boolean;
			name: string;
			requestParameters: Dict<any>;
			title: string;
		}[];
		tileProviders: {
			isAllowedForPlots: boolean;
			modes: {
				attribution: string;
				description: string;
				maxLevel: 17;
				minLevel: 1;
				name: string;
				servers: string[];
				tileDimensions: {
					width: number;
					height: number;
				}
			}[];
			name: string;
			title: string;
			type: string;
		}[];
	};
}

export interface ServerSettingsData {
	enumeratorValueProviders: Dict<{
		name: string;
		url: string;
	}>;
}

export interface ApplicationListData {
	id: string;
	url: string;
	name: string;
	tags: {
		id: string,
		name: string,
		properties: {
			themes: Dict<{
				tileIcon: string;
				taskBarIcon: string
			}>
		}
	}[];
}

export interface ProjectData {
	id: string;
	businessFormRegistrations: {
		description: string;
		drawLocation: string;
		icon: string;
		title: string;
		url: string;
	}[];
	coordinateSystems: {
		epsgCode: number;
		isProjected: boolean;
		title: string;
		units: {
			name: string;
			title: string;
		}[];
	}[];
	exportDefinitions: {
		fileFilter: string;
		id: string;
		mimeType: {
			contentType: string;
			id: string;
		};
		requiredGeometryTypes: string[];
		title: string;
	}[];
	mapDefinitions: {
		coordinateSystem: number;
		envelope: Polygon;
		layers: {
			attribution: string;
			duration: number;
			isSelectable: boolean;
			lifetimeIndex: number;
			logicalLayerID: string;
			mapLayerType: string;
			maxLevel: number;
			minLevel: number;
			name: string;
			title: string;
		}[];
		name: string;
		openOnStartup: boolean;
		title: string;
		universeIndex?: number;
	}[];
	plotOutputDefinitions: {
		fileFilter: string;
		id: string;
		mimeType: {
			contentType: string;
			id: string;
		};
		title: string;
	}[];
	plotTemplates: {
		id: string;
		pages: {
			elements: {
				height: number;
				type: string;
				width: number;
				x: number;
				y: number;
			}[];
			height: number;
			sizeName: string;
			type: string;
			width: number;
		}[];
		path: string;
		title: string;
	}[];
	queryDefinitions: {
		id: string;
		parameters: {
			defaultValue: any;
			fieldType: string;
			isLookup: boolean;
			lookupValues: any[];
			name: string;
			parameterType: string;
			title: string;
			type: string;
		}[];
		path: string;
		title: string;
	}[];
	reportOutputDefinitions: {
		fileFilter: string;
		id: string;
		mimeType: {
			contentType: string;
			id: string;
		};
		title: string;
	}[];
	reportTemplates: {
		hasEditableContent: true;
		id: string;
		maximumNumberOfFeatures: number;
		minimumNumberOfFeatures: number;
		path: string;
		tableUrn: string;
		title: string;
	}[];
	schema: {
		$schema: string;
		id: string;
		definitions: Dict<{
			keys: {
				properties: string[];
			},
			metadata: {
				elementInfo: {
					packageType: string;
					urn: string;
				};
				exportable: boolean;
			},
			properties: Dict<any>;
			title: string;
			type: string;
		}>;
	};
	styleEndpoints: {
		modes: {
			name: string;
			url: string;
		}[];
		name: string;
	}[];
	tilesApiToken: string;
	universes: {
		name: string;
		worldIdType: number;
		isGeographic?: boolean;
		isMultiWorld?: boolean;
	}[];
	worlds: WorldInfoData[];
}

export interface SystemData {
	appId: string;
	appPhase: string;
	authorized: boolean;
	authenticated: boolean;
	requestPending: boolean;
	authenticationError: string | null;
}

export interface VectorStyle {
	name: string;
	modes: {
		name: string;
		style: MapboxStyle;
	}[];
}

export interface State {
	// received from xy server
	// todo: put this in a subtree like "staticData"?
	user: UserData | null;
	server: ServerInfoData;
	project: ProjectData;
	application: ApplicationInfoData;
	serverSettings: ServerSettingsData;

	vectorStyles: VectorStyle[];

	ui: UIData;
	system: SystemData;
	settings: SettingsData;
	bookmarks: Location[];
	languages: LanguageData;
	multiverse: MultiverseData;
	mapControl: MapControlData;
	geoLocation: GeoLocationData;

}
