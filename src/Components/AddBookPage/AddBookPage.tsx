import styles from "./AddBookPage.module.css"
import {useState, type ChangeEvent, useEffect, useRef} from "react";
import parseBook from "../../services/parseBook.service.ts";
import {addBook} from "../../services/admin.service.ts";
import ChosenGenresList from "../ChosenGenresList/ChoosedGenresList.tsx";
import {getGenres} from "../../services/book.service.ts";
import AdminGenresList from "../AdminGenresList/AdminGenresList.tsx";
import type Genre from "../../models/genre.ts";

const languageVariations: Record<string, string> = {
    "uk": "Українська",
    "en": "Англійська",
    "ru": "Російська"
}


function AddBookPage() {

    const [searchForm, setSearchForm] = useState({
        titleSearch: "",
        authorSearch: "",
        publisherSearch: "",
    })

    const [openGenres, setOpenGenres] = useState<boolean>(false)
    const [allGenres, setAllGenres] = useState<Genre[]>([]);
    const dropdownGenres = useRef(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [addBookForm, setAddBookForm] = useState({
        title: "",
        authors: "",
        publisher: "",
        genres: [] as number[],
        pages: "",
        isbn: "",
        language: "",
        description: "",
        coverType: "",
        price: "",
        quantity: "",
        cover: ""
    })

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
                    coverType: "Тверда"
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
        setSearchForm({
            ...searchForm,
            [name] : value
        });
    };

    const handleAddFormChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>{
        const {name, value} = event.target;
        setAddBookForm({
            ...addBookForm,
            [name] : value
        });
    };
    return(

        <div className={styles.content}>
            <>{console.log(openGenres)}</>
            {isLoading ?
                <div className={styles.loaderContainer}>
                    <div>
                        <span className={styles.loader}></span>
                    </div>
                    <span>Шукаємо інформацію про книгу...</span>
                </div>
            :
                null
            }
            <h1 className={styles.caption}>Додати нову книгу</h1>
            <div className={styles.formWrapper}>
                <div className={styles.searchContainer}>
                    <input placeholder={"Назва"} name="titleSearch" value={searchForm.titleSearch} onChange={handleSearchFormChange}/>
                    <input placeholder={"Автор"} name="authorSearch" value={searchForm.authorSearch} onChange={handleSearchFormChange}/>
                    <input placeholder={"Видавництво"} name="publisherSearch" value={searchForm.publisherSearch} onChange={handleSearchFormChange}/>
                    <span>Ви можете знайти книгу за назвою, щоб автоматично заповнити частину полів нижче.</span>
                    <button disabled={isLoading} onClick={() => {getBook(searchForm.authorSearch, searchForm.titleSearch, searchForm.publisherSearch)}}>Пошук</button>
                </div>
                <hr/>
                <div className={styles.inputBlock}>
                    <div className={styles.leftBlock}>
                        <label htmlFor={"title"}>Назва книги</label>
                        <input id={"title"} name={"title"} value={addBookForm.title} onChange={handleAddFormChange}/>
                        <label htmlFor={"author"}>Автор(и)</label>
                        <input id={"author"} name={"author"} value={addBookForm.authors} onChange={handleAddFormChange}/>
                        <label htmlFor={"genres"}>Жанр(и)</label>
                        <div id={"genres"} ref={dropdownGenres} className={styles.genresContainer} onClick={() => setOpenGenres(!openGenres)}>
                            <ChosenGenresList chosen={addBookForm.genres} variants={allGenres} onGenreRemove={removeGenre}/>
                            {openGenres && <AdminGenresList variants={allGenres} onGenreClick={addGenre} />}
                        </div>
                        <label htmlFor={"isbn"}>ISBN</label>
                        <input id={"isbn"} maxLength={13} inputMode={"numeric"} type={"text"} name={"isbn"} value={addBookForm.isbn} onChange={handleAddFormChange}/>
                        <label htmlFor={"language"}>Мова</label>
                        <input id={"language"} name={"language"} value={addBookForm.language} onChange={handleAddFormChange}/>
                        <label htmlFor={"description"}>Опис</label>
                        <textarea id={"description"} rows={5} name={"description"} value={addBookForm.description} onChange={handleAddFormChange}/>
                    </div>
                    <div className={styles.rightBlock}>
                        <label htmlFor={"coverType"}>Тип обкладинки</label>
                        <input id={"coverType"} name={"coverType"} value={addBookForm.coverType} onChange={handleAddFormChange}/>
                        <label htmlFor={"publisher"}>Видавництво</label>
                        <input id={"publisher"} name={"publisher"} value={addBookForm.publisher} onChange={handleAddFormChange}/>
                        <label htmlFor={"price"}>Ціна</label>
                        <input id={"price"} type={"number"} name={"price"} value={addBookForm.price} onChange={handleAddFormChange}/>
                        <div className={styles.previewBlock}>
                            <div className={styles.previewBlockInput}>
                                <label htmlFor={"quantity"}>Кількість</label>
                                <input id={"quantity"} type={"number"} name={"quantity"} value={addBookForm.quantity} onChange={handleAddFormChange}/>
                                <label htmlFor={"pageCount"}>Кількість сторінок</label>
                                <input id={"pageCount"} name={"pages"} value={addBookForm.pages} onChange={handleAddFormChange}/>
                                <label htmlFor={"imageUrl"}>Посилання на обкладинку</label>
                                <input id={"imageUrl"} name={"cover"} value={addBookForm.cover} onChange={handleAddFormChange}/>
                            </div>
                            <div className={styles.imageWrapper}>
                                <img alt={"bookCover"} id={"preview"}
                                     src={addBookForm.cover ? addBookForm.cover : "data:image/jpeg;base64,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"}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.buttonContainer}>
                <button className={styles.saveButton} onClick={async () => {
                    await addBook(addBookForm)
                }}>Зберегти книгу</button>
            </div>
        </div>
    )
}

export default AddBookPage;