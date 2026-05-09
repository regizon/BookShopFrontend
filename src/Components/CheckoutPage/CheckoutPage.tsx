import styles from "./CheckoutPage.module.css"
import {useCart} from "../../Contexts/CartContext.ts";
import {useEffect, useState} from "react";
import {isAxiosError} from "axios";
import CartItem from "../Cartitem/CartItem.tsx";
import {Navigate, useNavigate} from "react-router";
import {createOrder} from "../../services/order.service.ts";
import type orderDetails from "../../models/order.ts";

function CheckoutPage() {
    type AvailableDelivery = 'self' | 'courier'
    type AvailablePaymentMethods = 'online' | 'offline'

    const [name, setName] = useState<string>("");
    const [surname, setSurname] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [city, setCity] = useState<string>("");
    const [street, setStreet] = useState<string>("");
    const [house, setHouse] = useState<string>("");
    const [apartment, setApartment] = useState<string>("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [deliveryMethod, setDeliveryMethod] = useState<AvailableDelivery | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<AvailablePaymentMethods | null>(null);
    const navigate = useNavigate();

    function isEmailValid(email: string) {
        return email.includes("@") && email.includes(".");
    }

    function clearError(field: string) {
        if (errors[field]) {
            setErrors(prev => {
                const next = {...prev};
                delete next[field];
                return next;
            });
        }
    }

    function validateForm(): boolean {
        const newErrors: Record<string, string> = {};
        const required = "Це поле є обов'язковим";

        if (!name.trim()) newErrors.name = required;
        if (!surname.trim()) newErrors.surname = required;
        if (!email.trim()) {
            newErrors.email = required;
        } else if (!isEmailValid(email)) {
            newErrors.email = "Некоректна електронна адреса";
        }
        if (!phone.trim()) newErrors.phone = required;
        if (!deliveryMethod) newErrors.deliveryMethod = "Оберіть спосіб доставки";
        if (!paymentMethod) newErrors.paymentMethod = "Оберіть спосіб оплати";

        if (deliveryMethod === 'courier') {
            if (!city.trim()) newErrors.city = required;
            if (!street.trim()) newErrors.street = required;
            if (!house.trim()) newErrors.house = required;
            if (!apartment.trim()) newErrors.apartment = required;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    function handleCourierDelivery() {
        setDeliveryMethod("courier");
        clearError('deliveryMethod');
    }

    function handleSelfDelivery() {
        setDeliveryMethod("self");
        setErrors(prev => {
            const next = {...prev};
            delete next.city;
            delete next.street;
            delete next.house;
            delete next.apartment;
            delete next.deliveryMethod;
            return next;
        });
    }

    function handleOnlinePayment() {
        setPaymentMethod("online");
        clearError('paymentMethod');
    }

    function handleOfflinePayment() {
        setPaymentMethod("offline");
        clearError('paymentMethod');
    }

    const details: orderDetails = {
        "name": name,
        "surname": surname,
        "delivery_type": deliveryMethod ?? 'self',
        "payment_method": paymentMethod ?? 'online',
        "status": "",
    }

    async function newOrder(details: orderDetails) {
        if (!validateForm()) return;
        try {
            console.log(details);
            if (await createOrder(details)) {
                await fetchCart();
                alert("Успешно создано");
                navigate("/", {replace: true});
            }
        } catch (error: unknown) {
            const errorMessage = isAxiosError(error) && error.response?.data
                ? String(error.response.data)
                : "Сталася невідома помилка";
            alert(errorMessage);
        }
    }

    const {fetchCart, items} = useCart();

    useEffect(() => {
        fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const totalPrice = items.reduce((sum, item) => {
        return sum + item.price * item.quantity;
    }, 0);

    const hasItems = items.length > 0;

    if (hasItems) {
        return (
            <div className={styles.content}>
                <h2>Оформлення замовлення</h2>
                <div className={styles.wrapper}>
                    <div className={styles.mainForm}>
                        <h3>Контактні дані</h3>
                        <div className={styles.inputBlock}>
                            <div className={styles.leftInputBlock}>
                                <div className={styles.fieldGroup}>
                                    <label htmlFor={"username"}>Ім'я</label>
                                    <input
                                        id={"username"}
                                        placeholder={"Ім'я"}
                                        onChange={(e) => { setName(e.target.value); clearError('name'); }}
                                    />
                                    {errors.name && <span className={styles.fieldError}>{errors.name}</span>}
                                </div>
                                <div className={styles.fieldGroup}>
                                    <label htmlFor={"phoneNumber"}>Телефон</label>
                                    <input
                                        id={"phoneNumber"}
                                        maxLength={10}
                                        placeholder={"Номер телефону"}
                                        onChange={(e) => { setPhone(e.target.value); clearError('phone'); }}
                                        type={"tel"}
                                    />
                                    {errors.phone && <span className={styles.fieldError}>{errors.phone}</span>}
                                </div>
                            </div>
                            <div className={styles.rightInputBlock}>
                                <div className={styles.fieldGroup}>
                                    <label htmlFor={"surname"}>Прізвище</label>
                                    <input
                                        id={"surname"}
                                        placeholder={"Прізвище"}
                                        onChange={(e) => { setSurname(e.target.value); clearError('surname'); }}
                                    />
                                    {errors.surname && <span className={styles.fieldError}>{errors.surname}</span>}
                                </div>
                                <div className={styles.fieldGroup}>
                                    <label htmlFor={"email"}>Email</label>
                                    <input
                                        id={"email"}
                                        placeholder={"Електронна пошта"}
                                        onChange={(e) => { setEmail(e.target.value); clearError('email'); }}
                                        type={"email"}
                                    />
                                    {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
                                </div>
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
                                    <input id={"courier"} onChange={handleCourierDelivery} name={"delivery"} type={"radio"}/>
                                    <span>Доставка кур'єром</span>
                                </label>
                                {errors.deliveryMethod && <span className={styles.fieldError}>{errors.deliveryMethod}</span>}
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
                                {errors.paymentMethod && <span className={styles.fieldError}>{errors.paymentMethod}</span>}
                            </div>
                        </div>
                        {deliveryMethod === "courier" && (
                            <div className={`${styles.inputBlock} ${styles.capitalLetters}`}>
                                <div className={styles.leftInputBlock}>
                                    <div className={styles.fieldGroup}>
                                        <label htmlFor={"city"}>Місто</label>
                                        <input
                                            id={"city"}
                                            placeholder={"Місто"}
                                            onChange={(e) => { setCity(e.target.value); clearError('city'); }}
                                        />
                                        {errors.city && <span className={styles.fieldError}>{errors.city}</span>}
                                    </div>
                                    <div className={styles.fieldGroup}>
                                        <label htmlFor={"house"}>Будинок</label>
                                        <input
                                            id={"house"}
                                            placeholder={"Будинок"}
                                            value={house}
                                            onChange={(e) => { setHouse(e.target.value); clearError('house'); }}
                                            onWheel={(e) => e.currentTarget.blur()}
                                            type={"number"}
                                        />
                                        {errors.house && <span className={styles.fieldError}>{errors.house}</span>}
                                    </div>
                                </div>
                                <div className={styles.rightInputBlock}>
                                    <div className={styles.fieldGroup}>
                                        <label htmlFor={"street"}>Вулиця</label>
                                        <input
                                            id={"street"}
                                            placeholder={"Вулиця"}
                                            onChange={(e) => { setStreet(e.target.value); clearError('street'); }}
                                        />
                                        {errors.street && <span className={styles.fieldError}>{errors.street}</span>}
                                    </div>
                                    <div className={styles.fieldGroup}>
                                        <label htmlFor={"appartment"}>Квартира</label>
                                        <input
                                            id={"appartment"}
                                            placeholder={"Квартира"}
                                            value={apartment}
                                            onChange={(e) => { setApartment(e.target.value); clearError('apartment'); }}
                                            onWheel={(e) => e.currentTarget.blur()}
                                            type={"number"}
                                        />
                                        {errors.apartment && <span className={styles.fieldError}>{errors.apartment}</span>}
                                    </div>
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
                        <div className={styles.itemsBlock}>
                            {items.map(item => (
                                <CartItem key={item.book.id} item={item}/>
                            ))}
                        </div>
                        <div className={styles.finalPrice}>
                            <h2>Всього до сплати</h2>
                            <span>{totalPrice} ₴</span>
                        </div>
                        <div className={styles.confirmOrder}>
                            <button onClick={async () => { await newOrder(details); }}>
                                ОФОРМИТИ ЗАМОВЛЕННЯ
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        return (<Navigate to={"/"} replace/>);
    }
}

export default CheckoutPage;
