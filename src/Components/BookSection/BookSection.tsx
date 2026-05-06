import styles from './BookSection.module.css';
import BookCard from '../BookCard/BookCard.tsx';
import type { Collection } from '../../models/collection.ts';

interface BookSectionProps {
    collection: Collection;
}

function BookSection({ collection }: BookSectionProps) {
    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <h2 className={styles.title}>{collection.name}</h2>
                <span className={styles.viewAll}>Дивитись всі</span>
            </div>
            <div className={styles.booksRow}>
                {collection.books.map((book) => (
                    <BookCard key={book.id} book={book} />
                ))}
            </div>
        </section>
    );
}

export default BookSection;
