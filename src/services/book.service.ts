import instance from "./httpClient.ts"
import {ENDPOINTS} from "./api.constants.ts";

function getAll() {
    return (
        instance({
            url: ENDPOINTS.BOOKS.LIST,
            method: 'get'
        }).then((response) => {
            return response['data']
        })
    )
}

export default getAll