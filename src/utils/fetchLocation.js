import { toast } from "react-toastify";

export const fetchLocation = () => new Promise((resolve, reject) => {
 navigator.geolocation.getCurrentPosition(
   ({ coords: { latitude, longitude } }) => resolve({ latitude, longitude }),
   (error) => {
     if (error.code === error.PERMISSION_DENIED) {
       toast.error("Give access to location");
       reject("Location access denied by user");
     } else {
       reject(error);
     }
   },
   { enableHighAccuracy: true }
 );
});