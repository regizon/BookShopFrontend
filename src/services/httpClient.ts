import axios, {type InternalAxiosRequestConfig, isAxiosError} from 'axios';
import {obtainNewAccessCode, clearAuth} from "./auth.service.ts";
import type {RefreshItem} from "../models/auth.ts";
import {API_CONFIG} from "./api.constants.ts";


let isRefreshing = false;
let refreshQueue: RefreshItem[] = [];

const instance = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    withCredentials: true,
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: 'X-CSRFToken',
})

instance.interceptors.request.use((config: InternalAxiosRequestConfig)=> {
    const accessToken = localStorage.getItem("accessToken");
    if(accessToken !== null){
        config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config;
    }
)


instance.interceptors.response.use(function onFullFilled(response){
    return response;
}, async function onRejected(error){
    const original_request =  error?.config;
    const url = original_request.url;
    if(error.response?.status === 401 && !original_request._retry && !url.includes('/token/refresh')){
        original_request._retry = true
        if(isRefreshing){
            return new Promise((resolve, reject) => {
                refreshQueue.push({
                        resolve: (token: string) => {
                            original_request.headers.Authorization = `Bearer ${token}`;
                            resolve(instance(original_request))
                        },
                        reject: (error) => {
                            reject(error);
                        }
                    }
                )
                }
            )
        }else{
            try{
                isRefreshing = true;
                const newAccessToken = await obtainNewAccessCode();
                refreshQueue.forEach((item) => {
                    item.resolve(newAccessToken)
                })
                refreshQueue = []
                isRefreshing = false;
                original_request.headers.Authorization = `Bearer ${newAccessToken}`;
                return instance(original_request);
            }catch(e){
                if(isAxiosError(e))
                refreshQueue.forEach((item) => {
                    item.reject(e);
                })
                isRefreshing = false;
                clearAuth()
                return Promise.reject(e);
            }
        }
    }else if(error.response?.status === 401 && original_request._retry && url.includes('/token/refresh')){
        clearAuth()
    }
    return Promise.reject(error)
})

export default instance;