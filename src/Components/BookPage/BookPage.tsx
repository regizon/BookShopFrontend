import { useParams } from "react-router";
import {useEffect, useState} from "react";
import getDetails from "../../services/bookDetails.service";
import type {BookAllInfo} from "../../models/book.ts";
import BookDetails from "../BookDetails/BookDetails.tsx";
import {isAxiosError} from "axios";


function BookPage(){
    const [info, setInfo] = useState<BookAllInfo>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorCode, setErrorCode] = useState<number | null>(null);
    const params = useParams();
    useEffect(() => {
        async function getData(){
            try{
                const data = await getDetails(params.bookId)
                setInfo(data)
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
  }, [params.bookId])

    if(isLoading){
        return(
            <div><h1>I'm loading</h1></div>
        )
    }
    else {
        if(info){
            return <BookDetails book={info}/>
        }
        else if(errorCode === 404) {
            return (<div><h1>Error! This book is deleted</h1></div>)
        }
        else if(errorCode === 500) {
            return (<div><h1>Error! internal server error</h1></div>)
        }
    }
}

export default BookPage;