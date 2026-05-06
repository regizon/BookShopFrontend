import instance from "./httpClient.ts"
import {ENDPOINTS} from "./api.constants.ts"
import type {orderDetails} from "../models/order.ts";

function createOrder(details: orderDetails){
    return (
        instance({
            url: ENDPOINTS.ORDERS.CREATE,
            method: 'POST',
            data: {"name": details.name,
                "surname": details.surname,
                // "phone": details.phone,
                // "email": details.email,
                "delivery_type": details.delivery_type,
                "payment_method": details.payment_method
            }
        }).then((response) => {
            if(response.status === 201){
                return true
            }
        })
    )
}


function ordersList(){
    return(
        instance({
            url: ENDPOINTS.ORDERS.LIST,
            method: 'GET',
        })
    ).then((response) => {
        return response['data']
    })
}

function getOrdersPreview(){
    return(
        instance({
            url: ENDPOINTS.ORDERS.PREVIEW,
            method: 'GET'
        })
    ).then((response) => {
        return response['data']
    })
}


export {createOrder, ordersList, getOrdersPreview};
