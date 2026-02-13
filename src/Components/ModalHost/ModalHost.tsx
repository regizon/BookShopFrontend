import {useModal} from "../../Contexts/ModalContext.ts";
import ModalWrapper from "../ModalWrapper/ModalWrapper.tsx";
import Cart from "../Cart/Cart.tsx";
import AuthorizationWindow from "../AuthorizationWindow/AuthorizationWindow.tsx";


function ModalHost(){

    const {currentModal} = useModal()

    if(currentModal === null){
        return null;
    }
    else if(currentModal === "cart"){
        return (<ModalWrapper>
            <Cart/>
        </ModalWrapper>)
    } else if (currentModal === "login"){
        return (
            <ModalWrapper>
                <AuthorizationWindow initialStep={currentModal} />
            </ModalWrapper>

        )
    }
}

export default ModalHost;