import "./BookCard.css"
import AddToCartButton from "../AddToCartButton/AddToCartButton.tsx";

interface Book {
    id: number;
    cover: string;
    title: string;
    author: string;
    price: number;
}

interface BookCardProps {
    book: Book;
}

function BookCard({ book }:BookCardProps) {
    return (
        <div className={"card_container"}>
            <div className={"image_wrapper"}>
                <img src={book.cover}/>
            </div>
            <span className={"book_title"}>{book.title}</span>
            <span className={"author_name"}>{book.author}</span>
            <span className={"price"}>{book.price} ₴</span>
            <AddToCartButton/>
        </div>
    )
}

export default BookCard