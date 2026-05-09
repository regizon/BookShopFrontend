import styles from "./RecentOrders.module.css"
import {useEffect, useState} from "react";
import type {OrderCardType} from "../../models/order.ts";
import {getOrdersPreview} from "../../services/order.service.ts";
import OrderCard from "../OrderCard/OrderCard.tsx";
import {useNavigate} from "react-router";
function RecentOrders(){
    const [lastOrders, setLastOrders] = useState<OrderCardType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        async function fetchOrders() {
            setIsLoading(true);
            setLastOrders(await getOrdersPreview())
            setIsLoading(false);
        }
        fetchOrders()
    }, [])


    if(isLoading){
        return(
            <div>
                Loading...
            </div>
        )
    }else if (!isLoading && lastOrders.length < 1) {
    return (
        <div className={styles.emptyState}>
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="10" y="14" width="44" height="38" rx="5" fill="#FAEEDA" stroke="#EF9F27" strokeWidth="1.5"/>
                <rect x="18" y="24" width="28" height="3" rx="1.5" fill="#EF9F27" opacity="0.5"/>
                <rect x="18" y="32" width="20" height="3" rx="1.5" fill="#EF9F27" opacity="0.35"/>
                <rect x="18" y="40" width="14" height="3" rx="1.5" fill="#EF9F27" opacity="0.2"/>
                <circle cx="48" cy="16" r="10" fill="#FAEEDA" stroke="#EF9F27" strokeWidth="1.5"/>
                <line x1="48" y1="11" x2="48" y2="17" stroke="#EF9F27" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="48" cy="20" r="1.2" fill="#EF9F27"/>
            </svg>
            <div>
                <p className={styles.emptyTitle}>У вас ще немає замовлень</p>
                <p className={styles.emptySubtitle}>Саме час обрати щось цікавеньке!</p>
            </div>
            <button onClick={() => navigate("/")}>На головну</button>
        </div>
    )
    }else{
        return(
        <div className={styles.content}>
            <table>
                <caption className={styles.head}>Останні замовлення</caption>
                <thead>
                <tr>
                    <th>№ Замовлення</th>
                    <th>Дата</th>
                    <th>Товари</th>
                    <th>Сума</th>
                    <th>Статус</th>
                </tr>
                </thead>
                <tbody>
                    {lastOrders.map(order => (
                        <OrderCard item={order} expandable={false} open={false} key={order.id} onClick={() => navigate("/orders/", { state: {id: order.id}, replace: true})}/>
                    ))}
                </tbody>
            </table>
            <button onClick={() => {navigate("/orders/")}}>Переглянути всі замовлення</button>
        </div>
    )
    }
}

export default RecentOrders;