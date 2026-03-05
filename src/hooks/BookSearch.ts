import {useState, useEffect} from "react";
import {searchBook} from "../services/book.service.ts";
import type {Book} from "../models/book.ts";


export function useBookSearch(value:string, timeout:number) {
    const [response, setResponse] = useState<Book[]>([]);

    useEffect(() => {
        if(value.length > 0){
           const getBooks = setTimeout(async () => {
                setResponse(await searchBook(value));
                }, timeout)

            return () => {
                clearTimeout(getBooks)
            }
        }
    },[value])

    return response
}