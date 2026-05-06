import type {BookOrderPreview} from "./book.ts";

export interface orderDetails {
    name: string;
    surname: string;
    // email: string;
    // phone: string;
    delivery_type: string;
    payment_method: string;
    status: string;
}

export interface OrderCardType extends orderDetails {
    id: number;
    items: BookOrderPreview[];
    order_date: string;
    delivery_status: string;
    payment_status: string;
    quantity: number;
    price: number;
    total_price: number;
}

