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
    }else if(!isLoading && lastOrders.length < 1){
        return(
            <div>У вас ще немає замовлень, саме час це виправити!</div>
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
            <button>Переглянути всі замовлення</button>
        </div>
    )
    }
}

export default RecentOrders;