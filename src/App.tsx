import styles from './App.module.css';
import { useState, useEffect } from 'react';
import BookSection from './Components/BookSection/BookSection.tsx';
import { getCollections } from './services/bookCollection.service.ts';
import type { Collection } from './models/collection.ts';

function App() {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getCollections()
            .then((data) => setCollections(data))
            .catch(() => setError('Не вдалося завантажити колекції'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className={styles.status}>Завантаження...</div>;
    if (error) return <div className={styles.status}>{error}</div>;

    return (
        <div className={styles.app}>
            {collections
                .filter((collection) => collection.books.length > 0)
                .map((collection) => (
                    <BookSection key={collection.id} collection={collection} />
                ))}
        </div>
    );
}

export default App;
