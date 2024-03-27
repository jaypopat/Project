import { useContext, useEffect, useRef } from "react";
import { UserContext } from "../App.jsx";
import mapboxgl from "mapbox-gl";
import { updateCircleRadius } from "../utils/updateCircleRadius.js";
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;

const MapComponent = ({ locations }) => {
    const randomColors = ["#FF6633", "#FFB399", "#FF33FF", "#FFFF99", "#00B3E6", "#E6B333", "#3366E6", "#999966", "#99FF99", "#B34D4D", "#80B300", "#809900", "#E6B3B3", "#6680B3", "#66991A", "#FF99E6", "#CCFF1A", "#FF1A66", "#E6331A", "#33FFCC", "#66994D", "#B366CC", "#4D8000", "#B33300", "#CC80CC", "#66664D", "#991AFF", "#E666FF", "#4DB3FF", "#1AB399", "#E666B3", "#33991A", "#CC9999", "#B3B31A", "#00E680", "#4D8066", "#809980", "#E6FF80", "#1AFF33", "#999933", "#FF3380", "#CCCC00", "#66E64D", "#4D80CC", "#9900B3", "#E64D66", "#4DB380", "#FF4D4D", "#99E6E6", "#6666FF"];
    const mapContainer = useRef(null);
    const map = useRef(null);
    const { userLocation } = useContext(UserContext);

    useEffect(() => {
        if (map.current) return;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/navigation-night-v1',
            center: [userLocation.longitude, userLocation.latitude],
            zoom: 4,
        });

        map.current.on('load', () => {
            new mapboxgl.Marker().setLngLat([userLocation.longitude, userLocation.latitude]).addTo(map.current); // Add user location marker

            locations.forEach((location, index) => { // Add circles for each location
                const sourceId = `circleSource-${index}`;
                const layerId = `circleLayer-${index}`;
                const radiusInPixels = updateCircleRadius(location.latitude, map.current.getZoom(), location.radius); // Calculate radius in pixels based on zoom level

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
                        "circle-opacity": 0.4,
                    },
                });
            });
        });
    }, [locations, userLocation.latitude, userLocation.longitude]);

    useEffect(() => {
        const updateCircles = () => { // Update circle radius when zoom level changes
            if (!map.current || !map.current.isStyleLoaded()) return; // Check if map is loaded

            locations.forEach((location, index) => { // Update circle radius for each location
                const layerId = `circleLayer-${index}`;
                const newRadiusInPixels = updateCircleRadius(location.latitude, map.current.getZoom(), location.radius*2); // Calculate new radius in pixels based on zoom level

                if (map.current.getLayer(layerId)) {
                    map.current.setPaintProperty(layerId, 'circle-radius', newRadiusInPixels);
                }
            });
        };

        map.current?.on('load', updateCircles); // Update circles when map is loaded
        map.current?.on('zoomend', updateCircles); // Update circles when zoom level changes

        updateCircles(); // Update circles when component is mounted

        return () => { // Remove event listeners when component is unmounted
            map.current?.off('load', updateCircles); 
            map.current?.off('zoomend', updateCircles);
        };
    }, [locations]);

    return <div className="map-container" ref={mapContainer}></div>;
};

export default MapComponent;
