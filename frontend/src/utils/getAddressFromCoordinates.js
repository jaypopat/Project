export const getAddressFromCoordinates = async ([latitude, longitude]) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  console.log(data)

  if (data.error) {
    throw new Error(data.error);
  }

  return data.address;
};
