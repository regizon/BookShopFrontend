import {useCart} from "../../Contexts/CartContext.ts";
import styles from "./Cart.module.css"
import CartItem from "../Cartitem/CartItem.tsx";
import {useModal} from "../../Contexts/ModalContext.ts";
import {Link} from "react-router";

function Cart(){
    const {items} = useCart()
    const {closeModal} = useModal()

    return (
        <div className={styles.cartModal}>
            <div className={styles.modalHeader}>
                <h3>Кошик товарів</h3>
                <img className={styles.closeIcon} src={"../src/assets/close.png"} alt="close" onClick={closeModal}/>
            </div>
            {items.map(item => (
                <CartItem key={item.book.id} item={item} />
            ))}
            <div className={styles.modalFooter}>
                <div className={styles.leftBlock}>
                    <button onClick={closeModal}>Продовжити покупки</button>
                </div>
                <div className={styles.rightBlock}>
                    <div className={styles.rightBlockHeader}>
                        <span>До сплати</span>
                        <span className={styles.cartPrice}>555 ₴</span>
                    </div>
                    <button>
                        <Link to={"checkout/"} onClick={closeModal}>Оформити замовлення</Link>
                    </button>
                </div>
            </div>
        </div>
    )
}


export default Cart;