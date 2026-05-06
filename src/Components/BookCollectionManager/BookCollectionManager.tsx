import { useState, useEffect } from 'react';
import styles from './BookCollectionManager.module.css';
import {
    getCollections,
    getAllBooks,
    addBookToCollection,
    removeBookFromCollection,
} from '../../services/bookCollection.service.ts';
import type { Collection, CollectionBook } from '../../services/bookCollection.service.ts';
import type { Book } from '../../models/book.ts';

function BookCollectionManager() {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [books, setBooks] = useState<Book[]>([]);
    const [activeTab, setActiveTab] = useState(0);
    const [selectedBook, setSelectedBook] = useState<Record<number, string>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        Promise.all([getCollections(), getAllBooks()])
            .then(([collectionsData, booksData]) => {
                setCollections(collectionsData);
                setBooks(booksData);
                const initial: Record<number, string> = {};
                collectionsData.forEach((c) => { initial[c.id] = ''; });
                setSelectedBook(initial);
            })
            .catch(() => setError('Не вдалося завантажити дані'))
            .finally(() => setLoading(false));
    }, []);

    const activeCollection = collections[activeTab];

    const booksNotInCollection = activeCollection
        ? books.filter((b) => !activeCollection.books.some((cb) => cb.id === b.id))
        : [];

    function handleAdd(collectionId: number) {
        const bookId = Number(selectedBook[collectionId]);
        if (!bookId) return;
        addBookToCollection({ book: bookId, collection: collectionId })
            .then(() => {
                const addedBook = books.find((b) => b.id === bookId);
                if (!addedBook) return;
                const newEntry: CollectionBook = {
                    id: addedBook.id,
                    title: addedBook.title,
                    author_read: addedBook.author_read,
                    cover: addedBook.cover,
                };
                setCollections((prev) =>
                    prev.map((c) =>
                        c.id === collectionId
                            ? { ...c, books: [...c.books, newEntry] }
                            : c
                    )
                );
                setSelectedBook((prev) => ({ ...prev, [collectionId]: '' }));
                setActionError(null);
            })
            .catch(() => setActionError('Не вдалося додати книгу'));
    }

    function handleRemove(collectionId: number, bookId: number) {
        removeBookFromCollection({ book: bookId, collection: collectionId })
            .then(() => {
                setCollections((prev) =>
                    prev.map((c) =>
                        c.id === collectionId
                            ? { ...c, books: c.books.filter((b) => b.id !== bookId) }
                            : c
                    )
                );
                setActionError(null);
            })
            .catch(() => setActionError('Не вдалося видалити книгу'));
    }

    function getAuthor(author: string | string[]): string {
        return Array.isArray(author) ? author.join(', ') : author;
    }

    if (loading) {
        return (
            <div className={styles.content}>
                <div className={styles.loaderContainer}>
                    <span className={styles.loader} />
                    <span>Завантаження...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.content}>
                <p className={styles.errorMessage}>{error}</p>
            </div>
        );
    }

    return (
        <div className={styles.content}>
            <h1 className={styles.caption}>Управління колекціями</h1>

            <div className={styles.tabs}>
                {collections.map((collection, index) => (
                    <button
                        key={collection.id}
                        className={`${styles.tab} ${activeTab === index ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab(index)}
                    >
                        {collection.name}
                    </button>
                ))}
            </div>

            {activeCollection && (
                <div className={styles.card}>
                    <h2 className={styles.collectionTitle}>{activeCollection.name}</h2>

                    <div className={styles.addRow}>
                        <select
                            className={styles.select}
                            value={selectedBook[activeCollection.id] ?? ''}
                            onChange={(e) =>
                                setSelectedBook((prev) => ({
                                    ...prev,
                                    [activeCollection.id]: e.target.value,
                                }))
                            }
                        >
                            <option value="">— Обрати книгу —</option>
                            {booksNotInCollection.map((book) => (
                                <option key={book.id} value={book.id}>
                                    {book.title}
                                </option>
                            ))}
                        </select>
                        <button
                            className={styles.addButton}
                            onClick={() => handleAdd(activeCollection.id)}
                            disabled={!selectedBook[activeCollection.id]}
                        >
                            Додати
                        </button>
                    </div>

                    {actionError && <p className={styles.errorMessage}>{actionError}</p>}

                    <div className={styles.bookList}>
                        {activeCollection.books.map((book) => (
                            <div key={book.id} className={styles.bookRow}>
                                <div className={styles.bookInfo}>
                                    <span className={styles.bookTitle}>{book.title}</span>
                                    <span className={styles.bookAuthor}>{getAuthor(book.author_read)}</span>
                                </div>
                                <button
                                    className={styles.removeButton}
                                    onClick={() => handleRemove(activeCollection.id, book.id)}
                                >
                                    Видалити
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default BookCollectionManager;
