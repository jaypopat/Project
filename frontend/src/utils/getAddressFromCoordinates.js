export const getAddressFromCoordinates = async (latitude, longitude) => {
  const api_key = "f430ca359a954c8ba0c1c67d773ef19f";

  var query = latitude + "," + longitude;
  var api_url = "https://api.opencagedata.com/geocode/v1/json";

  var request_url =
    api_url +
    "?" +
    "key=" +
    api_key +
    "&q=" +
    encodeURIComponent(query) +
    "&pretty=1" +
    "&no_annotations=1";

  const response = await fetch(request_url);
  var data = await response.json();
  return data.results[0];
};
