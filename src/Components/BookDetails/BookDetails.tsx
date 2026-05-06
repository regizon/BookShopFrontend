import type {BookAllInfo} from "../../models/book.ts";
import styles from "./BookDetails.module.css"
import {useEffect, useRef, useState} from "react";
import AddToCartButton from "../AddToCartButton/AddToCartButton.tsx";

type EditableFields = {
    title: string;
    description: string;
    price: number;
    pages: number;
    cover_type: string;
    language: string;
    isbn: number;
    quantity: number;
    cover: string;
}

interface BookDetailsProps {
    book: BookAllInfo;
    isStaff: boolean;
    onSave: (fields: Partial<BookAllInfo>) => Promise<void>;
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
        isbn: b.isbn,
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
    const descriptionRef = useRef<HTMLDivElement>(null)

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
        }
    }, [book, isEditing])

    function handleEditStart() {
        setEditForm(bookToEditForm(book))
        setIsEditing(true)
    }

    function handleCancel() {
        setEditForm(bookToEditForm(book))
        setIsEditing(false)
    }

    function handleField<K extends keyof EditableFields>(field: K, value: EditableFields[K]) {
        setEditForm(prev => ({...prev, [field]: value}))
    }

    async function handleSave() {
        const diff: Partial<BookAllInfo> = {}
        ;(Object.keys(editForm) as (keyof EditableFields)[]).forEach(key => {
            if ((editForm[key] as unknown) !== (book[key] as unknown)) {
                (diff as Record<string, unknown>)[key] = editForm[key]
            }
        })
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
                    <img src={isEditing ? editForm.cover : book.cover} alt={book.title} />
                    {isEditing && (
                        <input
                            className={styles.editInput}
                            style={{marginTop: 8, width: '20px'}}
                            placeholder="URL обкладинки"
                            value={editForm.cover}
                            onChange={e => handleField('cover', e.target.value)}
                        />
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
                    <span className={styles.bookAuthor}>{book.author_read}</span>

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
                            <td className={styles.rightTd}>{book.author_read}</td>
                        </tr>
                        <tr>
                            <td>Видавництво</td>
                            <td className={styles.rightTd}>{book.publisher_read}</td>
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
                                        type="number"
                                        value={editForm.isbn}
                                        onChange={e => handleField('isbn', Number(e.target.value))}
                                    />
                                ) : book.isbn}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div className={`${styles.buyItem} ${!available ? styles.unavailable : ''}`}>
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
                        <span className={styles.price}>{book.price} грн</span>
                    )}
                    <span className={`${styles.available} ${!available ? styles.unavailableText : ''}`}>
                        {available ? 'В наявності' : 'Немає в наявності'}
                    </span>
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
