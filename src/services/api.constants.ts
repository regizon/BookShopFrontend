export const API_CONFIG = {
    BASE_URL: 'http://localhost:8000/', // Или из env
    TIMEOUT: 15000,
};

export const ENDPOINTS = {
    AUTH: {
        LOGIN: '/user/auth/login/',
        REGISTER: '/user/auth/register/',
        REFRESH: '/user/auth/token/refresh/',
        LOGOUT: '/user/auth/logout/',
        CHECK: '/user/auth/check/',
        VERIFY: '/user/auth/verify/',
        ME: '/user/auth/me/',
    },
    BOOKS: {
        LIST: '/books/',
        DETAIL: (id: string | undefined) => `/books/${id}/`,
        GENRES: '/books/genres/',
        CATEGORY_LIST: (slug: string | undefined) => `/books/category/${slug}/`,
        CATEGORY_FILTERS: (slug: string | undefined) => `/books/category/${slug}/filters/`,
        PARSE: '/books/parse/'
    },
    COLLECTIONS: {
        LIST: '/books/collections/',
        DETAIL: (id: number) => `/books/collections/${id}/`,
        BY_SLUG: (slug: string | undefined) => `/books/collections/${slug}/`,
        FILTERS: (slug: string | undefined) => `/books/collections/${slug}/filters/`,
    },
    CART: {
        VIEW: '/cart/view/',
        ADD: '/cart/add/',
        DELETE: (cartItemId: number) => `/cart/delete/${cartItemId}`,
        REMOVE: '/cart/delete/'
    },
    ORDERS: {
        CREATE: '/order/create/',
        LIST: '/order/list/',
        PREVIEW: '/order/recent/'
    },
    USER: {
        PROFILE: '/user/profile/'
    },
    ADMIN_ORDERS: {
        LIST: '/order/list/',
        UPDATE: (id: number) => `/order/update/${id}/`,
    }
};