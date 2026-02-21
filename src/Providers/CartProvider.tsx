import { useState, useEffect } from 'react';
import {CartContext} from "../Contexts/CartContext.ts";
import type {ReactNode} from 'react';
import {
    addItemToCart,
    deleteFromCart,
    getCart,
    removeItemFromCart
} from "../services/cart.service.ts";
import type {CartItemModel} from "../models/cart.ts";


interface CartProviderProps {
  children: ReactNode;
}


const CartProvider = ({ children }: CartProviderProps) => {
    const [items, setItems] = useState<CartItemModel[]>([]);
    const [isLoading, setIsLoading] = useState(false);


    async function fetchCart(){
        try{

            setIsLoading(true);
            const result = await getCart();
            setItems(result.items)
            setIsLoading(false)
        }
        catch(error){
            console.error(error)
        }
        finally {
            setIsLoading(false)
        }
    }

    async function addItem(bookId: number) {
        setIsLoading(true);
        await addItemToCart(bookId)
        fetchCart()
        setIsLoading(false);
    }


    async function removeItem(bookId: number) {
        setIsLoading(true);
        await removeItemFromCart(bookId)
        fetchCart()
        setIsLoading(false);
    }

    async function deleteItemFromCart(cartItemId: number) {
        setIsLoading(true);
        await deleteFromCart(cartItemId)
        fetchCart()
        setIsLoading(false);
    }


    useEffect(() => {
        fetchCart()
    }, [])

    return (
        <CartContext.Provider value={{ items, fetchCart, addItem, removeItem, isLoading, deleteItemFromCart  }}>
            {children}
        </CartContext.Provider>
    )
}

export default CartProvider;