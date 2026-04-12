import {useEffect, useState} from "react";
import type {OrderCardType} from "../../models/order.ts";
import {ordersList} from "../../services/order.service.ts";
import styles from "./OrdersPage.module.css";
import OrderCard from "../OrderCard/OrderCard.tsx";
import {useLocation} from "react-router";

function OrdersPage() {

    const [lastOrders, setLastOrders] = useState<OrderCardType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();
    useEffect(() => {
        async function fetchOrders() {
            setIsLoading(true)
            setLastOrders(await ordersList())
            setIsLoading(false)
        }
        fetchOrders()
    }, [])

    const clickedId = location.state?.id

    if(isLoading){
        return(
            <div>Loading...</div>
        )
    }else if(lastOrders.length < 1 && !isLoading){
        return(
            <div>Ви ще нічого не замовляли :(</div>
        )
    }else {
        return(
        <div className={styles.content}>
            <span className={styles.caption}>Історія замовлень</span>
            <table>
                <thead>
                <tr className={styles.firstRow}>
                    <th>№ Замовлення</th>
                    <th>Дата</th>
                    <th>Товари</th>
                    <th>Сума</th>
                    <th>Статус</th>
                </tr>
                </thead>
                <tbody>
                    {lastOrders.map(order => (
                        <OrderCard item={order} expandable={true} key={order.id} open={clickedId !== undefined ? clickedId === order.id : false}/>
                    ))}
                </tbody>
            </table>
        </div>
    )
    }

}

export default OrdersPage;