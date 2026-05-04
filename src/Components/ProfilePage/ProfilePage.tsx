import styles from "./ProfilePage.module.css"
import {Link, Outlet, useLocation} from "react-router";
import {useAuth} from "../../Contexts/AuthContext.ts";
import Header from "../Header/Header.tsx";
import ModalHost from "../ModalHost/ModalHost.tsx";

function ProfilePage() {
    const url = useLocation().pathname;
    const {isStaff, logout} = useAuth()
    return(
        <div>
            <Header />
            <div className={styles.container}>
                <div className={styles.sideBar}>
                    <div>
                        <Link to={isStaff ? "/admin/orders" : "/profile/"}>
                            <div
                                className={url === "/profile/" || url === "/admin/orders" ? `${styles.sideBarButton} ${styles.selected}` : styles.sideBarButton}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
                                     fill="none" stroke="#878a8a" strokeWidth="2" strokeLinecap="round"
                                     strokeLinejoin="round" className="lucide lucide-user-icon lucide-user">
                                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                                    <circle cx="12" cy="7" r="4"/>
                                </svg>
                                {isStaff ? "Переглянути замовлення" : "Профіль"}
                            </div>
                        </Link>
                        <Link to={isStaff ? "/admin/add/" : "/orders/"}>
                            <div
                                className={url === "/orders/" || url === "/admin/add/" ? `${styles.sideBarButton} ${styles.selected}` : styles.sideBarButton}>
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
                                {isStaff ? "Додати нову книгу" : "Історія замовлень"}
                            </div>
                        </Link>
                        {isStaff && (
                              <Link to={"admin/collections/add"}>
                                <div
                                    className={url === "/admin/collections/add" ? `${styles.sideBarButton} ${styles.selected}` : styles.sideBarButton}>
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
                                    Управління колекціями
                                </div>
                            </Link>
                        )}
                    </div>
                    <div className={styles.bottomButton} onClick={logout}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                             fill="none" stroke="currentColor"  strokeWidth="2" strokeLinecap="round"
                             strokeLinejoin="round" className="lucide lucide-log-out-icon lucide-log-out">
                            <path d="m16 17 5-5-5-5"/>
                            <path d="M21 12H9"/>
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        </svg>
                        Вийти
                    </div>
                </div>
                <div className={styles.content}>
                    <Outlet/>
                </div>
            </div>
            <ModalHost />
        </div>
    )
}

export default ProfilePage;