import { debounce } from 'lodash';
import { MapControl } from '../map-control/map-control';
import { MessageService } from './service.message';

const SEPARATOR = '/';
const ASSIGN = ':';

const getHashParams = () => {
	const hash = window.location.hash.substr(2);

	if (!hash.length) {
		return {};
	}

	return hash.split(SEPARATOR).reduce((m, item) => {
		const [key, value] = item.split(ASSIGN);

		let v;

		try {
			v = JSON.parse(value);
		} catch (e) {
			v = value;
		}

		return {
			...m,
			[key]: v
		};
	}, {} as any);
};

const setHashParams = debounce((par: any) => {
	const params = {
		...getHashParams(),
		...par
	};

	window.location.hash = Object.keys(params).reduce((m, key) => {
		const f = params[key];

		const v = Array.isArray(f) || typeof f === 'boolean' || typeof f === 'number'
			? JSON.stringify(f)
			: f;


		return `${m}${SEPARATOR}${key}${ASSIGN}${v}`;
	}, '#');
}, 100);

const round = (v: number, d: number) => {
	return Math.round(v * (10 ** d)) / (10 ** d);
};

const update = () => {
	const [x, y] = MapControl.getCenter();
	const zoom = MapControl.getZoom();

	setHashParams({
		center: [round(x, 6), round(y, 6)],
		zoom: round(zoom, 1),
		epsg: MapControl.getCRS()
	});
};

const onHashChange = () => {
	const { zoom, center, epsg } = getHashParams();

	MapControl.setLocation({
		center,
		zoom,
		epsg
	});
};

setTimeout(() => {
	window.addEventListener('hashchange', onHashChange, false);

	MessageService.on('update:center', update);
	MessageService.on('update:zoom', update);
	MessageService.on('update:crs', update);
}, 100);
