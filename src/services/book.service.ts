import instance from "./httpClient.ts"

function getAll() {
    return (
        instance({
        url: '/books',
        method: 'get'
        }).then((response) => {
            return response['data']
        })
    )
}

export default getAll