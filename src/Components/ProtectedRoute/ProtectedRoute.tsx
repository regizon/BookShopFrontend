import {useAuth} from "../../Contexts/AuthContext.ts";
import { Navigate, Outlet, useLocation } from "react-router"
import {useModal} from "../../Contexts/ModalContext.ts";
import {useEffect} from "react";

function ProtectedRoute() {
    const {isAuthenticated, authChecked, handlePendingRoot, isLogout, resetLogout} = useAuth()
    const location = useLocation()
    const {openModal} = useModal()
    const currentRoot = location.pathname

    useEffect(() => {
        // Wait until the initial /user/auth/me/ call has settled so we don't
        // open the login modal or redirect during the brief loading window.
        if (!authChecked) return;
        if(!isAuthenticated && !isLogout){
            handlePendingRoot(currentRoot)
            openModal("login")
        }
        resetLogout()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated, authChecked])

    // Render nothing while the initial auth check is in flight.
    if (!authChecked) return null;

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