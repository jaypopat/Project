/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import { useContext,useEffect } from "react";

import { UserContext } from "../App";
import { toast } from "react-toastify";
import Spinner from "./Spinner";

function Protected({ children }) {
  const { user, userLocation, userLocationFetchingInBackground } = useContext(UserContext);

  useEffect(() => {
    const reloadUserData = async () => {
      await user.reload();
    }

    reloadUserData();
  }), [];

  if (userLocationFetchingInBackground) {
    return <Spinner />;
  }
  if (!user?.emailVerified) {
    return <Navigate to="/login" replace />;
  }
  if (!userLocation) {
    toast.error("give access to location");
    return <Navigate to="/" replace />;
  }
  return children;
}
export default Protected;
