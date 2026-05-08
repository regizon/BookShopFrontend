import instance from "./httpClient.ts";
import type { Book } from "../models/book.ts";
import type {BookCollectionBody, Collection, CollectionBook} from "../models/collection.ts";
import {ENDPOINTS} from "./api.constants.ts";
import type {BookFilters, PaginatedResponse} from "./book.service.ts";

export type { Collection, CollectionBook };



function getCollections(): Promise<Collection[]> {
    return instance({
        url: '/books/collections/',
        method: 'get',
    }).then((response) => response.data);
}

function getAllBooks(): Promise<Book[]> {
    return instance({
        url: '/books/',
        method: 'get',
    }).then((response) => response.data);
}

function addBookToCollection(data: BookCollectionBody): Promise<void> {
    return instance({
        url: '/books/collections/book-collections/',
        method: 'post',
        data,
    }).then((response) => response.data);
}

function removeBookFromCollection(data: BookCollectionBody): Promise<void> {
    return instance({
        url: '/books/collections/book-collections/',
        method: 'delete',
        data,
    }).then((response) => response.data);
}

function createCollection(name: string): Promise<Collection> {
    return instance({
        url: '/books/collections/',
        method: 'post',
        data: { name },
    }).then((response) => response.data);
}

function deleteCollection(id: number): Promise<void> {
    return instance({
        url: `/books/collections/${id}/`,
        method: 'delete',
    }).then((response) => response.data);
}

function getAllByCollection(slug: string | undefined, filters?: BookFilters, page?: number): Promise<PaginatedResponse<Book>> {
    const params = new URLSearchParams();
    filters?.authors?.forEach(a => params.append('authors', a));
    filters?.languages?.forEach(l => params.append('language', l));
    filters?.cover_types?.forEach(ct => params.append('cover_type', ct));
    if (filters?.min_price !== undefined) params.append('min_price', String(filters.min_price));
    if (filters?.max_price !== undefined) params.append('max_price', String(filters.max_price));
    if (page !== undefined && page > 1) params.append('page', String(page));

    return instance({
        url: ENDPOINTS.COLLECTIONS.BY_SLUG(slug),
        params,
        method: 'get',
    }).then((response) => {
        const raw = response.data;
        if (Array.isArray(raw)) {
            return { count: raw.length, next: null, previous: null, results: raw } as PaginatedResponse<Book>;
        }
        return raw as PaginatedResponse<Book>;
    });
}

function getCollectionFilters(slug: string) {
    return instance({
        url: ENDPOINTS.COLLECTIONS.FILTERS(slug),
        method: 'get',
    }).then(response => response.data);
}

export { getCollections, getAllBooks, addBookToCollection, removeBookFromCollection, createCollection, deleteCollection, getAllByCollection, getCollectionFilters };
