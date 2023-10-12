/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import "./Rooms.css";
import "react-toastify/dist/ReactToastify.css";
import { getAddressFromCoordinates } from "../utils/getAddressFromCoordinates";
import Spinner from "./Spinner";

const Rooms = ({ nearbyRooms }) => {
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      setIsLoading(true);

      if (nearbyRooms.length === 0) {
        setError('No nearby rooms available.');
        setIsLoading(false);
        return;
      }

      const newAddresses = await Promise.all(
        nearbyRooms.map(async (room) => {
          const address = await getAddressFromCoordinates(
            room.location.latitude,
            room.location.longitude,
          );
          return { roomName: room.name, address };
        })
      );
      console.log(nearbyRooms);
      console.log(newAddresses);

      setAddresses(newAddresses);
      setIsLoading(false);
    };

    if (nearbyRooms) {
      fetchAddresses();
    }
  }, [nearbyRooms]);

  if (nearbyRooms == null) return;

  return isLoading ? <Spinner /> : error ? <div id = "error">{error}</div> : 
  <table id="rooms">
    <thead>
      <tr>
        <th>Room Name</th>
        <th>Address</th>
      </tr>
    </thead>
    <tbody>
      {nearbyRooms.map((room) => {
        const roomAddress = addresses.find(address => address.roomName === room.name);
        return (
          <tr key={room.name}>
            <td>{room.name}</td>
            <td>
              {roomAddress?.address?.amenity ?? 'N/A'},{" "}
              {roomAddress?.address?.city ?? 'N/A'},{" "}
              {roomAddress?.address?.postcode ?? 'N/A'}, {roomAddress?.address?.county ?? 'N/A'}
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
}

export default Rooms;
