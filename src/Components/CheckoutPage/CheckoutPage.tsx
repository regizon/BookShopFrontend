import styles from "./CheckoutPage.module.css"
import {useCart} from "../../Contexts/CartContext.ts";
import {type SetStateAction, useEffect, useState} from "react";
import CartItem from "../Cartitem/CartItem.tsx";
import {Navigate, useNavigate} from "react-router";
import {createOrder} from "../../services/order.service.ts";
import type orderDetails from "../../models/order.ts";
import {AxiosError, AxiosHeaders} from "axios";

function CheckoutPage() {
    type AvailableDelivery = 'self' | 'courier'
    type AvailablePaymentMethods = 'online' | 'offline'
    const [name, setName] = useState<string>("");
    const [surname, setSurname] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [userError, setUserError] = useState<string | null>(null);
    const [deliveryMethod, setDeliveryMethod] = useState<AvailableDelivery>("self");
    const [paymentMethod, setPaymentMethod] = useState<AvailablePaymentMethods>("online");
    const navigate = useNavigate()

    function isEmailValid(email: string){
        return !(!email.includes("@") || !email.includes("."));
    }

    const handleEmailChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        setEmail(event.target.value);
    }

    const handleNameChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        setName(event.target.value);
    }

    const handleSurnameChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        setSurname(event.target.value);
    }

    const handlePhoneChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        setPhone(event.target.value);
    }

    function handleCourierDelivery () {
        setDeliveryMethod("courier");
    }

    function handleSelfDelivery () {
        setDeliveryMethod("self");
    }

    function handleOnlinePayment(){
        setPaymentMethod("online");
    }

    function handleOfflinePayment(){
        setPaymentMethod("offline");
    }


    const details = {
        "name" : name,
        "surname" : surname,
        // "email" : email,
        // "phone" : phone,
        "delivery_type": deliveryMethod,
        "payment_method": paymentMethod

    }

    async function newOrder(details: orderDetails) {
        try {
            if (!isEmailValid(email)) {
                setUserError("Щось не так з поштою...");
                return;
            }else {
                console.log(details)
                if(await createOrder(details)){
                    alert("Успешно создано");
                    navigate("/", {replace: true})
                }
            }
        }catch(error:any){
            let errorMessage = "Сталася невідома помилка";
            if(error.response && error.response.data){
                errorMessage = error.response.data
            }
            setUserError(errorMessage)
            alert(errorMessage)
        }
    }

    const {fetchCart, items} = useCart()

    useEffect(() =>{
        fetchCart()
    }, [])

    const totalPrice = items.reduce((sum, item) => {
        return sum + item.price * item.quantity
    }, 0);




    const Items = items.length > 0;

    if (Items) {
        return(
        <div className={styles.content}>
            <h2>Оформлення замовлення</h2>
            <div className={styles.wrapper}>
                <div className={styles.mainForm}>
                    <h3>Контактні дані</h3>
                    <div className={styles.inputBlock}>
                        <div className={styles.leftInputBlock}>
                            <label htmlFor={"username"}>Ім'я</label>
                            <input id={"username"} placeholder={"Ім'я"} onChange={handleNameChange}/>
                            <label htmlFor={"phoneNumber"}>Телефон</label>
                            <input id={"phoneNumber"} maxLength={10} placeholder={"Номер телефону"} onChange={handlePhoneChange} type={"tel"}/>
                        </div>
                        <div className={styles.rightInputBlock}>
                            <label htmlFor={"surname"}>Прізвище</label>
                            <input id={"surname"} placeholder={"Прізвище"} onChange={handleSurnameChange}/>
                            <label htmlFor={"email"}>Email</label>
                            <input id={"email"} placeholder={"Електронна пошта"} onChange={handleEmailChange} type={"email"}/>
                        </div>
                    </div>
                    <hr/>
                    <div className={styles.radioBlock}>
                        <div className={styles.leftRadioBlock}>
                            <h3>Доставка</h3>
                            <label className={styles.radioLabel}>
                                <input id={"self"} onChange={handleSelfDelivery} type={"radio"} name={"delivery"}/>
                                <span>Самовивіз з магазину</span>
                            </label>
                            <label className={styles.radioLabel}>
                                <input id={"courier"} onChange={handleCourierDelivery} name={"delivery"}
                                       type={"radio"}/>
                                <span>Доставка кур'єром</span>
                            </label>
                        </div>
                        <div className={styles.rightRadioBlock}>
                            <h3>Спосіб оплати</h3>
                            <label className={styles.radioLabel}>
                                <input id={"online"} onChange={handleOnlinePayment} name={"paymentMethod"} type={"radio"}/>
                                <span>Картою онлайн</span>
                            </label>
                            <label className={styles.radioLabel}>
                                <input id={"offline"} onChange={handleOfflinePayment} name={"paymentMethod"} type={"radio"}/>
                                <span>При отриманні</span>
                            </label>
                        </div>
                    </div>
                    {deliveryMethod === "courier" && (
                        <div className={`${styles.inputBlock} ${styles.capitalLetters}`}>
                            <div className={styles.leftInputBlock}>
                                <label htmlFor={"city"}>Місто</label>
                                <input id={"city"} placeholder={"Місто"}/>
                                <label htmlFor={"house"}>Будинок</label>
                                <input id={"house"} placeholder={"Будинок"}
                                       onWheel={(e) => e.currentTarget.blur()} type={"number"}
                                />
                            </div>
                            <div className={styles.rightInputBlock}>
                                <label htmlFor={"street"}>Вулиця</label>
                                <input id={"street"} placeholder={"Вулиця"}/>
                                <label htmlFor={"appartment"} >Квартира</label>
                                <input id={"appartment"}  placeholder={"Квартира"}
                                    onWheel={(e) => e.currentTarget.blur()} type={"number"}
                                />
                            </div>
                        </div>
                    )}
                    <hr/>
                    <div className={styles.commentBlock}>
                        <h3>Коментар до замовлення <span className={styles.commentInfo}>(не обов'язково)</span></h3>
                        <textarea></textarea>
                    </div>

                </div>
                <div className={styles.orderReview}>
                    <h3>Ваше замовлення</h3>
                    <hr/>
                    {items.map(item => (
                        <CartItem key={item.book.id} item={item}/>
                    ))}
                    <div className={styles.finalPrice}>
                        <h2>Всього до сплати</h2>
                        <span>{totalPrice} ₴</span>
                    </div>

                    <div className={styles.confirmOrder}>
                        <button onClick={
                            async () =>{
                                await newOrder(details)
                            }
                        }>ОФОРМИТИ ЗАМОВЛЕННЯ</button>
                    </div>
                </div>
            </div>
        </div>
    )
    }else {
        return(<Navigate to={"/"} replace/>)
    }
}

export default CheckoutPage;