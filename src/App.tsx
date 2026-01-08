import './App.css'
import { useState, useEffect } from 'react';
import Header from "./Components/Header/Header.tsx";
import BookCard from "./Components/BookCard/BookCard.tsx";
import getAll from "./services/book.service.ts";


interface Book {
    id: number;
    title: string;
    price: number;
    cover: string;
    author: string;
}


function App() {

  const [books, setBooks] = useState<Book[]>([])

  useEffect(() => {
    getAll().then((res) => {
        setBooks(res)
    })
  }, [])

    return (

      <div className={"app"}>

        <Header/>
          <div style={{display: 'flex', gap: '20px', padding: '20px'}}>
              {books.map(item => (
                  <BookCard key={item.id} book={item}/>
              ))}
          </div>
      </div>
  )
}

export default App
