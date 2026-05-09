import type { Book } from './book.ts';

export type CollectionBook = Book;

export interface Collection {
    id: number;
    name: string;
    slug: string;
    books: CollectionBook[];
}

export interface BookCollectionBody {
    book: number;
    collection: number;
}