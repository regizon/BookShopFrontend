export interface Book {
    id: number;
    title: string;
    price: number;
    cover: string;
    author_read: string[];
    quantity: number;
}

export interface BookAllInfo extends Book {
    description: string;
    genres_read: string[];
    pages: number;
    publisher_read: string;
    publisher: number,
    cover_type: string;
    language: string;
    isbn: string;
}

// Payload for PATCH /books/<pk>/: publisher and authors are write-only name fields on the backend
export interface BookPatchPayload extends Partial<Omit<BookAllInfo, 'publisher' | 'genres_read'>> {
    publisher?: string;
    authors?: string[];
    genres?: number[];
}

export interface BookOrderPreview extends Book {
    author: string;
    cover: string;
    title: string;
    item: Book;
}