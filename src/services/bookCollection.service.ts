import instance from "./httpClient.ts";
import type { Book } from "../models/book.ts";
import type {BookCollectionBody, Collection} from "../models/collection.ts";



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

export { getCollections, getAllBooks, addBookToCollection, removeBookFromCollection };
