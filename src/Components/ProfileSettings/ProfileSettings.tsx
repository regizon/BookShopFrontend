import styles from "./ProfileSettings.module.css"
import {type SetStateAction, useEffect, useState} from "react";
import type {User} from "../../models/user.ts"
import {getuserProfile} from "../../services/user.service.ts";

function ProfileSettings() {
    const [user, setUser] = useState<User | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    useEffect(() => {
        async function fetchData(){
            setUser(await getuserProfile())
        }
        fetchData()
    }, [])

    return(
        <div className={styles.wrapper}>
            <div className={styles.settingsContainer}>
                <h3>Особисті дані</h3>
                <div className={styles.inputBlock}>
                    <div className={styles.leftInputBlock}>
                        <label htmlFor={"username"}>Ім'я</label>
                        <input disabled={!isEditing} id={"username"} value={user?.native_name} placeholder={"Ім'я"} onChange={(event) => {
                            if(!user) return
                            setUser({...user,
                                    native_name: event.target.value});
                        }}/>
                        <label htmlFor={"phoneNumber"}>Телефон</label>
                        <input disabled={!isEditing} id={"phoneNumber"} value={user?.phone_number} maxLength={10} placeholder={"Номер телефону"} onChange={(event) => {
                            if(!user) return
                            setUser({...user,
                                    phone_number: event.target.value});
                        }}
                               type={"tel"}/>
                    </div>
                    <div className={styles.rightInputBlock}>
                        <label htmlFor={"surname"}>Прізвище</label>
                        <input disabled={!isEditing} id={"surname"} value={user?.surname} placeholder={"Прізвище"} onChange={(event) => {
                            if(!user) return
                            setUser({...user,
                                    surname: event.target.value});
                        }}/>
                        <label htmlFor={"email"}>Email</label>
                        <input disabled={!isEditing} id={"email"} value={user?.email} placeholder={"Електронна пошта"} type={"email"} onChange={(event) => {
                            if(!user) return
                            setUser({...user,
                                    email: event.target.value});
                        }}/>
                    </div>
                </div>
                {isEditing ?
                    <button className={styles.editButton} onClick={() => {
                        setIsEditing(!isEditing)
                    }}>Редагувати дані</button>
                    :
                    <button className={styles.saveButton} onClick={() => {
                        setIsEditing(!isEditing)
                    }}>Зберегти дані</button>

                }
            </div>
            <div className={styles.lastOrdersContainer}>
                Last orders
            </div>
        </div>
    )
}

export default ProfileSettings;