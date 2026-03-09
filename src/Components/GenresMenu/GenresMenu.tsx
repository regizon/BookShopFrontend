import {getGenres} from "../../services/book.service.ts";
import styles from "./GenresMenu.module.css";
import {useEffect, useState} from "react";
import {Link} from "react-router";

interface Genre {
    name: string;
    slug: string;
}

function GenresMenu() {

    const [genreList, setGenreList] = useState<Genre[]>([]);
    async function collectGenres() {
        const genres = await getGenres()
        console.log(genres)
        setGenreList(genres)
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        collectGenres()
    }, [])

    return (
        <div className={styles.content}>
            {genreList.map(item => (
                <div className={styles.genre}>
                    <Link to={`/books/category/${item.slug}`}>{item.name}</Link>
                </div>
            ))}
        </div>
    )
}

export default GenresMenu