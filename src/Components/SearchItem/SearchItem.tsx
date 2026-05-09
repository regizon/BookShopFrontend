import type {Book} from "../../models/book.ts";
import {Link} from "react-router";
import styles from "./SearchItem.module.css"

interface SearchItemProps {
    book: Book;
}


function SearchItem({book} : SearchItemProps) {
    const available = book.quantity > 0

    return (
        <Link to={`books/${book.id}`}>
            <div className={styles.itemContainer}>
                <div>
                    <img src={book.cover} className={styles.poster} alt="cover"/>
                </div>
                <div className={styles.rightPart}>
                    <span>{book.title}</span>
                    <span className={styles.author}>{book.author_read}</span>
                    <span className={`${!available ? styles.author : ''}`}>
                        {available ? (
                            book.discount_price != null ? (
                                <span className={styles.priceBlock}>
                                    <span className={styles.priceOriginal}>{book.price}₴</span>
                                    <span className={styles.priceDiscount}>{book.discount_price}₴</span>
                                </span>
                            ) : book.price + "₴"
                        ) : (
                            <div className={styles.unavailable}><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-van-icon lucide-van"><path d="M13 6v5a1 1 0 0 0 1 1h6.102a1 1 0 0 1 .712.298l.898.91a1 1 0 0 1 .288.702V17a1 1 0 0 1-1 1h-3"/><path d="M5 18H3a1 1 0 0 1-1-1V8a2 2 0 0 1 2-2h12c1.1 0 2.1.8 2.4 1.8l1.176 4.2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg> Немає в наявності</div>
                        )}
                    </span>
                </div>
            </div>
        </Link>
    )
}

export default SearchItem