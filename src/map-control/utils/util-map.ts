export const enableInteractions = (map: any) => {
	if (map != null) {
		map.boxZoom.enable();
		map.dragPan.enable();
		map.dragRotate.enable();
		map.scrollZoom.enable();
		map.doubleClickZoom.enable();
	}
};

export const disableInteractions = (map: any) => {
	if (map != null) {
		map.boxZoom.disable();
		map.dragPan.disable();
		map.dragRotate.disable();
		map.scrollZoom.disable();
		map.doubleClickZoom.disable();
	}
};

export const add3dBuildings = (map: any) => {
	if (map != null) {
		// Insert the layer beneath any symbol layer.
		const layers = map.getStyle().layers;

		let labelLayerId;
		for (let i = 0; i < layers.length; i += 1) {
			if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
				labelLayerId = layers[i].id;
				break;
			}
		}

		map.addLayer({
			'id': '3d-buildings',
			'source': 'composite',
			'source-layer': 'building',
			'filter': ['==', 'extrude', 'true'],
			'type': 'fill-extrusion',
			'minzoom': 15,
			'paint': {
				'fill-extrusion-color': '#aaa',

				// use an 'interpolate' expression to add a smooth transition effect to the
				// buildings as the user zooms in
				'fill-extrusion-height': [
					'interpolate', ['linear'], ['zoom'],
					15, 0,
					15.05, ['get', 'height']
				],
				'fill-extrusion-base': [
					'interpolate', ['linear'], ['zoom'],
					15, 0,
					15.05, ['get', 'min_height']
				],
				'fill-extrusion-opacity': .6
			}
		}, labelLayerId);
	}
};

export const styles = [
	['Light', 'mapbox://styles/mapbox/light-v10'],
	['Dark', 'mapbox://styles/mapbox/dark-v10'],
	['Empty', 'mapbox://styles/jaapl/cjy8jar9u0y6y1co8rn1j9kpw']
	// ['Blue', 'mapbox://styles/jaapl/cjxutkz950m341cnigemqtqmb'],
	// ['Streets', 'mapbox://styles/mapbox/streets-v11'],
	// ['Outdoors', 'mapbox://styles/mapbox/outdoors-v10'],
	// ['Hybrid', 'mapbox://styles/mapbox/satellite-streets-v10'] // ,
];
