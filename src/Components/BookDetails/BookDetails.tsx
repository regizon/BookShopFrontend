import type {BookAllInfo, BookPatchPayload} from "../../models/book.ts";
import type Genre from "../../models/genre.ts";
import styles from "./BookDetails.module.css"
import {useEffect, useRef, useState} from "react";
import AddToCartButton from "../AddToCartButton/AddToCartButton.tsx";
import ChosenGenresList from "../ChosenGenresList/ChosenGenresList.tsx";
import AdminGenresList from "../AdminGenresList/AdminGenresList.tsx";
import {getGenres} from "../../services/book.service.ts";

type EditableFields = {
    title: string;
    description: string;
    price: number;
    pages: number;
    cover_type: string;
    language: string;
    isbn: string;
    quantity: number;
    cover: string;
}

interface BookDetailsProps {
    book: BookAllInfo;
    isStaff: boolean;
    onSave: (fields: BookPatchPayload) => Promise<void>;
    onDelete: () => void;
    editError: string | null;
    deleteError: string | null;
}

function bookToEditForm(b: BookAllInfo): EditableFields {
    return {
        title: b.title,
        description: b.description,
        price: b.price,
        pages: b.pages,
        cover_type: b.cover_type,
        language: b.language,
        isbn: String(b.isbn),
        quantity: b.quantity,
        cover: b.cover,
    }
}

function BookDetails({book, isStaff, onSave, onDelete, editError, deleteError}: BookDetailsProps) {

    const [isExpanded, setIsExpanded] = useState<boolean>(false)
    const [isClamped, setIsClamped] = useState<boolean>(false)
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [editForm, setEditForm] = useState<EditableFields>(bookToEditForm(book))
    const [isSaving, setIsSaving] = useState<boolean>(false)
    const [coverWidth, setCoverWidth] = useState<number>(0)
    const [editAuthors, setEditAuthors] = useState<string[]>([...book.author_read])
    const [editPublisher, setEditPublisher] = useState<string>(book.publisher_read)
    const [newAuthorInput, setNewAuthorInput] = useState<string>('')
    const [allGenres, setAllGenres] = useState<Genre[]>([])
    const [editGenres, setEditGenres] = useState<Genre[]>([])
    const [openGenres, setOpenGenres] = useState<boolean>(false)
    const descriptionRef = useRef<HTMLDivElement>(null)
    const imgRef = useRef<HTMLImageElement>(null)
    const genreDropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        async function fetchGenres() {
            const genres = await getGenres()
            setAllGenres(genres)
        }
        fetchGenres()
    }, [])

    useEffect(() => {
        const element = descriptionRef.current
        if(element){
            setIsClamped(element.scrollHeight > element.clientHeight)
        }
    }, [book.description])

    // Re-sync form if book prop changes (e.g. after a successful save)
    useEffect(() => {
        if (!isEditing) {
            setEditForm(bookToEditForm(book))
            setEditAuthors([...book.author_read])
            setEditPublisher(book.publisher_read)
        }
    }, [book, isEditing])

    // Re-sync edit genres when not editing (handles book update and allGenres load)
    useEffect(() => {
        if (!isEditing) {
            setEditGenres(allGenres.filter(g => book.genres_read.includes(g.name)))
        }
    }, [book.genres_read, allGenres, isEditing])

    useEffect(() => {
        if (isEditing && imgRef.current) {
            setCoverWidth(imgRef.current.offsetWidth)
        }
    }, [isEditing])

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (openGenres && !genreDropdownRef.current?.contains(e.target as Node)) {
                setOpenGenres(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [openGenres])

    function handleEditStart() {
        setEditForm(bookToEditForm(book))
        setEditAuthors([...book.author_read])
        setEditPublisher(book.publisher_read)
        setNewAuthorInput('')
        setEditGenres(allGenres.filter(g => book.genres_read.includes(g.name)))
        setIsEditing(true)
    }

    function handleCancel() {
        setEditForm(bookToEditForm(book))
        setEditAuthors([...book.author_read])
        setEditPublisher(book.publisher_read)
        setNewAuthorInput('')
        setEditGenres(allGenres.filter(g => book.genres_read.includes(g.name)))
        setOpenGenres(false)
        setIsEditing(false)
    }

    function handleField<K extends keyof EditableFields>(field: K, value: EditableFields[K]) {
        setEditForm(prev => ({...prev, [field]: value}))
    }

    function handleGenreRemove(id: number) {
        setEditGenres(prev => prev.filter(g => g.id !== id))
    }

    function handleGenreAdd(id: number) {
        const genre = allGenres.find(g => g.id === id)
        if (genre && !editGenres.some(g => g.id === id)) {
            setEditGenres(prev => [...prev, genre])
        }
    }

    async function handleSave() {
        const diff: BookPatchPayload = {}
        ;(Object.keys(editForm) as (keyof EditableFields)[]).forEach(key => {
            if ((editForm[key] as unknown) !== (book[key] as unknown)) {
                (diff as Record<string, unknown>)[key] = editForm[key]
            }
        })
        if (JSON.stringify(editAuthors) !== JSON.stringify(book.author_read)) {
            diff.authors = editAuthors
        }
        if (editPublisher !== book.publisher_read) {
            diff.publisher = editPublisher
        }
        const originalGenreIds = allGenres
            .filter(g => book.genres_read.includes(g.name))
            .map(g => g.id)
            .sort((a, b) => a - b)
        const currentGenreIds = editGenres.map(g => g.id).sort((a, b) => a - b)
        if (JSON.stringify(currentGenreIds) !== JSON.stringify(originalGenreIds)) {
            diff.genres = editGenres.map(g => g.id)
        }
        if (Object.keys(diff).length === 0) {
            setIsEditing(false)
            return
        }
        setIsSaving(true)
        try {
            await onSave(diff)
            setIsEditing(false)
        } finally {
            setIsSaving(false)
        }
    }

    function handleDeleteClick() {
        if (window.confirm('Ви впевнені, що хочете видалити цю книгу?')) {
            onDelete()
        }
    }

    function toggleDescription() {
        setIsExpanded(!isExpanded)
    }

    const available = book.quantity > 0
    const viewGenreIds = allGenres.filter(g => book.genres_read.includes(g.name)).map(g => g.id)
    const editGenreIds = editGenres.map(g => g.id)

    return (
        <div className={styles.content}>
            {isStaff && (
                <div className={styles.adminBar}>
                    {!isEditing ? (
                        <>
                            <button className={styles.adminBtn} onClick={handleEditStart}>
                                Редагувати
                            </button>
                            <button className={`${styles.adminBtn} ${styles.adminBtnDanger}`} onClick={handleDeleteClick}>
                                Видалити
                            </button>
                            {deleteError && <span className={styles.errorText}>{deleteError}</span>}
                        </>
                    ) : (
                        <>
                            <button className={styles.adminBtn} onClick={handleSave} disabled={isSaving}>
                                {isSaving ? 'Збереження...' : 'Зберегти'}
                            </button>
                            <button className={`${styles.adminBtn} ${styles.adminBtnSecondary}`} onClick={handleCancel} disabled={isSaving}>
                                Скасувати
                            </button>
                            {editError && <span className={styles.errorText}>{editError}</span>}
                        </>
                    )}
                </div>
            )}
            <div className={styles.mainRow}>
                <div className={styles.bookCover}>
                    <img ref={imgRef} src={isEditing ? editForm.cover : book.cover} alt={book.title} />
                    {isEditing && (
                        <div
                            className={styles.coverInputWrapper}
                            style={{ '--cover-input-width': `${coverWidth}px` } as React.CSSProperties}
                        >
                            <input
                                className={`${styles.editInput} ${styles.coverInput}`}
                                placeholder="URL обкладинки"
                                value={editForm.cover}
                                onChange={e => handleField('cover', e.target.value)}
                            />
                        </div>
                    )}
                </div>
                <div className={styles.bookInfo}>
                    {isEditing ? (
                        <input
                            className={`${styles.editInput} ${styles.editTitle}`}
                            value={editForm.title}
                            onChange={e => handleField('title', e.target.value)}
                        />
                    ) : (
                        <h2>{book.title}</h2>
                    )}
                    <span className={styles.bookAuthor}>
                        {isEditing ? editAuthors.join(', ') : book.author_read.join(', ')}
                    </span>

                    {isEditing ? (
                        <div
                            className={styles.genresContainer}
                            ref={genreDropdownRef}
                        >
                            <div
                                className={styles.genresInner}
                                onClick={() => setOpenGenres(prev => !prev)}
                            >
                                <ChosenGenresList
                                    chosen={editGenreIds}
                                    variants={allGenres}
                                    isEditing={true}
                                    onRemove={handleGenreRemove}
                                />
                                {editGenreIds.length === 0 && (
                                    <span className={styles.genresPlaceholder}>Жанри...</span>
                                )}
                            </div>
                            {openGenres && (
                                <AdminGenresList
                                    variants={allGenres}
                                    onGenreClick={handleGenreAdd}
                                />
                            )}
                        </div>
                    ) : (
                        viewGenreIds.length > 0 && (
                            <div className={styles.genresRow}>
                                <ChosenGenresList
                                    chosen={viewGenreIds}
                                    variants={allGenres}
                                    isEditing={false}
                                />
                            </div>
                        )
                    )}

                    {isEditing ? (
                        <textarea
                            className={styles.editTextarea}
                            value={editForm.description}
                            onChange={e => handleField('description', e.target.value)}
                            rows={6}
                        />
                    ) : (
                        <>
                            <div className={isExpanded ? styles.fullDescription : styles.hiddenDescription} ref={descriptionRef}>
                                {book.description}
                            </div>
                            {(isClamped || isExpanded) && (
                                <button onClick={toggleDescription} className={styles.showMore}>
                                    {isExpanded ? 'Сховати' : 'Показати весь опис'}
                                </button>
                            )}
                        </>
                    )}

                    <h3 className={styles.tableTitle}>Характеристики</h3>
                    <table>
                        <tbody>
                        <tr>
                            <td>Автор</td>
                            <td className={styles.rightTd}>
                                {isEditing ? (
                                    <div className={styles.authorEditor}>
                                        <div className={styles.authorTagList}>
                                            {editAuthors.map((name, i) => (
                                                <span key={i} className={styles.authorTag}>
                                                    {name}
                                                    <button
                                                        className={styles.authorTagRemove}
                                                        onClick={() => setEditAuthors(editAuthors.filter((_, idx) => idx !== i))}
                                                        title="Видалити автора"
                                                    >×</button>
                                                </span>
                                            ))}
                                        </div>
                                        <div className={styles.authorAddRow}>
                                            <input
                                                className={styles.editInput}
                                                placeholder="Ім'я автора"
                                                value={newAuthorInput}
                                                onChange={e => setNewAuthorInput(e.target.value)}
                                                onKeyDown={e => {
                                                    if (e.key === 'Enter' && newAuthorInput.trim()) {
                                                        setEditAuthors([...editAuthors, newAuthorInput.trim()])
                                                        setNewAuthorInput('')
                                                    }
                                                }}
                                            />
                                            <button
                                                className={styles.authorAddBtn}
                                                onClick={() => {
                                                    if (newAuthorInput.trim()) {
                                                        setEditAuthors([...editAuthors, newAuthorInput.trim()])
                                                        setNewAuthorInput('')
                                                    }
                                                }}
                                            >Додати</button>
                                        </div>
                                    </div>
                                ) : book.author_read.join(', ')}
                            </td>
                        </tr>
                        <tr>
                            <td>Видавництво</td>
                            <td className={styles.rightTd}>
                                {isEditing ? (
                                    <input
                                        className={styles.editInput}
                                        value={editPublisher}
                                        onChange={e => setEditPublisher(e.target.value)}
                                    />
                                ) : book.publisher_read}
                            </td>
                        </tr>
                        <tr>
                            <td>Кількість сторінок</td>
                            <td className={styles.rightTd}>
                                {isEditing ? (
                                    <input
                                        className={styles.editInput}
                                        type="number"
                                        min={1}
                                        value={editForm.pages}
                                        onChange={e => handleField('pages', Number(e.target.value))}
                                    />
                                ) : book.pages}
                            </td>
                        </tr>
                        <tr>
                            <td>Мова</td>
                            <td className={styles.rightTd}>
                                {isEditing ? (
                                    <input
                                        className={styles.editInput}
                                        value={editForm.language}
                                        onChange={e => handleField('language', e.target.value)}
                                    />
                                ) : book.language}
                            </td>
                        </tr>
                        <tr>
                            <td>Тип обкладинки</td>
                            <td className={styles.rightTd}>
                                {isEditing ? (
                                    <input
                                        className={styles.editInput}
                                        value={editForm.cover_type}
                                        onChange={e => handleField('cover_type', e.target.value)}
                                    />
                                ) : book.cover_type}
                            </td>
                        </tr>
                        <tr>
                            <td>ISBN</td>
                            <td className={styles.rightTd}>
                                {isEditing ? (
                                    <input
                                        className={styles.editInput}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={13}
                                        value={editForm.isbn}
                                        onChange={e => handleField('isbn', e.target.value.replace(/\D/g, '').slice(0, 13))}
                                    />
                                ) : book.isbn}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div className={`${styles.buyItem} ${!available ? styles.unavailable : ''}`}>
                    <div className={styles.buyRow}>
                        <span className={styles.buyLabel}>Наявність</span>
                        <span className={`${styles.buyAvailability} ${available ? styles.available : styles.unavailableText}`}>
                            {available ? '✓ В наявності' : 'Немає в наявності'}
                        </span>
                    </div>
                    <div className={styles.buyRow}>
                        <span className={styles.buyLabel}>Ціна</span>
                        {isEditing ? (
                            <div className={styles.editPriceRow}>
                                <input
                                    className={styles.editInput}
                                    type="number"
                                    min={0}
                                    step={0.01}
                                    value={editForm.price}
                                    onChange={e => handleField('price', Number(e.target.value))}
                                />
                                <span> грн</span>
                            </div>
                        ) : (
                            <span className={`${styles.price} ${styles.buyPriceValue}`}>
                                {book.price.toLocaleString('uk-UA')} грн
                            </span>
                        )}
                    </div>
                    {isEditing && (
                        <div className={styles.editQuantityRow}>
                            <span>Кількість:</span>
                            <input
                                className={styles.editInput}
                                type="number"
                                min={0}
                                value={editForm.quantity}
                                onChange={e => handleField('quantity', Number(e.target.value))}
                            />
                        </div>
                    )}
                    <AddToCartButton bookId={book.id} />
                </div>
            </div>
        </div>
    )
}

export default BookDetails
