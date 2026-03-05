import type {Book} from "../../models/book.ts";
import SearchItem from "../SearchItem/SearchItem.tsx";
import styles from "./SearchResults.module.css"

interface SearchResultsProps {
    bookList : Book[]
}

function SearchResults(bookList: SearchResultsProps) {
    return (
        <div className={styles.content}>
            <div className={styles.header}>Результати пошуку</div>
            {bookList.bookList.map(item => (
                <SearchItem key={item.id} book={item} />
            ))}
        </div>
    )
}


export default SearchResults;