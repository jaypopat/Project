/* eslint-disable react/prop-types */
import { useState, useEffect, useContext } from "react";
import "./Rooms.css";
import "react-toastify/dist/ReactToastify.css";
import { getAddressFromCoordinates } from "../utils/getAddressFromCoordinates";
import Spinner from "./Spinner";
import { Link } from "react-router-dom";

import { UserContext } from "../App";
import { calculateDistance } from "../utils/calculateDistance";
import { rooms } from "../roomsArr";

const Rooms = () => {
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { userLocation } = useContext(UserContext);
  const [nearbyRooms, setNearbyRooms] = useState(null);

  useEffect(() => {
    if (userLocation) {
      const newNearbyRooms = rooms.filter((room) => {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          room.location.latitude,
          room.location.longitude
        );
        return distance <= room.radius;
      });
      setNearbyRooms(newNearbyRooms);
    }
  }, [userLocation]);

  useEffect(() => {
    const fetchAddresses = async () => {
      setIsLoading(true);

      if (nearbyRooms.length === 0) {
        setError("No nearby rooms available.");
        setIsLoading(false);
        return;
      }

      const newAddresses = await Promise.all(
        nearbyRooms.map(async (room) => {
          const addressObject = await getAddressFromCoordinates(
            room.location.latitude,
            room.location.longitude
          );
          const address = addressObject.formatted
            ? addressObject.formatted
            : "N/A";
          return { roomName: room.name, address };
        })
      );

      // console.log(nearbyRooms);
      // console.log(newAddresses);

      setAddresses(newAddresses);
      setIsLoading(false);
    };

    if (nearbyRooms) {
      fetchAddresses();
    }
  }, [nearbyRooms]);

  if (nearbyRooms == null) return;

  return isLoading ? (
    <Spinner />
  ) : error ? (
    <div id="error">{error}</div>
  ) : (
    <table id="rooms">
  <thead>
    <tr>
      <th>Room Name</th>
      <th>Address</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    {nearbyRooms.map((room) => {
      const roomAddress = addresses.find(
        (address) => address.roomName === room.name
      );
      return (
        <tr key={room.name}>
          <td>{room.name}</td>
          <td>{roomAddress?.address ?? "N/A"}</td>
          <td>
            <Link to={`/joinroom/${room.chatRoomID}`}>
              <button className="join-button">Join</button>
            </Link>
          </td>
        </tr>
      );
    })}
  </tbody>
</table>

  );
};

export default Rooms;
