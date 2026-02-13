import React from "react";
import styles from "./ModalWrapper.module.css";
import {useModal} from "../../Contexts/ModalContext.ts";

interface ModalWrapperProps {
    children: React.ReactNode;
}


function ModalWrapper({children} : ModalWrapperProps) {

    const {closeModal} = useModal();

    const preventClosing = (event: { stopPropagation: () => void; }) => {
        event.stopPropagation()
    }

    return(
        <div className={styles.modalOverlay} onClick={closeModal}>
            <div className={styles.modalWindow} onClick={preventClosing}>
                {children}
            </div>
        </div>
    )
}

export default ModalWrapper;