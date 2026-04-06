import {useState, type SetStateAction, type JSX} from "react";
import CommonStyles from "../AuthorizationWindow/AuthorizationWindow.module.css"
import styles from "../AuthorizationWindow/AuthorizationWindow.module.css";
import handleEnter from "../../services/handleEnter.ts";

interface RegistrationFormProps {
    sendCode: (email: string, native_name: string) => Promise<void>;
    error: string | null;
    switchToLogin: () => void;
}

function RegistrationForm( { error, sendCode} : RegistrationFormProps): JSX.Element {

    const [userEmail, setUserEmail] = useState<string>("");
    const [userName, setUserName] = useState<string>("");

    const handleEmailChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        setUserEmail(event.target.value);
    }

    const handleNameChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        setUserName(event.target.value);
    }

    return (
        <div className={CommonStyles.authContent}>
            <div className={styles.modalHeader}>
                <h2>Реєстрація</h2>
            </div>
            <span>Введіть ваш Email:</span>
            <input type={"email"} placeholder={"Ваш Email"} onChange={handleEmailChange} onKeyDown={(e) => handleEnter(e, () => (sendCode(userEmail, userName)))}/>
            <span>Введіть ваше ім'я:</span>
            <input type={"text"} placeholder={"Ваше ім'я"} onChange={handleNameChange} onKeyDown={(e) => handleEnter(e, () => (sendCode(userEmail, userName)))}/>
            <span className={CommonStyles.error}>{error}</span>
            <button onClick={() => {sendCode(userEmail, userName)}}>Зареєструватися
            </button>
            <span>Вже є аккаунт?
                <span className={CommonStyles.registrationLink}>Увійдіть</span>
            </span>
        </div>
    )
}

export default RegistrationForm