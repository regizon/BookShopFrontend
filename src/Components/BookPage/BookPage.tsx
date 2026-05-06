import { useParams, useNavigate } from "react-router";
import {useEffect, useState} from "react";
import getDetails, {patchBook, deleteBook} from "../../services/bookDetails.service";
import type {BookAllInfo, BookPatchPayload} from "../../models/book.ts";
import BookDetails from "../BookDetails/BookDetails.tsx";
import {isAxiosError} from "axios";
import {useAuth} from "../../Contexts/AuthContext.ts";
import styles from "./BookPage.module.css"

function BookPage(){
    const [info, setInfo] = useState<BookAllInfo>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorCode, setErrorCode] = useState<number | null>(null);
    const [editError, setEditError] = useState<string | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const params = useParams();
    const navigate = useNavigate();
    const {isStaff} = useAuth();

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

    async function handleSave(fields: BookPatchPayload) {
        setEditError(null);
        try {
            const updated = await patchBook(params.bookId, fields);
            setInfo(updated);
        } catch (error) {
            const message = isAxiosError(error)
                ? `Save failed (${error.response?.status ?? 'network error'})`
                : 'Save failed';
            setEditError(message);
            throw error;
        }
    }

    async function handleDelete() {
        setDeleteError(null);
        try {
            await deleteBook(params.bookId);
            navigate('/');
        } catch (error) {
            const message = isAxiosError(error)
                ? `Delete failed (${error.response?.status ?? 'network error'})`
                : 'Delete failed';
            setDeleteError(message);
        }
    }

    if(isLoading){
        return(
            <div className={styles.content}>
                <div className={styles.loader}></div>
                <h3>Завантажуюсь...</h3>
            </div>
        )
    }
    else {
        if(info){
            return (
                <BookDetails
                    book={info}
                    isStaff={isStaff}
                    onSave={handleSave}
                    onDelete={handleDelete}
                    editError={editError}
                    deleteError={deleteError}
                />
            )
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
