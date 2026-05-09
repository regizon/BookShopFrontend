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

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

function getAllByGenre(slug: string | undefined, filters?: BookFilters, page?: number){
    const params = new URLSearchParams();
    filters?.authors?.forEach(a => params.append('authors', a));
    filters?.languages?.forEach(l => params.append('language', l));
    filters?.cover_types?.forEach(ct => params.append('cover_type', ct));
    if (filters?.min_price !== undefined) params.append('min_price', String(filters.min_price));
    if (filters?.max_price !== undefined) params.append('max_price', String(filters.max_price));
    if (page !== undefined && page > 1) params.append('page', String(page));

    return(
        instance({
            url: ENDPOINTS.BOOKS.CATEGORY_LIST(slug),
            params,
            method: 'get'
        }).then((response) => {
            const raw = response.data;
            // Normalise: the backend may return a paginated envelope
            // { count, next, previous, results } OR (if pagination middleware
            // hasn't reloaded yet) the legacy flat array.  Always produce a
            // PaginatedResponse so callers never receive undefined.results.
            if (Array.isArray(raw)) {
                return {
                    count: raw.length,
                    next: null,
                    previous: null,
                    results: raw,
                } as PaginatedResponse<import('../models/book').Book>;
            }
            return raw as PaginatedResponse<import('../models/book').Book>;
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