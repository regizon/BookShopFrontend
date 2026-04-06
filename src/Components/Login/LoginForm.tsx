import {useState, type SetStateAction} from "react";
import CommonStyles from "../AuthorizationWindow/AuthorizationWindow.module.css"
import styles from "../AuthorizationWindow/AuthorizationWindow.module.css";
import handleEnter from "../../services/handleEnter.ts";

interface LoginFormProps {
    sendCode: (email: string) => Promise<void>;
    error: string | null;
    switchToRegistration: () => void;
}

function LoginForm( {sendCode, error, switchToRegistration} : LoginFormProps) {

    const [userEmail, setUserEmail] = useState<string>("");

    const handleEmailChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        setUserEmail(event.target.value);
    }

    return (
        <div className={CommonStyles.authContent}>
            <div className={styles.modalHeader}>
                <h2>Вхід на сайт</h2>
            </div>
            <span>Введіть ваш Email:</span>
            <input type={"email"} placeholder={"Ваш Email"} onChange={handleEmailChange} onKeyDown={(e) => {handleEnter(e, () => {sendCode(userEmail)})}}/>
            <span className={CommonStyles.error}>{error}</span>
            <button onClick={() => {
                sendCode(userEmail)
            }}>УВІЙТИ
            </button>
            <span>Немає акаунту?
                <span onClick={switchToRegistration} className={CommonStyles.registrationLink}>Зареєструйтесь</span>
            </span>
        </div>
    )
}

export default LoginForm