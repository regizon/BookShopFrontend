import {useAuth} from "../../Contexts/AuthContext.ts";
import { Navigate, Outlet } from "react-router"

function AdminRoute() {
    const {isStaff} = useAuth()

    if(isStaff){
        return(
            <Outlet />
        )
    }else{
        return(<Navigate to={"/profile/"} replace/>)
    }

}

export default AdminRoute;