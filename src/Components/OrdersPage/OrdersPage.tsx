import {useEffect, useState} from "react";
import type {OrderPreviewType} from "../../models/order.ts";
import {ordersList} from "../../services/order.service.ts";
import styles from "./OrdersPage.module.css";
import OrderCard from "../OrderCard/OrderCard.tsx";

function OrdersPage() {

    const [lastOrders, setLastOrders] = useState<OrderPreviewType[]>([]);

    useEffect(() => {
        async function fetchOrders() {
            setLastOrders(await ordersList())
        }
        fetchOrders()
    }, [])

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
                        <OrderCard item={order} expandable={true} key={order.id}/>
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