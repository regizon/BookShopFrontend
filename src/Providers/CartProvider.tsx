import { useState } from 'react';
import {CartContext} from "../Contexts/CartContext.ts";
import type {ReactNode} from 'react';


interface CartProviderProps {
  children: ReactNode;
}


const CartProvider = ({ children }: CartProviderProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const value = {
        state: {isOpen},
        actions: {setIsOpen},
    };

    return (
        <CartContext.Provider value={{value}}>
            {children}
        </CartContext>
    )
}

export default CartProvider;