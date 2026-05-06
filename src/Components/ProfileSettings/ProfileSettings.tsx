import styles from "./ProfileSettings.module.css"
import {useEffect, useState} from "react";
import type {User} from "../../models/user.ts"
import {getUserProfile, updateUserProfile} from "../../services/user.service.ts";
import isEmailValid from "../../services/emailChecker.ts"
import RecentOrders from "../RecentOrders/RecentOrders.tsx"

function ProfileSettings() {
    const [user, setUser] = useState<User | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    useEffect(() => {
        async function fetchData(){
            setUser(await getUserProfile())
        }
        fetchData()
    }, [])

    function validateUser(user: User | null){
        if(!user){
            return false
        }
        if(!isEmailValid(user.email)){
            alert("Please enter a valid email");
            return false
        }else if(user.native_name.length < 1){
            alert("Please enter a valid native name");
            return false
        }
        return true
    }

    return(
        <div className={styles.wrapper}>
            <div className={styles.settingsContainer}>
                <h3>Особисті дані</h3>
                <div className={styles.inputBlock}>
                    <div className={styles.leftInputBlock}>
                        <label htmlFor={"username"}>Ім'я</label>
                        <input disabled={!isEditing} id={"username"} value={user?.native_name || ""} placeholder={"Ім'я"} onChange={(event) => {
                            if(!user) return
                            const name = event.target.value
                            setUser({
                                ...user,
                                native_name: name
                            });
                            }
                        }/>
                        <label htmlFor={"phoneNumber"}>Телефон</label>
                        <input disabled={!isEditing} id={"phoneNumber"} value={user?.phone_number || ""} maxLength={10} placeholder={"Номер телефону"} onChange={(event) => {
                            if(!user) return
                            setUser({...user,
                                    phone_number: event.target.value});
                        }}
                               type={"tel"}/>
                    </div>
                    <div className={styles.rightInputBlock}>
                        <label htmlFor={"surname"}>Прізвище</label>
                        <input disabled={!isEditing} id={"surname"} value={user?.surname || ""} placeholder={"Прізвище"} onChange={(event) => {
                            if(!user) return
                            setUser({...user,
                                    surname: event.target.value});
                        }}/>
                        <label htmlFor={"email"}>Email</label>
                        <input disabled={!isEditing} id={"email"} value={user?.email || ""} placeholder={"Електронна пошта"} type={"email"} onChange={(event) => {
                            if(!user) return
                            const email = event.target.value
                            setUser({
                                ...user,
                                email: email
                            });
                        }}/>
                    </div>
                </div>
                {isEditing ?
                    <button className={styles.saveButton} onClick={() => {
                        if(validateUser(user)){
                           updateUserProfile(user)
                            setIsEditing(!isEditing)
                        }
                    }}>Зберегти дані</button>
                    :
                    <button className={styles.editButton} onClick={() => {
                        setIsEditing(!isEditing)
                    }}>Редагувати дані</button>
                }
            </div>
            <div className={styles.lastOrdersContainer}>
                <RecentOrders />
            </div>
        </div>
    )
}

export default ProfileSettings;