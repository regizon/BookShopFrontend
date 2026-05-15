import {useState, useEffect} from 'react';
import {AuthContext} from "../Contexts/AuthContext.ts";
import {clearAuth, getMe, obtainNewAccessCode} from "../services/auth.service.ts";
import type {ReactNode} from 'react';
import {Navigate} from "react-router"


interface AuthProviderProps {
    children: ReactNode;
}

const AuthProvider = ({children}: AuthProviderProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    // true once the initial /user/auth/me/ attempt (and any refresh) has settled.
    // ProtectedRoute waits for this before deciding to redirect.
    const [authChecked, setAuthChecked] = useState(false);
    const [pendingRoot, setPendingRoot] = useState<string | null>(null);
    const [isStaff, setIsStaff] = useState<boolean>(false);
    const [isLogout, setIsLogout] = useState<boolean>(false);

    // Bootstraps auth state by calling /user/auth/me/.
    // If the access cookie is expired the 401 interceptor silently refreshes it first.
    // If refresh also fails the interceptor rejects and we land in catch — no reload.
    async function initAuth(): Promise<boolean> {
        try {
            const me = await getMe();
            setIsAuthenticated(true);
            setIsStaff(me.is_staff);
            return me.is_staff;
        } catch {
            setIsAuthenticated(false);
            setIsStaff(false);
            return false;
        } finally {
            setAuthChecked(true);
        }
    }

    async function isAdmin(): Promise<boolean> {
        return initAuth();
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        initAuth();
    }, []);

    // The httpClient interceptor dispatches this when a mid-session token refresh
    // fails (e.g. refresh token expired while the user was active on the page).
    // We clear React auth state here without a page reload.
    useEffect(() => {
        function handleSessionExpired() {
            setIsAuthenticated(false);
            setIsStaff(false);
            setAuthChecked(true);
        }
        window.addEventListener('auth:session-expired', handleSessionExpired);
        return () => window.removeEventListener('auth:session-expired', handleSessionExpired);
    }, []);

    function handlePendingRoot(root: string) {
        setPendingRoot(root);
    }

    async function login(): Promise<boolean> {
        return initAuth();
    }

    function logout() {
        clearAuth();
        setIsLogout(true);
        setIsAuthenticated(false);
        setIsStaff(false);
        return (
            <Navigate to="" replace/>
        )
    }

    function resetLogout() {
        setIsLogout(false);
    }

    async function refreshAccessToken(): Promise<void> {
        await obtainNewAccessCode();
        setIsAuthenticated(true);
    }

    return (
        <AuthContext.Provider
            value={{
                login,
                logout,
                isAuthenticated,
                authChecked,
                isStaff,
                isAdmin,
                handlePendingRoot,
                pendingRoot,
                refreshAccessToken,
                isLogout,
                resetLogout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;
