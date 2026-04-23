import type {BookAllInfo} from "../models/book.ts"
import instance from "./httpClient.ts";
import {ENDPOINTS} from "./api.constants.ts";
type BookForm = Omit<BookAllInfo, "id">;

function addBook(data: BookForm){
    const {coverType, ...rest} = data
    const requestData = {...rest, cover_type: coverType}

    return(
        instance({
            url: ENDPOINTS.BOOKS.LIST,
            method: 'post',
            data: requestData
        }).then((response) => {
            console.log(response)
            console.log(response['data'])
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