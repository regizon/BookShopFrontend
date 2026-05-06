import instance from "./httpClient.ts";
import { ENDPOINTS } from "./api.constants.ts";

export interface AdminOrderItem {
    quantity: number;
    price: number;
    item: {
        id: number;
        title: string;
        price: number;
        cover: string;
    };
}

export interface AdminOrderType {
    id: number;
    name: string;
    surname: string;
    phone: string;
    email: string;
    order_date: string;
    delivery_status: string;
    payment_status: string;
    total_price: number;
    delivery_type: string;
    payment_method: string;
    city: string;
    street: string;
    house: string;
    apartment: string;
    comments: string;
    status: string;
    items: AdminOrderItem[];
}

export interface AdminOrderUpdate {
    name?: string;
    surname?: string;
    phone?: string;
    email?: string;
    delivery_status?: string;
    payment_status?: string;
    comments?: string;
    delivery_type?: string;
    payment_method?: string;
    city?: string;
    street?: string;
    house?: string;
    apartment?: string;
}

export function adminOrdersList(): Promise<AdminOrderType[]> {
    return instance({
        url: ENDPOINTS.ADMIN_ORDERS.LIST,
        method: 'GET',
    }).then((response) => response.data);
}

export function updateAdminOrder(id: number, data: AdminOrderUpdate): Promise<AdminOrderType> {
    return instance({
        url: ENDPOINTS.ADMIN_ORDERS.UPDATE(id),
        method: 'PATCH',
        data,
    }).then((response) => response.data);
}
