import {useAuth} from "../../Contexts/AuthContext.ts";
import { Navigate, Outlet, useLocation } from "react-router"
import {useModal} from "../../Contexts/ModalContext.ts";

function ProtectedRoute() {
    const {isAuthenticated, handlePendingRoot} = useAuth()
    const location = useLocation()
    const {openModal} = useModal()
    const currentRoot = location.pathname

    if(isAuthenticated){
        return(
            <Outlet />
        )
    }else{
        handlePendingRoot(currentRoot)
        openModal("login")
        return(<Navigate to={""} replace/>)
    }

}

export default ProtectedRoute;