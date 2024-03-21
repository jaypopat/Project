export const getMetersPerPixelAtLatitude = (latitude, zoom) => {
    const earthCircumference = 40_075_000 //circumference in meters
    const tilesAtZoomLevel = Math.pow(2, zoom);
    const metersPerTile = earthCircumference/tilesAtZoomLevel;
    const pixelsPerTile = 256;
    const metersPerPixelAtEquator = metersPerTile/pixelsPerTile;
    const latitudeRadians = (latitude*Math.PI) / 180;

    return metersPerPixelAtEquator * Math.cos(latitudeRadians);
}
