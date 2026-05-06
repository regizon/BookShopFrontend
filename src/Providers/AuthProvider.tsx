import {useState, useEffect} from 'react';
import {AuthContext} from "../Contexts/AuthContext.ts";
import {checkAdmin, obtainNewAccessCode} from "../services/auth.service.ts";
import type {ReactNode} from 'react';
import {Navigate} from "react-router"


interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        const accessToken = localStorage.getItem("accessToken");
        return !!accessToken;
    });

    const [pendingRoot, setPendingRoot] = useState<string | null>(null);
    const [isStaff, setIsStaff] = useState<boolean>(false);
    const [isLogout, setIsLogout] = useState<boolean>(false);

    async function isAdmin() {
        const adminStatus = await checkAdmin()
        setIsStaff(adminStatus)
        return adminStatus
    }

    useEffect(() => {
        isAdmin()
    }, [])

    function handlePendingRoot(root: string){
        setPendingRoot(root);
    }

    async function login(accessToken: string, refreshToken: string) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        setIsAuthenticated(true);
        //await isAdmin();
        // if(pendingRoot){
        //     return(
        //         <Navigate to={pendingRoot} replace />
        //     )
        // }
        return await isAdmin()
    }

    function logout() {
        localStorage.clear()
        setIsLogout(true)
        setIsAuthenticated(false)
        setIsStaff(false)
        return(
            <Navigate to="" replace/>
        )
    }

    function resetLogout() {
        setIsLogout(false)
    }


    async function refreshAccessToken() {
        const refreshToken = localStorage.getItem("refreshToken");
        if(refreshToken !== null){
            const accessToken = await obtainNewAccessCode();
            localStorage.setItem("accessToken", accessToken);
            setIsAuthenticated(true);
        }
    }

    return (
        <AuthContext.Provider value={{login, logout, isAuthenticated, isStaff, isAdmin, handlePendingRoot, pendingRoot, refreshAccessToken, isLogout, resetLogout}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;