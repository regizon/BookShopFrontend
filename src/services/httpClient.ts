import axios from 'axios';
import {obtainNewAccessCode, clearAuth} from "./auth.service.ts";
import type {RefreshItem} from "../models/auth.ts";
import {API_CONFIG} from "./api.constants.ts";


let isRefreshing = false;
let refreshQueue: RefreshItem[] = [];

const instance = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    withCredentials: true,    // sends cookies on every request
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: 'X-CSRFToken',
})


instance.interceptors.response.use(
    function onFulfilled(response) {
        return response;
    },
    async function onRejected(error) {
        const original_request = error?.config;
        const url: string = original_request.url ?? '';

        if (
            error.response?.status === 401 &&
            !original_request._retry &&
            !url.includes('/auth/token/refresh') &&
            !url.includes('/user/auth/check/')
        ) {
            original_request._retry = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    refreshQueue.push({
                        resolve: () => resolve(instance(original_request)),
                        reject: (err) => reject(err),
                    });
                });
            }

            try {
                isRefreshing = true;
                await obtainNewAccessCode();
                refreshQueue.forEach((item) => item.resolve());
                refreshQueue = [];
                isRefreshing = false;
                return instance(original_request);
            } catch (e) {
                refreshQueue.forEach((item) => item.reject(e as never));
                refreshQueue = [];
                isRefreshing = false;
                clearAuth();
                // Signal AuthProvider to clear React state without a page reload.
                // A full window.location.replace('/') here caused an infinite loop:
                // reload → AuthProvider remounts → getMe() → 401 → reload → ∞
                window.dispatchEvent(new CustomEvent('auth:session-expired'));
                return Promise.reject(e);
            }
        }

        // Retried request also got 401 — refresh token is gone; bail out.
        if (error.response?.status === 401 && original_request._retry) {
            clearAuth();
            window.dispatchEvent(new CustomEvent('auth:session-expired'));
        }

        return Promise.reject(error);
    }
)

export default instance;
