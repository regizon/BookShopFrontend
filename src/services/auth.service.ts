import instance from "./httpClient.ts"
import type {AuthResponse} from "../models/auth.ts";

function sendLoginCode(email: string) {
    return (
        instance({
        url: '/user/auth/login/',
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
            url: '/user/auth/register/',
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
    console.log("native name in function = ", native_name)
    const payload: any = {
        email: email,
        code: code,
    };

    if (native_name !== null && native_name !== undefined) {
        payload.native_name = native_name;
    }

    return (
        instance({
            url: '/user/auth/verify/',
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


export {sendRegisterCode, sendLoginCode, verifyCode};