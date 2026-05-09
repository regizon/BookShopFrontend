import {AxiosError} from "axios";

export interface MeResponse {
    email: string;
    is_staff: boolean;
}

export interface RefreshItem {
    resolve: () => void;
    reject: (error: AxiosError) => void;
}

export type AuthStatus = "login" | "registration" | "verification"
