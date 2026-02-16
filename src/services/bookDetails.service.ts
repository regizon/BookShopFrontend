import instance from "./httpClient.ts"
import {ENDPOINTS} from "./api.constants.ts";

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

export default getDetails