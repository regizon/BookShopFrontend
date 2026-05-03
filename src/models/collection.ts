export interface CollectionBook {
    id: number;
    title: string;
    author_read: string | string[];
    cover: string;
}

export interface Collection {
    id: number;
    name: string;
    books: CollectionBook[];
}

export interface BookCollectionBody {
    book: number;
    collection: number;
}