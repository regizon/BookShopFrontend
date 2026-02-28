import instance from "./httpClient.ts"
import {ENDPOINTS} from "./api.constants.ts"
import type orderDetails from "../models/order.ts";

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

export {createOrder};
