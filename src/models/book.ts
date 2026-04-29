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
    publisher_read: string;
    publisher: number,
    cover_type: string;
    language: string;
    isbn: number;
}

export interface BookOrderPreview extends Book {
    author: string;
    cover: string;
    title: string;
    item: Book;
}