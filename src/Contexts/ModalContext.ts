import {createContext, useContext} from "react";
import type {ModalOptions, modalVariations} from "../models/modal.ts";



interface ModalContextType {

    currentModal: modalVariations;
    modalOptions: ModalOptions;
    openModal: (type: modalVariations, options?: ModalOptions) => void;
    closeModal: () => void;
}

export const ModalContext = createContext<ModalContextType | null>(null);

export const useModal = () => {
    const context = useContext(ModalContext);
    if(!context){
        throw new Error('useModal() must be used within a ModalProvider');
    }
    return context;
}

