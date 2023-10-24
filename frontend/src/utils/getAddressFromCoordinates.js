const API_KEY = import.meta.env.VITE_GEOCODING_API_KEY;

export const getAddressFromCoordinates = async (latitude, longitude) => {
  const response = await fetch(
    `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${API_KEY}`
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  // console.log(data.results[0])

  if (data.status.code !== 200) {
    throw new Error(data.status.message);
  }

  return data.results[0];
};
