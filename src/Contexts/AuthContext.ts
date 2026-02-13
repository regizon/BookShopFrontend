import {createContext, useContext} from "react";

interface AuthContextType {
    isAuthenticated: boolean;
    pendingRoot: string| null;
    handlePendingRoot: (root: string) => void;
    login: (access: string, refresh: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context){
        throw new Error('useAuth() must be used within a CartProvider');
    }
    return context;
};