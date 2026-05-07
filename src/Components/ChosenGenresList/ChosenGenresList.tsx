import styles from "./ChosenGenresList.module.css"
import type Genre from "../../models/genre.ts";
import {Link} from "react-router";

interface GenresProps {
    chosen: number[];
    variants: Genre[];
    isEditing: boolean;
    onRemove?: (id: number) => void;
}

function ChosenGenresList({ chosen, variants, isEditing, onRemove }: GenresProps) {
    return (
        <>
            {chosen.map(item => {
                const genre = variants.find(g => g.id === item)
                return genre && (
                    <div className={styles.genreTag} key={genre.id}>
                        {isEditing ? (
                            <span>{genre.name}</span>
                        ) : (
                            <Link className={styles.genreTagLink} to={`/books/category/${genre.slug}/`}>
                                {genre.name}
                            </Link>
                        )}
                        {isEditing && (
                            <svg
                                onClick={(e) => { e.stopPropagation(); onRemove?.(genre.id) }}
                                xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                strokeLinejoin="round" className="lucide lucide-x-icon lucide-x"
                            >
                                <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                            </svg>
                        )}
                    </div>
                )
            })}
        </>
    )
}

export default ChosenGenresList
