const fs = require('fs');
const path = require('path');
const pointInPolygon = require('@turf/boolean-point-in-polygon').default;

module.exports.onGet = function (req, res) {
	fs.readFile(path.join(__dirname, './data/geojson/provinces.json'), (err, data) => {
		if (err) {
			throw err;
		}

		const { lngLat } = req.params;

		res.send(JSON.parse(data).features.find(f => pointInPolygon(lngLat.split(','), f)));
	});
};

module.exports.onPost = function (req, res) {
	fs.readFile(path.join(__dirname, './data/geojson/provinces.json'), (err, data) => {
		if (err) {
			throw err;
		}

		// const zoom = req.body.zoom;
		// const layers = req.body.layers;
		// const geometry = req.body.geometry;

		// const { lng, lat } = req.body.lngLat; // remove me

		const { coordinates: [co] } = req.body.geometry;
		// const { lngLat } = req.params;

		res.send(JSON.parse(data).features.find(f => pointInPolygon(co, f)));
	});
};
