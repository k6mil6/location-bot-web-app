import { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './Map.css';

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAP_BOX_API_KEY;
const URL = 'http://localhost:8080/';

const Map = () => {
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

    // const userID = window.Telegram.WebApp.data.initDataUnsafe.user.id;

    const userID = 746446622;

    const userLocation =  fetch(
        URL + '/user?id=' + userID,
    )
    console.log(userLocation)

    useEffect(() => {
        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11', // Specify the map's style
            center: [-77.034084, 38.909671], // Initial map center coordinates
            zoom: 15,
        });

        const marker = new mapboxgl.Marker()
            .setLngLat([-78, 38.909671]) // Marker coordinates
            .addTo(map);

        marker.getElement().addEventListener('click', () => {
            const destination = marker.getLngLat();
            const userAgent = navigator.userAgent || navigator.vendor || window.opera;

            if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
                window.open(`maps://?q=${destination.lat},${destination.lng}`);
            } else {
                window.open(`geo:${destination.lat},${destination.lng}?q=${destination.lat},${destination.lng}`);
            }
        });

    }, []);

    return <div id="map" className="map"/>;
};

export default Map;