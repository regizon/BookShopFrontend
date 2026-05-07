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

function searchBook(title: string){
    return(
        instance({
            url: ENDPOINTS.BOOKS.LIST,
            params: {
                search: title
            },
            method: 'get'
        }).then((response) => {
            return response['data']
        })
    )
}

export interface BookFilters {
    authors?: string[];
    languages?: string[];
    cover_types?: string[];
    min_price?: number;
    max_price?: number;
}

function getAllByGenre(slug: string | undefined, filters?: BookFilters){
    const params = new URLSearchParams();
    filters?.authors?.forEach(a => params.append('authors', a));
    filters?.languages?.forEach(l => params.append('language', l));
    filters?.cover_types?.forEach(ct => params.append('cover_type', ct));
    if (filters?.min_price !== undefined) params.append('min_price', String(filters.min_price));
    if (filters?.max_price !== undefined) params.append('max_price', String(filters.max_price));

    return(
        instance({
            url: ENDPOINTS.BOOKS.CATEGORY_LIST(slug),
            params,
            method: 'get'
        }).then((response) => {
            return response['data']
        })
    )
}

function getCategoryFilters(slug: string) {
    return instance({
        url: ENDPOINTS.BOOKS.CATEGORY_FILTERS(slug),
        method: 'get',
    }).then(response => response.data)
}

function getGenres(){
    return (
        instance({
            url: ENDPOINTS.BOOKS.GENRES,
            method: 'get'
        }).then((response) => {
            return response['data']
        })
    )
}

export {getAll, getGenres, searchBook, getAllByGenre, getCategoryFilters}