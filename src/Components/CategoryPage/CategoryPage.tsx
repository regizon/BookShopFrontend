import { useParams } from "react-router";
import { useEffect, useState, useRef } from "react";
import type { Book } from "../../models/book.ts";
import { isAxiosError } from "axios";
import { getAllByGenre, getCategoryFilters } from "../../services/book.service.ts";
import BookCard from "../BookCard/BookCard.tsx";
import styles from "./CategoryPage.module.css";

interface CategoryFilterOptions {
    genre_name: string;
    authors: string[];
    languages: string[];
    cover_types: string[];
    min_price: number;
    max_price: number;
}

type SectionKey = 'authors' | 'language' | 'coverType' | 'price';

function CategoryPage() {
    const { slug } = useParams<{ slug: string }>();

    const [isLoading, setIsLoading] = useState(true);
    const [errorCode, setErrorCode] = useState<number | null>(null);
    const [bookList, setBookList] = useState<Book[]>([]);
    const [filterOptions, setFilterOptions] = useState<CategoryFilterOptions | null>(null);

    const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
    const [selectedCoverTypes, setSelectedCoverTypes] = useState<string[]>([]);

    // Price slider: local (UI) vs api (debounced, triggers fetch)
    const [priceSlider, setPriceSlider] = useState<[number, number]>([0, 0]);
    const [apiPrice, setApiPrice] = useState<[number, number] | null>(null);
    const limitMin = useRef(0);
    const limitMax = useRef(0);
    const debounceRef = useRef<ReturnType<typeof setTimeout>>();

    const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>({
        authors: true,
        language: true,
        coverType: true,
        price: true,
    });

    // Fetch filter options once per slug
    useEffect(() => {
        if (!slug) return;
        setFilterOptions(null);
        setSelectedAuthors([]);
        setSelectedLanguages([]);
        setSelectedCoverTypes([]);
        setApiPrice(null);

        getCategoryFilters(slug).then((data: CategoryFilterOptions) => {
            setFilterOptions(data);
            limitMin.current = data.min_price;
            limitMax.current = data.max_price;
            setPriceSlider([data.min_price, data.max_price]);
            setApiPrice([data.min_price, data.max_price]);
        }).catch(() => {});
    }, [slug]);

    // Fetch books whenever slug or any filter changes
    useEffect(() => {
        if (!slug) return;
        setIsLoading(true);
        setErrorCode(null);

        getAllByGenre(slug, {
            authors: selectedAuthors,
            languages: selectedLanguages,
            cover_types: selectedCoverTypes,
            min_price: apiPrice ? apiPrice[0] : undefined,
            max_price: apiPrice ? apiPrice[1] : undefined,
        }).then((data: Book[]) => {
            setBookList(data);
            setIsLoading(false);
        }).catch((error: unknown) => {
            if (isAxiosError(error)) {
                setErrorCode(error.response?.status ?? null);
            }
            setIsLoading(false);
        });
    }, [slug, selectedAuthors, selectedLanguages, selectedCoverTypes, apiPrice]);

    function toggleItem(arr: string[], item: string): string[] {
        return arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item];
    }

    function toggleSection(key: SectionKey) {
        setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
    }

    function handlePriceChange(min: number, max: number) {
        setPriceSlider([min, max]);
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => setApiPrice([min, max]), 400);
    }

    if (errorCode === 404) return <h1>Ви намагаєтесь потрапити кудись не туди</h1>;
    if (errorCode === 500) return <h1>На сервері сталася помилка</h1>;

    const categoryTitle = filterOptions?.genre_name.toUpperCase()
        ?? slug?.replace(/-/g, ' ').toUpperCase()
        ?? '';

    const lMin = limitMin.current;
    const lMax = limitMax.current;
    const hasRange = lMax > lMin;
    const fillLeft = hasRange ? `${((priceSlider[0] - lMin) / (lMax - lMin)) * 100}%` : '0%';
    const fillRight = hasRange ? `${((lMax - priceSlider[1]) / (lMax - lMin)) * 100}%` : '0%';

    return (
        <div className={styles.page}>
            <div className={styles.pageHeader}>
                <h1 className={styles.categoryTitle}>{categoryTitle}</h1>
            </div>

            <div className={styles.layout}>
                {/* ── Filter panel ── */}
                <aside className={styles.filterPanel}>
                    <h2 className={styles.filterTitle}>ФІЛЬТРИ</h2>

                    {/* Authors */}
                    <div className={styles.filterSection}>
                        <button className={styles.sectionHeader} onClick={() => toggleSection('authors')}>
                            <span>Автори</span>
                            <span className={styles.sectionChevron}>{openSections.authors ? '▲' : '▼'}</span>
                        </button>
                        {openSections.authors && filterOptions && (
                            <div className={styles.checkboxList}>
                                {filterOptions.authors.map(author => (
                                    <label key={author} className={styles.checkboxLabel}>
                                        <input
                                            type="checkbox"
                                            checked={selectedAuthors.includes(author)}
                                            onChange={() => setSelectedAuthors(prev => toggleItem(prev, author))}
                                        />
                                        <span>{author}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Language */}
                    <div className={styles.filterSection}>
                        <button className={styles.sectionHeader} onClick={() => toggleSection('language')}>
                            <span>Мова</span>
                            <span className={styles.sectionChevron}>{openSections.language ? '▲' : '▼'}</span>
                        </button>
                        {openSections.language && filterOptions && (
                            <div className={styles.checkboxList}>
                                {filterOptions.languages.map(lang => (
                                    <label key={lang} className={styles.checkboxLabel}>
                                        <input
                                            type="checkbox"
                                            checked={selectedLanguages.includes(lang)}
                                            onChange={() => setSelectedLanguages(prev => toggleItem(prev, lang))}
                                        />
                                        <span>{lang}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Cover type */}
                    <div className={styles.filterSection}>
                        <button className={styles.sectionHeader} onClick={() => toggleSection('coverType')}>
                            <span>Тип палітурки</span>
                            <span className={styles.sectionChevron}>{openSections.coverType ? '▲' : '▼'}</span>
                        </button>
                        {openSections.coverType && filterOptions && (
                            <div className={styles.checkboxList}>
                                {filterOptions.cover_types.map(ct => (
                                    <label key={ct} className={styles.checkboxLabel}>
                                        <input
                                            type="checkbox"
                                            checked={selectedCoverTypes.includes(ct)}
                                            onChange={() => setSelectedCoverTypes(prev => toggleItem(prev, ct))}
                                        />
                                        <span>{ct}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Price */}
                    <div className={styles.filterSection}>
                        <button className={styles.sectionHeader} onClick={() => toggleSection('price')}>
                            <span>Ціна</span>
                            <span className={styles.sectionChevron}>{openSections.price ? '▲' : '▼'}</span>
                        </button>
                        {openSections.price && filterOptions && hasRange && (
                            <div className={styles.priceFilter}>
                                <div className={styles.sliderWrapper}>
                                    <div className={styles.sliderTrack}>
                                        <div className={styles.sliderFill} style={{ left: fillLeft, right: fillRight }} />
                                    </div>
                                    <input
                                        type="range"
                                        className={styles.rangeInput}
                                        min={lMin}
                                        max={lMax}
                                        value={priceSlider[0]}
                                        onChange={e => {
                                            const val = Math.min(Number(e.target.value), priceSlider[1] - 1);
                                            handlePriceChange(val, priceSlider[1]);
                                        }}
                                    />
                                    <input
                                        type="range"
                                        className={styles.rangeInput}
                                        min={lMin}
                                        max={lMax}
                                        value={priceSlider[1]}
                                        onChange={e => {
                                            const val = Math.max(Number(e.target.value), priceSlider[0] + 1);
                                            handlePriceChange(priceSlider[0], val);
                                        }}
                                    />
                                </div>
                                <div className={styles.priceLabels}>
                                    <span>{priceSlider[0]}₴</span>
                                    <span>{priceSlider[1]}₴</span>
                                </div>
                            </div>
                        )}
                    </div>
                </aside>

                {/* ── Book grid ── */}
                <main className={styles.bookGrid}>
                    {isLoading ? (
                        <p className={styles.statusMessage}>Завантаження...</p>
                    ) : bookList.length === 0 ? (
                        <p className={styles.statusMessage}>Отакої, в нас ще немає книг цього жанру</p>
                    ) : (
                        bookList.map(book => <BookCard key={book.id} book={book} />)
                    )}
                </main>
            </div>
        </div>
    );
}

export default CategoryPage;
