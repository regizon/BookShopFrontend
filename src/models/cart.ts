import type {Book} from "./book.ts";

export interface CartItemModel {
    cartId: number;
    id: number;
    book: Book;
    quantity: number;
    price: number;
}