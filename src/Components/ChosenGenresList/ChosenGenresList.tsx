import styles from "./ChosenGenresList.module.css"

interface Genre {
    "id": number;
    "name": string;
}

interface GenresProps {
    chosen: number[],
    variants: Genre[],
    // onGenreAdd: (id: number) => void,
    onGenreRemove: (id: number) => void
}

function ChosenGenresList(data: GenresProps){
    return(
        <>
            {
                data.chosen.map(item => {
                    const genre = data.variants.find(g => g.id === item)
                    return genre && (
                        <div className={styles.genreTag} key={genre.id}>
                            {genre.name}
                            <svg onClick={(e) => {e.stopPropagation(); data.onGenreRemove(genre.id)}} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                       fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                       strokeLinejoin="round" className="lucide lucide-x-icon lucide-x"><path
                                d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                        </div>
                    )
                    }
                )
            }
        </>
    )
}

export default ChosenGenresList