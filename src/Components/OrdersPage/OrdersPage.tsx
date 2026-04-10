import {useEffect, useState} from "react";
import type {OrderCardType} from "../../models/order.ts";
import {ordersList} from "../../services/order.service.ts";
import styles from "./OrdersPage.module.css";
import OrderCard from "../OrderCard/OrderCard.tsx";
import {useLocation} from "react-router";

function OrdersPage() {

    const [lastOrders, setLastOrders] = useState<OrderCardType[]>([]);
    const location = useLocation();
    useEffect(() => {
        async function fetchOrders() {
            setLastOrders(await ordersList())
        }
        fetchOrders()
    }, [])
    const clickedId = location.state.id
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
                {lastOrders.length > 0 ?
                    <tbody>
                    {lastOrders.map(order => (
                        <OrderCard item={order} expandable={true} key={order.id} open={clickedId === order.id}/>
                    ))}
                    </tbody>
                    :
                    <tbody>
                    <tr>
                        <td>Loading...</td>
                    </tr>
                    </tbody>
                }
            </table>
        </div>
    )
}

export default OrdersPage;