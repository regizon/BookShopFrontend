import type {BookAllInfo} from "../../models/book.ts";
import styles from "./BookDetails.module.css"
import {useState} from "react";
import AddToCartButton from "../AddToCartButton/AddToCartButton.tsx";

interface BookDetailsProps {
    book: BookAllInfo
}

function BookDetails({book}: BookDetailsProps) {

    const [isExpanded, setIsExpanded] = useState<boolean>(false)
    console.log(isExpanded)
    return (
        <div className={styles.content}>
            <div className={styles.leftBlock}>
                <div className={styles.bookCover}>
                    <img src={book.cover}/>
                </div>
                <div className={styles.bookInfo}>
                    <h2>{book.title}</h2>
                    <span className={styles.bookAuthor}>{book.author_read}</span>
                    <div className={isExpanded ? styles.fullDescription : styles.hiddenDescription}>
                        {book.description}
                    </div>
                    <button onClick={toggleDescription} className={styles.showMore}>{isExpanded ? 'Сховати' : 'Показати весь опис'}</button>
                    <h3 className={styles.tableTitle}>Характеристики</h3>
                    <table>
                        <tbody>
                        <tr>
                            <td>Автор</td>
                            <td className={styles.rightTd}>{book.author_read}</td>
                        </tr>
                        <tr>
                            <td>Видавництво</td>
                            <td className={styles.rightTd}>{book.publisher}</td>
                        </tr>
                        <tr>
                            <td>Кількість сторінок</td>
                            <td className={styles.rightTd}>{book.pages}</td>
                        </tr>
                        <tr>
                            <td>Мова</td>
                            <td className={styles.rightTd}>{book.language}</td>
                        </tr>
                        <tr>
                            <td>Тип обкладинки</td>
                            <td className={styles.rightTd}>{book.cover_type}</td>
                        </tr>
                        <tr>
                            <td>ISBN</td>
                            <td className={styles.rightTd}>{book.isbn}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className={styles.buyItem}>
                <span className={styles.price}>{book.price} грн</span>
                <span className={styles.available}>В наявності</span>
                <AddToCartButton bookId={book.id} />
            </div>
        </div>
    )

    function toggleDescription() {
        setIsExpanded(!isExpanded)
    }
}

export default BookDetails
