import styles from "./OrderCard.module.css"
import type {OrderCardType} from "../../models/order.ts";
import {type JSX, useState} from "react";
import OrderDetails from "../OrderDetails/OrderDetails.tsx";

interface OrderCardProps {
    item: OrderCardType;
    onClick?: () => void;
    expandable: boolean;
    open: boolean;
}

const statusVariations: Record<string, JSX.Element> = {
    "pending": <span className={styles.status}><div className={`${styles.circle} ${styles.pending}`}></div>Доставляється</span>,
    "paid": <span className={styles.status}><div className={`${styles.circle} ${styles.paid}`}></div>Сплачено</span>,
    "shipped": <span className={styles.status}><div className={`${styles.circle} ${styles.success}`}></div>Доставлено</span>,
    "cancelled": <span className={styles.status}><div className={`${styles.circle} ${styles.cancelled}`}></div>Скасовано</span>
}


export default function OrderCard(order: OrderCardProps): JSX.Element {
    const books = order.item.items
    const django_date = order.item.order_date
    const [isOpen, setIsOpen] = useState(order.open);
    const date = new Date(django_date).toLocaleDateString('ua-UA', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    function handleClick(){
        if(order.expandable){
            setIsOpen(!isOpen);
        }else{
            if(order.onClick)
            order.onClick()
        }
    }

    return (
        <>
            <tr className={styles.clickable} onClick={handleClick}>
                <td>{order.item.id}</td>
                <td>{date}</td>
                <td className={styles.imageWrapper}>
                    {books.length > 0 && (
                        books.length > 1 ?
                            <div className={styles.coverWrapper}>
                                <img src={books[0].item.cover}/>
                                <span className={styles.quantity}>+ {books.length - 1}</span>
                            </div>
                            :
                            <img src={books[0].item.cover}/>
                    )}
                </td>
                <td>{order.item.total_price} грн.</td>
                <td>{statusVariations[order.item.delivery_status]}</td>
            </tr>
            {isOpen &&
                <tr>
                    <OrderDetails order={order.item} />
                </tr>
            }
        </>
    )
}