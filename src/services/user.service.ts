import instance from "./httpClient.ts"
import {ENDPOINTS} from "./api.constants.ts"
import type {User} from "../models/user.ts";

function getUserProfile(){
    return instance({
        url: ENDPOINTS.USER.PROFILE,
        method: "GET",
        }
    ).then(response => {
        return response['data']
    })
}


function updateUserProfile(data: User | null){
    return instance({
        url: ENDPOINTS.USER.PROFILE,
        method: "PATCH",
        data: data
    }
    ).then(response => {
        return response['data']
    })
}

export {getUserProfile, updateUserProfile}