export const API_CONFIG = {
    BASE_URL: 'http://localhost:8000/', // Или из env
    TIMEOUT: 1000,
};

export const ENDPOINTS = {
    AUTH: {
        LOGIN: '/user/auth/login/',
        REGISTER: '/user/auth/register/',
        REFRESH: '/token/refresh/',
        VERIFY: '/user/auth/verify/',
    },
    BOOKS: {
        LIST: '/books',
        DETAIL: (id: string | undefined) => `/books/${id}`,
    },
    CART: {
        VIEW: '/cart/view/',
        ADD: '/cart/add/',
        DELETE: (cartItemId: number) => `/cart/delete/${cartItemId}`,
        REMOVE: '/cart/delete/'
    },
};