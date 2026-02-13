import instance from "./httpClient.ts"

function getDetails(id: string | undefined) {
    return (
        instance({
        url: `/books/${id}`,
        method: 'get'
        }).then((response) => {
            return response['data']
        })
    )
}

export default getDetails