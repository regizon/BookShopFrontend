import styles from "./AddBookPage.module.css"
import {useState, type ChangeEvent, useEffect, useRef} from "react";
import parseBook from "../../services/parseBook.service.ts";
import {addBook} from "../../services/admin.service.ts";
import ChosenGenresList from "../ChosenGenresList/ChosenGenresList.tsx";
import {getGenres} from "../../services/book.service.ts";
import AdminGenresList from "../AdminGenresList/AdminGenresList.tsx";
import type Genre from "../../models/genre.ts";
import {useModal} from "../../Contexts/ModalContext.ts";
import {useNavigate} from "react-router";

const languageVariations: Record<string, string> = {
    "uk": "Українська",
    "en": "Англійська",
    "ru": "Російська"
}

function AddBookPage() {

    const {openModal} = useModal()
    const navigate = useNavigate()

    const [openGenres, setOpenGenres] = useState<boolean>(false)
    const [allGenres, setAllGenres] = useState<Genre[]>([]);
    const dropdownGenres = useRef(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const initialBookForm = {
        title: "",
        authors: "",
        publisher: "",
        genres: [] as number[],
        pages: "",
        isbn: "",
        language: "",
        description: "",
        cover_type: "",
        price: "",
        quantity: "",
        cover: ""
    }

    const initialSearchForm = {
        titleSearch: "",
        authorSearch: "",
        publisherSearch: "",
    }

    const [addBookForm, setAddBookForm] = useState(initialBookForm)
    const [searchForm, setSearchForm] = useState(initialSearchForm)

    useEffect(() => {
        async function fetchGenres(){
           const genres = await getGenres()
           setAllGenres([...allGenres, ...genres])
        }
        fetchGenres()
    }, [])

    async function getBook(title: string, author: string, publisher: string){
        setIsLoading(true)
        const maximum_attempts = 10
        for(let attempts= 0; attempts <= maximum_attempts; attempts++){
            try{
                const response = await parseBook(title, author, publisher)
                if(response.error) throw new Error('Error when fetching data');
                const bookInfo = response['message']
                setAddBookForm({
                    ...addBookForm,
                    title: bookInfo['title'],
                    authors: bookInfo['authors'],
                    isbn: bookInfo['industryIdentifiers'][0]['identifier'],
                    description: bookInfo['description'],
                    publisher: bookInfo['publisher'],
                    language: languageVariations[bookInfo['language']],
                    cover: bookInfo['imageLinks']['thumbnail'],
                    pages: bookInfo['pageCount'],
                    cover_type: "Тверда"
                })
                break
            }catch {
                if(attempts === maximum_attempts){
                    alert("Не вдалося знайти книгу за вказаними параметрами")
                }
            }
        }
        setIsLoading(false)
    }

    function removeGenre(id: number){
        setAddBookForm({...addBookForm, genres: addBookForm.genres.filter(item => item !== id)})
    }

    function addGenre(id: number){
        if(!addBookForm.genres.includes(id)){
            setAddBookForm({...addBookForm, genres: [...addBookForm.genres, id]})
        }
    }

    const closeGenresMenu = (e) => {
        if(openGenres && !dropdownGenres.current?.contains(e.target)){
            setOpenGenres(false)
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', closeGenresMenu)
        return() => document.removeEventListener('mousedown',closeGenresMenu)
    }, [openGenres])

    const handleSearchFormChange = (event: ChangeEvent<HTMLInputElement>) =>{
        const {name, value} = event.target;
        setSearchForm({...searchForm, [name] : value});
    };

    const handleAddFormChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>{
        const {name, value} = event.target;
        setAddBookForm({...addBookForm, [name] : value});
    };

    const FALLBACK_COVER = <svg width="100" height="150" viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg">
  <title>Плейсхолдер обкладинки книги</title>

  <rect x="0" y="0" width="100" height="150" fill="#2c3e6b" rx="2"/>

  <rect x="0" y="0" width="7" height="150" fill="#1a2547"/>
  <rect x="7" y="0" width="1" height="150" fill="#4a5f9a"/>

  <rect x="10" y="8" width="84" height="134" fill="none" stroke="#4a5f9a" strokeWidth="0.8" rx="1"/>

  <rect x="14" y="30" width="72" height="0.5" fill="#4a5f9a"/>
  <rect x="14" y="110" width="72" height="0.5" fill="#4a5f9a"/>

  <ellipse cx="50" cy="70" rx="18" ry="24" fill="none" stroke="#4a5f9a" strokeWidth="0.8"/>
  <circle cx="50" cy="70" r="4" fill="#4a5f9a"/>

  <text x="50" y="24" textAnchor="middle" fontFamily="Georgia, serif" fontSize="7" fontWeight="700" fill="#c8d4f0" letterSpacing="1">НАЗВА КНИГИ</text>

  <text x="50" y="122" textAnchor="middle" fontFamily="Georgia, serif" fontSize="5" fill="#8a9ec8">Автор книги</text>
    </svg>
    return (
        <div className={styles.content}>

            {isLoading && (
                <div className={styles.loaderContainer}>
                    <span className={styles.loader}></span>
                    <span>Шукаємо інформацію про книгу...</span>
                </div>
            )}

            <h1 className={styles.caption}>Додати нову книгу</h1>

            {/* ── Search card ── */}
            <div className={styles.card}>
                <p className={styles.searchSectionLabel}>Автопошук</p>
                <div className={styles.searchRow}>
                    <div className={styles.searchField}>
                        <label>Назва</label>
                        <input
                            placeholder="Назва книги..."
                            name="titleSearch"
                            value={searchForm.titleSearch}
                            onChange={handleSearchFormChange}
                        />
                    </div>
                    <div className={styles.searchField}>
                        <label>Автор</label>
                        <input
                            placeholder="Ім'я автора..."
                            name="authorSearch"
                            value={searchForm.authorSearch}
                            onChange={handleSearchFormChange}
                        />
                    </div>
                </div>
                <div className={styles.searchRow}>
                    <div className={styles.searchField}>
                        <label>Видавництво</label>
                        <input
                            placeholder="Видавництво..."
                            name="publisherSearch"
                            value={searchForm.publisherSearch}
                            onChange={handleSearchFormChange}
                        />
                    </div>
                </div>
                <p className={styles.searchHint}>
                    Заповніть поля вище, щоб автоматично підтягнути дані про книгу.
                </p>
                <button
                    className={styles.searchButton}
                    disabled={isLoading}
                    onClick={() => getBook(searchForm.authorSearch, searchForm.titleSearch, searchForm.publisherSearch)}
                >
                    Знайти та заповнити
                </button>
            </div>

            <div className={styles.card}>
                <p className={styles.formSectionLabel}>Інформація про книгу</p>
                <div className={styles.inputBlock}>

                    <div className={styles.leftBlock}>
                        <div className={styles.field}>
                            <label htmlFor="title">Назва книги</label>
                            <input id="title" name="title" value={addBookForm.title} onChange={handleAddFormChange} />
                        </div>
                        <div className={styles.field}>
                            <label htmlFor="author">Автор(и)</label>
                            <input id="author" name="authors" value={addBookForm.authors} onChange={handleAddFormChange} />
                        </div>
                        <div className={styles.field}>
                            <label htmlFor="genres">Жанр(и)</label>
                            <div
                                id="genres"
                                ref={dropdownGenres}
                                className={`${styles.genresContainer} ${openGenres ? styles.genresContainerOpen : ''}`}
                                onClick={() => setOpenGenres(!openGenres)}
                            >
                                <ChosenGenresList chosen={addBookForm.genres} variants={allGenres} isEditing={true} onRemove={removeGenre} />
                                {openGenres && <AdminGenresList variants={allGenres} onGenreClick={addGenre} />}
                            </div>
                        </div>
                        <div className={styles.field}>
                            <label htmlFor="isbn">ISBN</label>
                            <input id="isbn" maxLength={13} inputMode="numeric" type="text" name="isbn" value={addBookForm.isbn} onChange={handleAddFormChange} />
                        </div>
                        <div className={styles.field}>
                            <label htmlFor="language">Мова</label>
                            <input id="language" name="language" value={addBookForm.language} onChange={handleAddFormChange} />
                        </div>
                        <div className={styles.field}>
                            <label htmlFor="description">Опис</label>
                            <textarea id="description" rows={5} name="description" value={addBookForm.description} onChange={handleAddFormChange} />
                        </div>
                    </div>

                    <div className={styles.rightBlock}>
                        <div className={styles.field}>
                            <label htmlFor="cover_type">Тип обкладинки</label>
                            <input id="cover_type" name="cover_type" value={addBookForm.cover_type} onChange={handleAddFormChange} />
                        </div>
                        <div className={styles.field}>
                            <label htmlFor="publisher">Видавництво</label>
                            <input id="publisher" name="publisher" value={addBookForm.publisher} onChange={handleAddFormChange} />
                        </div>
                        <div className={styles.field}>
                            <label htmlFor="price">Ціна</label>
                            <input id="price" type="number" name="price" value={addBookForm.price} onChange={handleAddFormChange} />
                        </div>
                        <div className={styles.previewBlock}>
                            <div className={styles.previewBlockInput}>
                                <div className={styles.field}>
                                    <label htmlFor="quantity">Кількість</label>
                                    <input id="quantity" type="number" name="quantity" value={addBookForm.quantity} onChange={handleAddFormChange} />
                                </div>
                                <div className={styles.field}>
                                    <label htmlFor="pageCount">Кількість сторінок</label>
                                    <input id="pageCount" name="pages" value={addBookForm.pages} onChange={handleAddFormChange} />
                                </div>
                                <div className={styles.field}>
                                    <label htmlFor="imageUrl">Посилання на обкладинку</label>
                                    <input id="imageUrl" name="cover" value={addBookForm.cover} onChange={handleAddFormChange} />
                                </div>
                            </div>
                            <div className={styles.imageWrapper}>
                                {addBookForm.cover ?
                                    <img alt="bookCover" id="preview" src={addBookForm.cover} />
                                    :
                                    FALLBACK_COVER
                                }
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div className={styles.buttonContainer}>
                <button
                    className={styles.saveButton}
                    onClick={async () => {
                        const id = await addBook(addBookForm)
                        openModal("successBook", {
                            onAddAnother: () => {
                                setAddBookForm(initialBookForm)
                                setSearchForm(initialSearchForm)
                            },
                            onCheckAddedPage: () => navigate(`/books/${id}/`)
                        })
                    }}
                >
                    Зберегти книгу
                </button>
            </div>

        </div>
    )
}

export default AddBookPage;
