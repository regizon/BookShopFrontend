import { useParams } from "react-router";
import { useEffect, useState, useRef } from "react";
import type { Book } from "../../models/book.ts";
import type { PaginatedResponse } from "../../services/book.service.ts";
import { isAxiosError } from "axios";
import { getAllByGenre, getCategoryFilters } from "../../services/book.service.ts";
import BookCard from "../BookCard/BookCard.tsx";
import styles from "./CategoryPage.module.css";

const PAGE_SIZE = 12;

interface CategoryFilterOptions {
    genre_name: string;
    authors: string[];
    languages: string[];
    cover_types: string[];
    min_price: number;
    max_price: number;
}

type SectionKey = 'authors' | 'language' | 'coverType' | 'price';

function buildPageItems(current: number, total: number): (number | '...')[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const items: (number | '...')[] = [];
    const left  = Math.max(2, current - 1);
    const right = Math.min(total - 1, current + 1);

    items.push(1);
    if (left > 2) items.push('...');
    for (let p = left; p <= right; p++) items.push(p);
    if (right < total - 1) items.push('...');
    items.push(total);

    return items;
}

function CategoryPage() {
    const { slug } = useParams<{ slug: string }>();

    const [isLoading, setIsLoading] = useState(true);
    const [errorCode, setErrorCode] = useState<number | null>(null);
    const [bookList, setBookList] = useState<Book[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const [filterOptions, setFilterOptions] = useState<CategoryFilterOptions | null>(null);
    const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
    const [selectedCoverTypes, setSelectedCoverTypes] = useState<string[]>([]);

    const [priceSlider, setPriceSlider] = useState<[number, number]>([0, 0]);
    const [apiPrice, setApiPrice]       = useState<[number, number] | null>(null);
    const [limitMin, setLimitMin] = useState(0);
    const [limitMax, setLimitMax] = useState(0);
    const debounceRef = useRef<ReturnType<typeof setTimeout>>();
    const bookGridRef = useRef<HTMLElement>(null);

    const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>({
        authors: true, language: true, coverType: true, price: true,
    });

    useEffect(() => {
        if (!slug) return;
        /* eslint-disable react-hooks/set-state-in-effect */
        setFilterOptions(null);
        setSelectedAuthors([]);
        setSelectedLanguages([]);
        setSelectedCoverTypes([]);
        setApiPrice(null);
        setCurrentPage(1);
        /* eslint-enable react-hooks/set-state-in-effect */

        getCategoryFilters(slug).then((data: CategoryFilterOptions) => {
            setFilterOptions(data);
            setLimitMin(data.min_price);
            setLimitMax(data.max_price);
            setPriceSlider([data.min_price, data.max_price]);
            setApiPrice([data.min_price, data.max_price]);
        }).catch(() => {});
    }, [slug]);

    useEffect(() => {
        if (!slug) return;
        /* eslint-disable react-hooks/set-state-in-effect */
        setIsLoading(true);
        setErrorCode(null);
        /* eslint-enable react-hooks/set-state-in-effect */

        getAllByGenre(
            slug,
            {
                authors:     selectedAuthors,
                languages:   selectedLanguages,
                cover_types: selectedCoverTypes,
                min_price:   apiPrice ? apiPrice[0] : undefined,
                max_price:   apiPrice ? apiPrice[1] : undefined,
            },
            currentPage,
        ).then((data: PaginatedResponse<Book>) => {
            setBookList(data.results);
            setTotalCount(data.count);
            setIsLoading(false);
            bookGridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }).catch((error: unknown) => {
            if (isAxiosError(error)) setErrorCode(error.response?.status ?? null);
            setIsLoading(false);
        });
    }, [slug, selectedAuthors, selectedLanguages, selectedCoverTypes, apiPrice, currentPage]);

    function toggleItem(arr: string[], item: string): string[] {
        return arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item];
    }

    function toggleSection(key: SectionKey) {
        setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
    }

    function handlePriceChange(min: number, max: number) {
        setPriceSlider([min, max]);
        setCurrentPage(1);
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => setApiPrice([min, max]), 400);
    }

    function goToPage(page: number) {
        if (page === currentPage) return;
        setCurrentPage(page);
    }

    const totalPages = Math.ceil(totalCount / PAGE_SIZE);
    const pageItems  = buildPageItems(currentPage, totalPages);

    const lMin     = limitMin;
    const lMax     = limitMax;
    const hasRange = lMax > lMin;
    const fillLeft  = hasRange ? `${((priceSlider[0] - lMin) / (lMax - lMin)) * 100}%` : '0%';
    const fillRight = hasRange ? `${((lMax - priceSlider[1]) / (lMax - lMin)) * 100}%` : '0%';
    const categoryTitle = filterOptions?.genre_name.toUpperCase()
        ?? slug?.replace(/-/g, ' ').toUpperCase()
        ?? '';

    if (errorCode === 404) return <h1>Ви намагаєтесь потрапити кудись не туди</h1>;
    if (errorCode === 500) return <h1>На сервері сталася помилка</h1>;

    return (
        <div className={styles.page}>
            <div className={styles.pageHeader}>
                <h1 className={styles.categoryTitle}>{categoryTitle}</h1>
            </div>

            <div className={styles.layout}>
                <aside className={styles.filterPanel}>
                    <h2 className={styles.filterTitle}>ФІЛЬТРИ</h2>

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
                                            onChange={() => {
                                                setSelectedAuthors(prev => toggleItem(prev, author));
                                                setCurrentPage(1);
                                            }}
                                        />
                                        <span>{author}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

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
                                            onChange={() => {
                                                setSelectedLanguages(prev => toggleItem(prev, lang));
                                                setCurrentPage(1);
                                            }}
                                        />
                                        <span>{lang}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

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
                                            onChange={() => {
                                                setSelectedCoverTypes(prev => toggleItem(prev, ct));
                                                setCurrentPage(1);
                                            }}
                                        />
                                        <span>{ct}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

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

                <main className={styles.bookGrid} ref={bookGridRef}>
                    {isLoading ? (
                        <p className={styles.statusMessage}>Завантаження...</p>
                    ) : bookList.length === 0 ? (
                        <p className={styles.statusMessage}>Отакої, в нас ще немає книг цього жанру</p>
                    ) : (
                        bookList.map(book => <BookCard key={book.id} book={book} />)
                    )}
                </main>
            </div>

            {!isLoading && totalPages > 1 && (
                <div className={styles.paginationWrapper}>
                    <nav className={styles.paginationBar} aria-label="Pagination">
                        {pageItems.map((item, idx) =>
                            item === '...' ? (
                                <span
                                    key={`ellipsis-${idx}`}
                                    className={`${styles.pageBtn} ${styles.pageBtnEllipsis}`}
                                >
                                    …
                                </span>
                            ) : (
                                <button
                                    key={item}
                                    className={`${styles.pageBtn} ${item === currentPage ? styles.pageBtnActive : ''}`}
                                    onClick={() => goToPage(item)}
                                    aria-current={item === currentPage ? 'page' : undefined}
                                >
                                    {item}
                                </button>
                            )
                        )}
                    </nav>
                </div>
            )}
        </div>
    );
}

export default CategoryPage;
