import {useRef, useEffect, useState} from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './Map.css';

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAP_BOX_API_KEY;
const URL = import.meta.env.VITE_API_URL;

// const userID = window.Telegram.WebApp.data.initDataUnsafe.user.id;

const Map = () => {
    const [data, setData] = useState({ user: null, locations: [] });
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;


    useEffect(() => {
        const userID = 746446622;
        console.log(`${URL}user?id=${userID}`);
        // Assuming this is static or comes from somewhere outside
        const fetchData = async () => {
            try {
                const response = await fetch(`${URL}user?id=${userID}`);
                const json = await response.json();
                console.log(json);
                setData(json); // Update state with the fetched data
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (data.user) {
            // Only run this code if the `data` state has been set with the fetched data
            const map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/streets-v11',
                center: data.user.Coordinates, // Use user's coordinates
                zoom: 15,
            });

            // Add marker for the user
            new mapboxgl.Marker({
                color: '#314ccd'
            })
                .setLngLat(data.user.Coordinates)
                .addClassName('user-marker')
                .addTo(map);

            // Loop over locations and add each as a marker
            data.locations.forEach(location => {
                const marker = new mapboxgl.Marker()
                    .setLngLat(location.Coordinates)
                    .addTo(map);

                marker.getElement().addEventListener('click', () => {
                    const destination = marker.getLngLat();
                    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

                    // Check if the device is an iOS device
                    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
                        // Use the Apple Maps URL scheme
                        window.open(`maps://?ll=${destination.lat},${destination.lng}&q=Location`);
                    } else {
                        // Use the Geo URI for other devices
                        window.open(`geo:${destination.lat},${destination.lng}?q=${destination.lat},${destination.lng}`);
                    }
                });
            });
        }
    }, [data]);

    return <div id="map" className="map" />;
};

export default Map;