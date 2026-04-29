import type {BookAllInfo} from "../models/book.ts"
import instance from "./httpClient.ts";
import {ENDPOINTS} from "./api.constants.ts";
type BookForm = Omit<BookAllInfo, "id">;

function addBook(data: BookForm){
    return(
        instance({
            url: ENDPOINTS.BOOKS.LIST,
            method: 'post',
            data: data
        }).then((response) => {
            console.log(response)
            return response['data']['id']
        }).catch((error) => {
                if (error.response){
                    console.log(error.response.data)
                }else if(error.request){
                    console.log(error.request)
                }
            }
        )
    )
}

export {addBook}