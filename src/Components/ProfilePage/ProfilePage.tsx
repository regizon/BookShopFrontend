import styles from "./ProfilePage.module.css"
import {Link, Outlet, useLocation} from "react-router";

function ProfilePage() {
    const url = useLocation().pathname;
    return(
        <div>
            <div className={styles.container}>
                    <div className={styles.sideBar}>
                        <div>
                            <Link to={"profile/"}>
                                <div className={url === "/profile/" ? `${styles.sideBarButton} ${styles.selected}` : styles.sideBarButton}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#878a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-icon lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                Профіль
                                </div>
                            </Link>
                            <Link to={"orders/"}>
                                <div className={url === "/orders/" ? `${styles.sideBarButton} ${styles.selected}` : styles.sideBarButton}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
                                         fill="none" stroke="#878a8a" strokeWidth="2" strokeLinecap="round"
                                         strokeLinejoin="round"
                                         className="lucide lucide-clipboard-list-icon lucide-clipboard-list">
                                        <rect width="8" height="4" x="8" y="2" rx="1" ry="1"/>
                                        <path
                                            d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                                        <path d="M12 11h4"/>
                                        <path d="M12 16h4"/>
                                        <path d="M8 11h.01"/>
                                        <path d="M8 16h.01"/>
                                    </svg>
                                    Історія замовлень
                                </div>
                            </Link>
                        </div>
                    </div>
                <div className={styles.content}>
                    <Outlet/>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage;