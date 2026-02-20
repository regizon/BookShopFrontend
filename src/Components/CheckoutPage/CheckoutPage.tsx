import styles from "./CheckoutPage.module.css"


function CheckoutPage() {

    return(
        <div className={styles.content}>
            <h2>Оформлення замовлення</h2>
            <div className={styles.wrapper}>
                <div className={styles.mainForm}>
                    <h3>Контактні дані</h3>
                    <div className={styles.inputBlock}>
                        <div className={styles.leftInputBlock}>
                            <label htmlFor={"username"}>Ім'я</label>
                            <input id={"username"} placeholder={"Ім'я"}/>
                            <label htmlFor={"phoneNumber"}>Телефон</label>
                            <input id={"phoneNumber"} placeholder={"Номер телефону"}
                                   onWheel={(e) => e.currentTarget.blur()} type={"number"}/>
                        </div>
                        <div className={styles.rightInputBlock}>
                            <label htmlFor={"surname"}>Прізвище</label>
                            <input id={"surname"} placeholder={"Прізвище"}/>
                            <label htmlFor={"email"}>Email</label>
                            <input id={"email"} placeholder={"Електронна пошта"} type={"email"}/>
                        </div>
                    </div>
                    <hr/>
                    <div className={styles.radioBlock}>
                        <div className={styles.leftRadioBlock}>
                            <h3>Доставка</h3>
                            <label className={styles.radioLabel}>
                                <input id={"self"} type={"radio"} name={"delivery"}/>
                                <span>Самовивіз з магазину</span>
                            </label>
                            <label className={styles.radioLabel}>
                                <input id={"courier"} name={"delivery"} type={"radio"}/>
                                <span>Доставка кур'єром</span>
                            </label>
                        </div>
                        <div className={styles.rightRadioBlock}>
                            <h3>Спосіб оплати</h3>
                            <label className={styles.radioLabel}>
                                <input id={"online"} name={"paymentMethod"} type={"radio"}/>
                                <span>Картою онлайн</span>
                            </label>
                            <label className={styles.radioLabel}>
                                <input id={"offline"} name={"paymentMethod"} type={"radio"}/>
                                <span>При отриманні</span>
                            </label>
                        </div>
                    </div>
                    <hr />
                    <div className={styles.commentBlock}>
                        <h3>Коментар до замовлення <span className={styles.commentInfo}>(не обов'язково)</span></h3>
                        <textarea></textarea>
                    </div>

                </div>
                <div className={styles.orderReview}>
                    <h3>Ваше замовлення</h3>
                    <hr/>
                </div>
            </div>
        </div>
    )
}

export default CheckoutPage;