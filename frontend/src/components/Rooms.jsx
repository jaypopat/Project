/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import "./Rooms.css";
import "react-toastify/dist/ReactToastify.css";
import { getAddressFromCoordinates } from "../utils/getAddressFromCoordinates";
import Spinner from "./Spinner";

const Rooms = ({ nearbyRooms }) => {
  const [addresses, setAddresses] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);



  useEffect(() => {
    const fetchAddresses = async () => {
      setIsLoading(true);
      const newAddresses = {};
      if(nearbyRooms.length === 0) {
        setError('No nearby rooms available.');
        setIsLoading(false);
        return;
      }

      for (const room of nearbyRooms) {
        newAddresses[room.name] = await getAddressFromCoordinates([
          room.location.latitude,
          room.location.longitude,
        ]);
      }

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
      {nearbyRooms.map((room) => (
        <tr key={room.name}>
          <td>{room.name}</td>
          <td>
            {addresses[room.name]?.amenity},{" "}
            {addresses[room.name]?.city},{" "}
            {addresses[room.name]?.postcode}, {addresses[room.name]?.county}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
}


export default Rooms;
