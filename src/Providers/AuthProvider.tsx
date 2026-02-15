import {useState} from 'react';

import {AuthContext} from "../Contexts/AuthContext.ts";
import {obtainNewAccessCode} from "../services/auth.service.ts";
import type {ReactNode} from 'react';


interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {

    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        const accessToken = localStorage.getItem("accessToken");
        return !!accessToken;
    });

    const [pendingRoot, setPendingRoot] = useState<string | null>(null);


    function handlePendingRoot(root: string){
        setPendingRoot(root);
    }

    function login(accessToken: string, refreshToken: string) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        setIsAuthenticated(true);
    }

    function logout() {
        localStorage.clear()
        setIsAuthenticated(false)
    }

    async function refreshAccessToken() {
        const refreshToken = localStorage.getItem("refreshToken");
        if(refreshToken !== null){
            const accessToken = await obtainNewAccessCode(refreshToken);
            localStorage.setItem("accessToken", accessToken);
            setIsAuthenticated(true);
        }

    }

    return (
        <AuthContext.Provider value={{login, logout, isAuthenticated, handlePendingRoot, pendingRoot, refreshAccessToken}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;