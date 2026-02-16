import instance from "./httpClient.ts"
import {ENDPOINTS} from "./api.constants.ts";


function getCart() {
    return (
        instance({
        url: ENDPOINTS.CART.VIEW,
        method: 'get'
        }).then((response) => {
            return response['data']
        })
    )
}

function addItemToCart(bookId: number){
    return(
        instance({
            url: ENDPOINTS.CART.ADD,
            method: 'post',
            data: {"book": bookId}
        }).then((response) => {
            return response['data']
        })
    )
}


function deleteFromCart(cartItemId: number){
    return(
        instance({
            url: ENDPOINTS.CART.DELETE(cartItemId),
            method: 'delete',
        })
    )
}

function removeItemFromCart(bookId: number){
    return(
        instance({
            url: ENDPOINTS.CART.REMOVE,
            method: 'delete',
            data: {"book": bookId}
        })
    )
}



export  {getCart, addItemToCart, deleteFromCart, removeItemFromCart};