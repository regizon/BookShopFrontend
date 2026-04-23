export interface Book {
    id: number;
    title: string;
    price: number;
    cover: string;
    author_read: string;
    quantity: number;
}

export interface BookAllInfo extends Book {
    description: string;
    genres: string[];
    pages: number;
    publisher: string;
    coverType: string;
    language: string;
    isbn: number;
}

export interface BookOrderPreview {
    author: string;
    cover: string;
    title: string;
    item: Book;
}