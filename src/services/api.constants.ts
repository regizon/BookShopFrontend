export const API_CONFIG = {
    BASE_URL: 'http://localhost:8000/', // Или из env
    TIMEOUT: 1000,
};

export const ENDPOINTS = {
    AUTH: {
        LOGIN: '/user/auth/login/',
        REGISTER: '/user/auth/register/',
        REFRESH: '/token/refresh/',
        CHECK: '/user/auth/check/',
        VERIFY: '/user/auth/verify/',
    },
    BOOKS: {
        LIST: '/books/',
        DETAIL: (id: string | undefined) => `/books/${id}`,
        GENRES: '/books/genres',
        CATEGORY_LIST: (slug: string | undefined) => `/books/category/${slug}`,
        PARSE: '/books/parse/'
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