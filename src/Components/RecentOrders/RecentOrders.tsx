import styles from "./RecentOrders.module.css"
import {useEffect, useState} from "react";
import type {OrderCardType} from "../../models/order.ts";
import {getOrdersPreview} from "../../services/order.service.ts";
import OrderCard from "../OrderCard/OrderCard.tsx";
import {useNavigate} from "react-router";
function RecentOrders(){
    const [lastOrders, setLastOrders] = useState<OrderCardType[]>([]);
    const navigate = useNavigate();
    useEffect(() => {
        async function fetchOrders() {
            setLastOrders(await getOrdersPreview())
        }
        fetchOrders()
    }, [])



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
                {lastOrders.length > 0 ?
                    <tbody>
                    {lastOrders.map(order => (
                        <OrderCard item={order} expandable={false} open={false} key={order.id} onClick={() => navigate("/orders/", { state: {id: order.id}, replace: true})}/>
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
            <button>Переглянути всі замовлення</button>
        </div>
    )
}

export default RecentOrders;