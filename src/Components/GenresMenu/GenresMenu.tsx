import {getGenres} from "../../services/book.service.ts";
import styles from "./GenresMenu.module.css";
import {useEffect, useState} from "react";
import {Link} from "react-router";
import type Genre from "../../models/genre.ts";


function GenresMenu() {

    const [genreList, setGenreList] = useState<Genre[]>([]);
    async function collectGenres() {
        const genres = await getGenres()
        setGenreList(genres)
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        collectGenres()
    }, [])

    return (
        <div className={styles.content}>
            {genreList.map(item => (
                <div className={styles.genre} key={item.name}>
                    <Link to={`/books/category/${item.slug}`}>{item.name}</Link>
                </div>
            ))}
        </div>
    )
}

export default GenresMenu