import styles from "./BookCard.module.css"
import AddToCartButton from "../AddToCartButton/AddToCartButton.tsx";
import type {Book} from "../../models/book.ts";
import { Link } from "react-router";


interface BookCardProps {
    book: Book;
}

function BookCard({ book }:BookCardProps) {

    const available = book.quantity > 0

    return (
            <div className={`${styles.cardContainer} ${!available ? styles.unavailable : ''}`}>
                <Link to={`/books/${book.id}`}>
                    <div className={styles.imageWrapper}>
                    <img src={book.cover}/>
                </div>
                </Link>
                <Link to= {`/books/${book.id}`} className={styles.bookTitle}>{book.title}</Link>
                <span className={styles.authorName}>{book.author_read}</span>
                <span className={styles.price}>{book.price} ₴</span>
                <AddToCartButton bookId={book.id}/>
            </div>
        )

}

export default BookCard