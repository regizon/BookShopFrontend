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

export interface OrderPreviewType {
    id: number;
    items: BookOrderPreview[];
    status: string;
    total_price: number;
}

