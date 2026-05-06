import type {BookOrderPreview} from "../../models/book.ts";
import styles from "./OrderItemsPreview.module.css"

interface OrderItemProps {
    items: BookOrderPreview[]
}

function OrderItemsPreview({ items }: OrderItemProps) {
    return (
        <div className={styles.content}>
            <span className={styles.caption}>{`Список товарів (${items.length} шт.)`}</span>
            {items.map((entry, index) => (
                <div className={styles.itemContainer} key={index}>
                    <img src={entry.item.cover} alt={entry.item.title} />
                    <div className={styles.detailsDisplay}>
                        <span className={styles.title}>{entry.item.title}</span>
                        <span className={styles.meta}>Ціна: {entry.price} грн.</span>
                        <span className={styles.meta}>Кількість: {entry.quantity} шт.</span>
                        <span className={styles.meta}>Сума: {entry.price * entry.quantity} грн.</span>
                    </div>

                </div>
            ))}
        </div>
    )
}

export default OrderItemsPreview;