import instance from "./httpClient.ts"
import type {MeResponse} from "../models/auth.ts";
import {ENDPOINTS} from "./api.constants.ts";

function sendLoginCode(email: string) {
    return (
        instance({
            url: ENDPOINTS.AUTH.LOGIN,
            method: 'post',
            data: {"email": email}
        }).then((response) => {
            if (response.status === 200) {
                return response['data']
            }
        }).catch(function (error) {
            const data = error.response.data
            if (data.message) {
                throw new Error(data.message)
            } else if (data.email) {
                const emailError = Array.isArray(data.email) ? data.email[0] : data.email;
                throw new Error(emailError)
            } else {
                throw new Error("Отакої, щось пішло не так...");
            }
        })
    )
}

function sendRegisterCode(email: string, native_name: string) {
    return (
        instance({
            url: ENDPOINTS.AUTH.REGISTER,
            method: 'post',
            data: {"email": email, "native_name": native_name},
        }).then((response) => {
            if (response.status === 200) {
                return response['data']
            }
        }).catch(function (error) {
            const data = error.response.data
            if (data.message) {
                throw new Error(data.message)
            } else if (data.email) {
                const emailError = Array.isArray(data.email) ? data.email[0] : data.email;
                throw new Error(emailError)
            } else {
                throw new Error("Отакої, щось пішло не так...");
            }
        })
    )
}

function verifyCode(email: string, code: string, native_name?: string | null): Promise<void> {
    const payload: Record<string, string> = {email, code};
    if (native_name != null) {
        payload.native_name = native_name;
    }

    return (
        instance({
            url: ENDPOINTS.AUTH.VERIFY,
            method: 'post',
            data: payload,
        }).then((response) => {
            if (response.status === 200) return;
        }).catch(function (error) {
            if (error.response) {
                throw Error(error.response.data.message)
            } else if (error.request) {
                throw Error(error.request);
            } else {
                throw Error(error.message);
            }
        })
    )
}

// Asks the backend to issue a new access_token cookie using the refresh_token cookie.
// Cookies are sent/received automatically — no token values are handled here.
async function obtainNewAccessCode(): Promise<void> {
    await instance({
        url: ENDPOINTS.AUTH.REFRESH,
        method: 'post',
    }).catch(function (error) {
        if (error.response?.status === 401) {
            throw Error(error.response.data.message)
        } else if (error.request) {
            throw Error(error.request);
        } else {
            throw Error(error.message);
        }
    });
}

// Clears both HttpOnly cookies server-side. Fire-and-forget — no need to await.
function clearAuth() {
    instance.post(ENDPOINTS.AUTH.LOGOUT).catch(() => {});
}

function checkAdmin() {
    return (
        instance({
            url: ENDPOINTS.AUTH.CHECK,
            method: 'get',
        }).then((response) => {
            return response.status === 200;
        }).catch(() => {
            return false;
        })
    )
}

function getMe(): Promise<MeResponse> {
    return instance({
        url: ENDPOINTS.AUTH.ME,
        method: 'get',
    }).then((response) => response.data);
}

export {sendRegisterCode, sendLoginCode, verifyCode, obtainNewAccessCode, clearAuth, checkAdmin, getMe};
