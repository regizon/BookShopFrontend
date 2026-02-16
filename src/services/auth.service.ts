import instance from "./httpClient.ts"
import type {AuthResponse} from "../models/auth.ts";
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
                }}).catch(function(error){

                    const data = error.response.data
                    if (data.message) {
                        throw new Error(data.message)
                    } else if (data.email){
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
            }}).catch(function(error){

                const data = error.response.data
                if (data.message) {
                    throw new Error(data.message)
                } else if (data.email){
                    const emailError = Array.isArray(data.email) ? data.email[0] : data.email;
                    throw new Error(emailError)
                } else {
                    throw new Error("Отакої, щось пішло не так...");
                }
        })
    )
}



function verifyCode(email: string, code: string, native_name?: string | null): Promise<AuthResponse> {
    const payload: any = {
        email: email,
        code: code,
    };

    if (native_name !== null && native_name !== undefined) {
        payload.native_name = native_name;
    }

    return (
        instance({
            url: ENDPOINTS.AUTH.VERIFY,
            method: 'post',
            data: payload
            //data: {"email": email, "code": code, ...(native_name && { native_name })}
        }).then((response) => {
            if (response.status === 200) {
                return response['data']
            }}).catch(function(error){
                if (error.response) {
                    throw Error(error.response.data.message)
                } else if (error.request){
                    throw Error(error.request);
                } else {
                    throw Error(error.message);
                }
        })
    )
}

async function obtainNewAccessCode(){
    const refreshToken = localStorage.getItem("refreshToken")
    return (
        instance({
            url: ENDPOINTS.AUTH.REFRESH,
            method: 'post',
            data: {"refresh" : refreshToken},
        }).then((response) => {
            if (response.status === 200) {
                const data = response['data']
                const accessToken = data['accessToken']
                localStorage.setItem("accessToken", accessToken)
                return accessToken
            }}).catch(function(error){
                if (error.response.status == 401) {
                    throw Error(error.response.data.message)
                } else if (error.request){
                    throw Error(error.request);
                } else {
                    throw Error(error.message);
                }
        })
    )
}

function clearAuth(){
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
}

export {sendRegisterCode, sendLoginCode, verifyCode, obtainNewAccessCode, clearAuth};