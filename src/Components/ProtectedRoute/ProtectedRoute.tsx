import {useAuth} from "../../Contexts/AuthContext.ts";
import { Navigate, Outlet, useLocation } from "react-router"
import {useModal} from "../../Contexts/ModalContext.ts";
import {useEffect} from "react";

function ProtectedRoute() {
    const {isAuthenticated, handlePendingRoot, isLogout, resetLogout} = useAuth()
    const location = useLocation()
    const {openModal} = useModal()
    const currentRoot = location.pathname

    useEffect(() => {
        if(!isAuthenticated && !isLogout){
            handlePendingRoot(currentRoot)
            openModal("login")
        }
        resetLogout()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated])

    if(!isAuthenticated){
        return(<Navigate to={""} />)
    }
    return(
        <Outlet />
    )
    // if(isAuthenticated){
    //     return(
    //         <Outlet />
    //     )
    // }else if(!isLogout){
    //     handlePendingRoot(currentRoot)
    //     openModal("login")
    //     return(<Navigate to={""} replace/>)
    // }else{
    //     return(<Navigate to={""} replace/>)
    // }

}

export default ProtectedRoute;