import type {Book} from "../../models/book.ts";
import {Link} from "react-router";
import styles from "./SearchItem.module.css"

interface SearchItemProps {
    book: Book;
}


function SearchItem({book} : SearchItemProps) {
    return (
        <Link to={`books/${book.id}`}>
            <div className={styles.itemContainer}>
                <div>
                    <img src={book.cover} className={styles.poster} alt="cover"/>
                </div>
                <div className={styles.rightPart}>
                    <span>{book.title}</span>
                    <span>{book.author_read}</span>
                    <span>{book.price}</span>
                </div>
            </div>
        </Link>
    )
}

export default SearchItem