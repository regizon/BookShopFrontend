import {createContext, useContext} from "react";

interface AuthContextType {
    isAuthenticated: boolean;
    isLogout: boolean;
    resetLogout: () => void;
    isAdmin: () => Promise<boolean>;
    isStaff: boolean;
    pendingRoot: string | null;
    handlePendingRoot: (root: string) => void;
    login: () => Promise<boolean>;
    logout: () => void;
    refreshAccessToken: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth() must be used within an AuthProvider');
    }
    return context;
};
