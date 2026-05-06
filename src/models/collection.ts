import type { Book } from './book.ts';

export interface CollectionBook extends Book {}

export interface Collection {
    id: number;
    name: string;
    books: CollectionBook[];
}

export interface BookCollectionBody {
    book: number;
    collection: number;
}