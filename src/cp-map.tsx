import * as React from 'react';
import * as mapboxgl from 'mapbox-gl';
import { token } from './token';
import { MapPointerEvents } from './map-pointer-events';

// @ts-ignore
mapboxgl.accessToken = token;

const style: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
};

const MAP_ID = '__map__';

export class Map extends React.Component<{}> {
    componentDidMount() {
        const map = new mapboxgl.Map({
            container: MAP_ID,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [-123.83370322531374, 46.186884115163764],
            zoom: 14
        });

        const events = MapPointerEvents.create(map);
    }

    render() {
        return <div id={ MAP_ID } style={ style } />;
    }
}
