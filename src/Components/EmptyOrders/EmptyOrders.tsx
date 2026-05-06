import styles from "./EmptyOrders.module.css";
import { useNavigate } from "react-router";

function EmptyOrders() {
    const navigate = useNavigate();

    return (
        <div className={styles.wrapper}>
            <div className={styles.iconWrap}>
                <svg className={styles.docIcon} viewBox="0 0 80 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="4" y="10" width="64" height="76" rx="10" fill="#FF8C00" fillOpacity="0.15"/>
                    <rect x="10" y="16" width="52" height="64" rx="8" fill="#FF8C00" fillOpacity="0.2"/>
                    <rect x="22" y="38" width="36" height="6" rx="3" fill="#FF8C00" fillOpacity="0.7"/>
                    <rect x="22" y="52" width="26" height="6" rx="3" fill="#FF8C00" fillOpacity="0.5"/>
                    <rect x="22" y="66" width="30" height="6" rx="3" fill="#FF8C00" fillOpacity="0.4"/>
                </svg>
                <div className={styles.badge}>!</div>
            </div>

            <h2 className={styles.title}>У вас ще немає замовлень</h2>
            <p className={styles.subtitle}>Саме час обрати щось цікавеньке!</p>

            <button className={styles.button} onClick={() => navigate("/")}>
                На головну
            </button>
        </div>
    );
}

export default EmptyOrders;