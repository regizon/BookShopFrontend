import { useState, useEffect } from 'react';
import styles from './BookCollectionManager.module.css';
import {
    getCollections,
    getAllBooks,
    addBookToCollection,
    removeBookFromCollection,
    createCollection,
    deleteCollection,
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
    const [newCollectionName, setNewCollectionName] = useState('');
    const [createError, setCreateError] = useState<string | null>(null);

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

    function handleCreateCollection() {
        const name = newCollectionName.trim();
        if (!name) return;
        createCollection(name)
            .then((created) => {
                setCollections((prev) => {
                    setActiveTab(prev.length);
                    return [...prev, created];
                });
                setSelectedBook((prev) => ({ ...prev, [created.id]: '' }));
                setNewCollectionName('');
                setCreateError(null);
            })
            .catch(() => setCreateError('Не вдалося створити колекцію'));
    }

    function handleDeleteCollection(collectionId: number, index: number) {
        deleteCollection(collectionId)
            .then(() => {
                setCollections((prev) => prev.filter((c) => c.id !== collectionId));
                setActiveTab((prev) => {
                    if (index < prev) return prev - 1;
                    if (index === prev) return Math.max(0, prev - 1);
                    return prev;
                });
                setActionError(null);
            })
            .catch(() => setActionError('Не вдалося видалити колекцію'));
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

            <div className={styles.createRow}>
                <input
                    className={styles.createInput}
                    type="text"
                    placeholder="Назва нової колекції"
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateCollection()}
                />
                <button
                    className={styles.addButton}
                    onClick={handleCreateCollection}
                    disabled={!newCollectionName.trim()}
                >
                    Нова колекція
                </button>
            </div>
            {createError && <p className={styles.errorMessage}>{createError}</p>}

            <div className={styles.tabs}>
                {collections.map((collection, index) => (
                    <div key={collection.id} className={styles.tabWrapper}>
                        <button
                            className={`${styles.tab} ${activeTab === index ? styles.tabActive : ''}`}
                            onClick={() => setActiveTab(index)}
                        >
                            {collection.name}
                        </button>
                        <button
                            className={styles.tabDeleteBtn}
                            onClick={() => handleDeleteCollection(collection.id, index)}
                            title="Видалити колекцію"
                        >
                            ×
                        </button>
                    </div>
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
