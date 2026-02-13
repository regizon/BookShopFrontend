import { useState } from 'react';
import {ModalContext} from "../Contexts/ModalContext.ts"
import type {ReactNode} from 'react'
import type {modalVariations} from "../models/modal.ts";

interface ModalProviderProps {
    children: ReactNode
}

const ModalProvider = ({ children }: ModalProviderProps) => {
    const [currentModal, setCurrentModal] = useState<modalVariations>(null);

    function openModal(type: modalVariations) {
        setCurrentModal(type);
    }

    function closeModal() {
        setCurrentModal(null);
    }

    return (
        <ModalContext.Provider value={{
            currentModal,
            openModal,
            closeModal
        }}>
            {children}
        </ModalContext.Provider>
    )
}

export default ModalProvider;