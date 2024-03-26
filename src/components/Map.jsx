import { useContext, useEffect, useRef } from "react";
import { UserContext } from "../App.jsx";
import mapboxgl from "mapbox-gl";
import { updateCircleRadius } from "../utils/updateCircleRadius.js";
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;

const MapComponent = ({ locations }) => {
    const randomColors = ["#6ed9a1", "#f9d56e", "#f96e6e", "#6e7cf9", "#d96ef9"];
    const mapContainer = useRef(null);
    const map = useRef(null);
    const { userLocation } = useContext(UserContext);

    useEffect(() => {
        if (map.current) return;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/navigation-night-v1',
            center: [userLocation.longitude, userLocation.latitude],
            zoom: 11,
        });

        map.current.on('load', () => {
            new mapboxgl.Marker().setLngLat([userLocation.longitude, userLocation.latitude]).addTo(map.current);
            locations.forEach((location, index) => {
                const sourceId = `circleSource-${index}`;
                const layerId = `circleLayer-${index}`;
                const radiusInPixels = updateCircleRadius(location.latitude, map.current.getZoom(), location.radius);

                map.current.addSource(sourceId, {
                    "type": "geojson",
                    "data": {
                        "type": "FeatureCollection",
                        "features": [{
                            "type": "Feature",
                            "geometry": {
                                "type": "Point",
                                "coordinates": [location.longitude, location.latitude],
                            },
                        }],
                    },
                });

                map.current.addLayer({
                    "id": layerId,
                    "type": "circle",
                    "source": sourceId,
                    "paint": {
                        "circle-radius": radiusInPixels,
                        "circle-color": randomColors[index % randomColors.length],
                        "circle-opacity": 0.6,
                    },
                });
            });
        });
    }, [locations, userLocation.latitude, userLocation.longitude]);

    useEffect(() => {
        const updateCircles = () => {
            if (!map.current || !map.current.isStyleLoaded()) return;

            locations.forEach((location, index) => {
                const layerId = `circleLayer-${index}`;
                const newRadiusInPixels = updateCircleRadius(location.latitude, map.current.getZoom(), location.radius*2);

                if (map.current.getLayer(layerId)) {
                    map.current.setPaintProperty(layerId, 'circle-radius', newRadiusInPixels);
                }
            });
        };

        map.current?.on('load', updateCircles);
        map.current?.on('zoomend', updateCircles);

        updateCircles();

        return () => {
            map.current?.off('load', updateCircles);
            map.current?.off('zoomend', updateCircles);
        };
    }, [locations]);

    return <div className="map-container" ref={mapContainer}></div>;
};

export default MapComponent;
