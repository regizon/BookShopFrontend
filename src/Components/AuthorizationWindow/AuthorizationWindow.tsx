import styles from "./AuthorizationWindow.module.css"
import {useState} from "react";
import {sendRegisterCode, sendLoginCode, verifyCode} from "../../services/auth.service.ts";
import {useAuth} from "../../Contexts/AuthContext.ts";
import LoginForm from "../Login/LoginForm.tsx";
import type {AuthStatus} from "../../models/auth.ts";
import VerifyCodeWindow from "../AuthorizationCodeVerifyWindow/VerifyCodeWindow.tsx";
import {useModal} from "../../Contexts/ModalContext.ts";
import RegistrationForm from "../RegistrationForm/RegistrationForm.tsx";
import {useNavigate} from "react-router";
import isEmailValid from "../../services/emailChecker.ts"

interface AuthorizatonWindowsProps {
    initialStep: AuthStatus
}

function AuthorizationWindow({initialStep}: AuthorizatonWindowsProps){
    const {login, pendingRoot} = useAuth();
    const navigate = useNavigate();

    const [userName, setUserName] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string>("");
    const [userError, setUserError] = useState<string | null>(null);
    const [status, setStatus] = useState<AuthStatus | null>(null);
    const {closeModal} = useModal();

    function startRegistration(){
        setStatus("registration")
    }

    async function requestLoginCode(email: string) {
        setUserError("")
        try{
            if (!isEmailValid(email)){
                setUserError("Щось не так з поштою...")
                return
            }else{
                await sendLoginCode(email)
                setStatus("verification")
                setUserEmail(email)
            }

        }catch(error){
            if (error instanceof Error)
            setUserError(error.message)
        }
    }


    async function requestRegisterCode(email: string, native_name: string) {
        setUserError("")
        try{
            if(!isEmailValid(email)){
                setUserError("Щось не так з поштою...")
                return
            }else{
                await sendRegisterCode(email, native_name)
                setStatus("verification")
                setUserEmail(email)
                setUserName(native_name)
            }
        }catch(error){
            if (error instanceof Error)
            setUserError(error.message)
        }
    }


    async function checkCode(email: string, code: string, native_name : string | null){
        setUserError("")
        try {
           const data = await verifyCode(email, code, native_name);
           const {refresh, access} = data.tokens;
           login(access, refresh)
            closeModal()
            if(pendingRoot !== null){
                navigate(pendingRoot)
        }
        } catch (error) {
            if (error instanceof Error)
            setUserError(error.message)
        }
    }


    let content;


    if (initialStep === "login"){
        content = <LoginForm error={userError} sendCode={requestLoginCode} switchToRegistration={startRegistration}/>
    }

    if (status === "verification"){
        content = <VerifyCodeWindow error={userError} verifyCode={checkCode} email={userEmail} native_name={userName}/>
    } else if (status === "registration"){
        content = <RegistrationForm error={userError} sendCode={requestRegisterCode} switchToLogin={startRegistration} />
    }


    return (
        <div className={styles.authModal}>
            {content}
        </div>
    )
}


export default AuthorizationWindow;