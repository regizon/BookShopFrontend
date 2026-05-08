import instance from "./httpClient.ts";
import type { Book } from "../models/book.ts";
import type {BookCollectionBody, Collection, CollectionBook} from "../models/collection.ts";

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

export { getCollections, getAllBooks, addBookToCollection, removeBookFromCollection, createCollection, deleteCollection };
