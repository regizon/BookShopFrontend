import type {OrderCardType} from "../../models/order.ts";
import OrderItemsPreview from "../OrderItemsPreview/OrderItemsPreview.tsx";
import styles from "./OrderDetails.module.css"
import type {JSX} from "react";

interface OrderDetailsProps {
    order: OrderCardType;
}

const deliveryVariations: Record<string, JSX.Element> = {
    "courier": <span>Кур'єр</span>,
    "self": <span>Самовивіз</span>,
}

const paymentStatusVariants: Record<string, JSX.Element> = {
    "paid": <span className={styles.valuePaid}>Сплачено</span>,
    "unpaid": <span className={styles.valueUnpaid}>Не сплачено</span>,
    "refunded": <span className={styles.valueRefunded}>Гроші повернуто</span>
}

function OrderDetails({ order }: OrderDetailsProps) {
    console.log(order)
    return (
        <td colSpan={5} className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.left}>
                    <OrderItemsPreview items={order.items} />
                </div>
                <div className={styles.divider} />
                <div className={styles.right}>
                    <div className={styles.section}>
                        <span className={styles.sectionTitle}>Доставка</span>
                        <div className={styles.row}>
                            <span className={styles.label}>Спосіб</span>
                            <span className={styles.value}>{deliveryVariations[order.delivery_type]}</span>
                        </div>
                    </div>
                    <div className={styles.section}>
                        <span className={styles.sectionTitle}>Оплата</span>
                        <div className={styles.row}>
                            <span className={styles.label}>Метод</span>
                            <span className={styles.value}>Карткою</span>
                        </div>
                        <div className={styles.row}>
                            <span className={styles.label}>Статус</span>
                            <span className={styles.valuePaid}>{paymentStatusVariants[order.payment_status]}</span>
                        </div>
                    </div>
                    <div className={styles.totalBlock}>
                        <span className={styles.totalLabel}>Разом</span>
                        <span className={styles.totalAmount}>{order.total_price} грн.</span>
                    </div>
                </div>
            </div>
        </td>
    );
}

export default OrderDetails;