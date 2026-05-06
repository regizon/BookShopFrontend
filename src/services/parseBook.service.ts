import {ENDPOINTS} from "./api.constants.ts";
import instance from "./httpClient.ts";

export default function parseBook(author: string, title: string, publisher: string) {
    return(
        instance({
            url: ENDPOINTS.BOOKS.PARSE,
            method: "get",
            params: {
                "title" : title,
                "author": author,
                "publisher": publisher
            },
            timeout: 5000
        }).then((response) => {
            return response['data']
        })
    )
}