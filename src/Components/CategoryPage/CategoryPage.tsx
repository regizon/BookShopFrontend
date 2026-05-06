import {useParams} from "react-router";
import {useEffect, useState} from "react";
import type {Book} from "../../models/book.ts";
import {isAxiosError} from "axios";
import {getAllByGenre} from "../../services/book.service.ts";
import BookCard from "../BookCard/BookCard.tsx";

function CategoryPage() {
    const params = useParams();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorCode, setErrorCode] = useState<number | null>(null);
    const [bookList, setBookList] = useState<Book[]>([]);
    useEffect(() => {
        async function getData(){
            try{
                const data = await getAllByGenre(params.slug)
                setBookList(data)
                setIsLoading(false);
            }

        catch(error){
            if(error && isAxiosError(error)){
                const code = error.response?.status
                if(code){
                    setErrorCode(code)
                    console.log(code)
                }
                setIsLoading(false);
            }
        }
        }

        getData();
  }, [params.slug])
    if(isLoading){
        return(<div>
            <h1>Loading...</h1>
        </div>)
    }else{
        if(bookList){
                if(bookList.length > 0){
               return (
                    <div style={{display: 'flex', gap: '20px', padding: '20px'}}>
                        {bookList.map(item => (
                            <BookCard key={item.id} book={item}/>
                        ))}
                    </div>
                )
            }else{
                return(
                    <h1>Отакої, в нас ще немає книг цього жанру</h1>
                )
            }
        }else if(errorCode == 404){
            return(<h1>Ви намагаєтесь потрапити кудись не туди</h1>)
        }else if(errorCode == 500){
            return(<h1>На сервері сталася помилка</h1>)
        }
    }
}

export default CategoryPage;