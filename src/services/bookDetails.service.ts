import instance from "./httpClient.ts"
import {ENDPOINTS} from "./api.constants.ts";
import type {BookAllInfo, BookPatchPayload} from "../models/book.ts";

function getDetails(id: string | undefined) {
    return (
        instance({
        url: ENDPOINTS.BOOKS.DETAIL(id),
        method: 'get'
        }).then((response) => {
            return response['data']
        })
    )
}

export function patchBook(id: string | undefined, fields: BookPatchPayload) {
    return instance({
        url: ENDPOINTS.BOOKS.DETAIL(id),
        method: 'patch',
        data: fields,
    }).then((response) => response.data as BookAllInfo)
}

export function deleteBook(id: string | undefined) {
    return instance({
        url: ENDPOINTS.BOOKS.DETAIL(id),
        method: 'delete',
    }).then((response) => response.data as BookAllInfo)
}

export default getDetails