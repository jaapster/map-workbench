export const createRasterStyle = (layerName: string, tiles: string[]) => (
	{
		version: 8,
		// todo: create our own glyph fallback
		glyphs: 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf',
		sources: {
			[layerName]: {
				type: 'raster',
				tiles,
				tileSize: 256
			}
		},
		layers: [
			{
				id: layerName,
				type: 'raster',
				source: layerName
			}
		]
	}
);
