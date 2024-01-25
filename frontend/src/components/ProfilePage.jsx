import { useContext } from "react";
import { UserContext } from "../App";

const ProfilePage = ()=>{
    const { user} = useContext(UserContext);

    return <div>{user.email}</div>
//     <div>
//     <h1>{user.displayName}</h1>
//     <p>{user.email}</p>
//     <img src={user.photoURL} alt={user.displayName} />
//   </div>

}
export default ProfilePage;