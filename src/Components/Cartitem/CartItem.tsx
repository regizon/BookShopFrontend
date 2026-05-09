import type {CartItemModel} from "../../models/cart.ts";
import styles from "./CartItem.module.css";
import heart from '/src/assets/heart.png'
import delete_icon from '/src/assets/delete.png'
import check from '/src/assets/check.png'
import {useCart} from "../../Contexts/CartContext.ts";

interface CartItemProps {
    item: CartItemModel
}

function CartItem({item}: CartItemProps) {

    const {addItem, removeItem, deleteItemFromCart } = useCart()


    return(
        <div className={styles.item}>
            <div className={styles.cover}><img src={item.book.cover}/></div>
            <div className={styles.info}>
                <div className={styles.title}>{item.book.title}</div>
                <div className={styles.author}>{item.book.author_read}</div>
                <div className={styles.bottomRow}>
                    <div className={styles.status}>
                        <img src={check}/>
                        <span>В наявності</span>
                    </div>
                    <div className={styles.quantity}>
                        <button disabled={item.quantity == 1} className={styles.minus} onClick={async () => {
                            await removeItem(item.book.id)
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                 className="lucide lucide-minus-icon lucide-minus">
                                <path d="M5 12h14"/>
                            </svg>
                        </button>
                        <input type="text" readOnly value={item.quantity}/>
                        <button disabled={item.quantity === item.book.quantity} className={styles.plus} onClick={async () => {
                            await addItem(item.book.id)
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                 fill="none"
                                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                 className="lucide lucide-plus-icon lucide-plus">
                                <path d="M5 12h14"/>
                                <path d="M12 5v14"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div className={styles.actions}>
                <div className={styles.icons}>
                    <img src={heart}/>
                    <button className={styles.deleteButton} onClick={async () => {
                        await deleteItemFromCart(item.id);
                    }}>
                        <img src={delete_icon} alt="delete"/>
                    </button>
                </div>
                <div className={styles.price}>
                    {item.book.discount_price != null ? (
                        <>
                            <span className={styles.priceOriginal}>{item.book.price} ₴</span>
                            <span>{item.price} ₴</span>
                        </>
                    ) : (
                        <span>{item.price} ₴</span>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CartItem