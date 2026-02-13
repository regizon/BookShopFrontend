import styles from "./AddToCartButton.module.css"
import {useCart} from "../../Contexts/CartContext.ts";

interface AddToCartButtonProps {
    bookId: number;
}

function AddToCartButton({bookId}: AddToCartButtonProps) {

    const {addItem} = useCart()

    async function addToCart() {

        await addItem(bookId)

    }

    return (
        <button className={styles.button} onClick={addToCart}>
            У КОШИК
        </button>
    )
}

export default AddToCartButton;