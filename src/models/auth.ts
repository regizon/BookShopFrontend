import {AxiosError} from "axios";

export interface AuthResponse {
    tokens: {
        refresh: string;
        access: string;
    }
}


export interface RefreshItem {
    resolve: (token: string) => void;
    reject: (error: AxiosError) => void;
}

export type AuthStatus = "login" | "registration" | "verification"