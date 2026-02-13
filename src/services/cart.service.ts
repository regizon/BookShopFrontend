import instance from "./httpClient.ts"

function getCart() {
    return (
        instance({
        url: '/cart/view/',
        method: 'get'
        }).then((response) => {
            return response['data']
        })
    )
}

function addItemToCart(bookId: number){
    return(
        instance({
            url: '/cart/add/',
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
            url: `/cart/delete/${cartItemId}`,
            method: 'delete',
        })
    )
}

function removeItemFromCart(bookId: number){
    return(
        instance({
            url: '/cart/delete/',
            method: 'delete',
            data: {"book": bookId}
        })
    )
}



export  {getCart, addItemToCart, deleteFromCart, removeItemFromCart};