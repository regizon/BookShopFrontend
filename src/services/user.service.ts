import instance from "./httpClient.ts"
import {ENDPOINTS} from "./api.constants.ts"

function getuserProfile(){
    return instance({
        url: ENDPOINTS.USER.PROFILE,
        method: "GET",
        }
    ).then(response => {
        return response['data']
    })
}

export {getuserProfile}