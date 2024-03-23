import {useRef, useEffect, useState} from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './Map.css';


const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAP_BOX_API_KEY;
const URL = import.meta.env.VITE_API_URL;

//

const Map = () => {
    const [data, setData] = useState({ user: null, locations: [] });
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;


    useEffect(() => {
        // Проверяем, доступен ли объект Telegram WebApp
        if (window.Telegram.WebApp) {
            // Получаем userID из объекта Telegram WebApp
            const userID = window.Telegram.WebApp.initDataUnsafe.user.id;

            // Функция для получения данных пользователя
            const fetchData = async () => {
                try {
                    const response = await fetch(`${URL}user?id=${userID}`);
                    const json = await response.json();
                    setData(json); // Обновляем состояние данными пользователя
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            };

            fetchData();
        } else {
            console.error('Telegram WebApp object is not available.');
        }
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

            const bounds = new mapboxgl.LngLatBounds();

            // Add marker for the user
            new mapboxgl.Marker({
                color: '#314ccd'
            })
                .setLngLat(data.user.Coordinates)
                .addClassName('user-marker')
                .addTo(map);

            bounds.extend(data.user.Coordinates);

            // Loop over locations and add each as a marker
            data.locations.forEach(location => {
                const marker = new mapboxgl.Marker()
                    .setLngLat(location.Coordinates)
                    .addTo(map);

                bounds.extend(location.Coordinates);

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

            map.fitBounds(bounds, {
                padding: 50,
            })
        }
    }, [data]);

    return <div id="map" className="map" />;
};

export default Map;