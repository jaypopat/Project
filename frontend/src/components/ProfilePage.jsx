import { useContext } from "react";
import { UserContext } from "../App";

const ProfilePage = ()=>{
    const { user} = useContext(UserContext);

    return <div>{user.displayName}</div>
}
export default ProfilePage;