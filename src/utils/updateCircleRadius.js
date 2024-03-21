import {getMetersPerPixelAtLatitude} from "./getMetersPerPixelAtLatitude.js"

export const updateCircleRadius = (latitude, zoom, radiusInKm) => {
    const radiusInMeters = radiusInKm * 1000;
    const metersPerPixel = getMetersPerPixelAtLatitude(latitude, zoom);
    return radiusInMeters / metersPerPixel; // Return the calculated radius in pixels
};