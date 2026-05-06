import { useState } from 'react';
import {ModalContext} from "../Contexts/ModalContext.ts"
import type {ReactNode} from 'react'
import type {ModalOptions, modalVariations} from "../models/modal.ts";

interface ModalProviderProps {
    children: ReactNode
}

const ModalProvider = ({ children }: ModalProviderProps) => {
    const [currentModal, setCurrentModal] = useState<modalVariations>(null);
    const [modalOptions, setModalOptions] = useState<ModalOptions>({})

    function openModal(type: modalVariations, options: ModalOptions = {}) {
        setCurrentModal(type);
        setModalOptions(options)
    }

    function closeModal() {
        setCurrentModal(null);
    }

    return (
        <ModalContext.Provider value={{
            currentModal,
            modalOptions,
            openModal,
            closeModal
        }}>
            {children}
        </ModalContext.Provider>
    )
}

export default ModalProvider;