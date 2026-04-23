import type Genre from "../../models/genre.ts";
import styles from "./AdminGenresList.module.css";

interface genresListProps {
    variants: Genre[];
    onGenreClick: (id: number) => void;
}

function AdminGenresList(props: genresListProps){
    return(
        <div className={styles.dropdown}>
            {props.variants.map(item => (
                <div key={item.id}>
                    <span onClick={() => props.onGenreClick(item.id)}>{item.name}</span>
                </div>
            ))}
        </div>
    )
}

export default AdminGenresList;