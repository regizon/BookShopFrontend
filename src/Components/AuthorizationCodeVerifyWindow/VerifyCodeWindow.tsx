import {useState, type SetStateAction} from "react";
import CommonStyles from "../AuthorizationWindow/AuthorizationWindow.module.css"
import handleEnter from "../../services/handleEnter.ts";

interface VerifyFormProps {
    verifyCode: (email: string, code:string, native_name: string | null) => Promise<void>;
    error: string | null;
    email: string;
    native_name: string | null;
    switchToRegistration: () => void;
}

function CodeVerificationForm( {verifyCode, error, email, native_name, switchToRegistration} : VerifyFormProps) {


    const [userCode, setUserCode] = useState<string>("");

    const handleCodeChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        setUserCode(event.target.value);
    }

    return (
        <div className={CommonStyles.authContent}>
            <span>Введіть код, що прийшов на ваш Email:</span>
            <input type={"number"} placeholder={"Код з пошти"} onChange={handleCodeChange} onKeyDown={(e) => {handleEnter(e, () => {verifyCode(email, userCode, native_name)})}}/>
            <span className={CommonStyles.error}>{error}</span>
            <button onClick={() => {
                verifyCode(email, userCode, native_name)
            }}>УВІЙТИ
            </button>
            <span>Немає акаунту? <span onClick={switchToRegistration} className={CommonStyles.registrationLink}>Зареєструйтесь</span></span>
        </div>
    )
}

export default CodeVerificationForm