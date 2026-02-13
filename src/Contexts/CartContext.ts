import {createContext, useContext} from "react";
import type {CartItemModel} from "../models/cart.ts";

interface CartContextType {
    items: CartItemModel[];
    isLoading: boolean;

    fetchCart: () => Promise<void>;

    addItem: (bookId: number) => Promise<void>;
    removeItem: (bookId: number) => Promise<void>;
    deleteItemFromCart: (cartItemId: number) => Promise<void>;

}

export const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
    const context = useContext(CartContext);
    if(!context){
        throw new Error('useCart() must be used within a CartProvider');
    }
    return context;
};