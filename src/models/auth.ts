export interface AuthResponse {
    tokens: {
        refresh: string;
        access: string;
    }
}

export type AuthStatus = "login" | "registration" | "verification"