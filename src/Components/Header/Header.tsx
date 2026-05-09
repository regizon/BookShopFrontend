import styles from "./Header.module.css"
import logo from '/src/assets/logo.png'
import profile from '/src/assets/profile.png'
import cart from '/src/assets/shopping-cart.png'
import {Link, useLocation} from "react-router";
import {useModal} from "../../Contexts/ModalContext.ts";
import {useAuth} from "../../Contexts/AuthContext.ts";
import { useNavigate } from "react-router"
import {useBookSearch} from "../../hooks/BookSearch.ts";
import {type SetStateAction, useEffect, useRef, useState} from "react";
import SearchResults from "../SearchResults/SearchResults.tsx";
import GenresMenu from "../GenresMenu/GenresMenu.tsx";
import {useCart} from "../../Contexts/CartContext.ts";

function Header() {
    const {openModal} = useModal();
    const {resetLogout, isStaff} = useAuth()
    const {items} = useCart()
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState("");
    const [openSearchMenu, setOpenSearchMenu] = useState<boolean>();
    const [openGenresMenu, setOpenGenresMenu] = useState<boolean>(false);
    const foundBooks = useBookSearch(searchInput, 1000)
    const dropdownSearchMenu = useRef(null)
    const dropdownGenresMenu = useRef(null)
    const location = useLocation()

    const closeSearchMenu = (e) => {
        if(openSearchMenu && !dropdownSearchMenu.current?.contains(e.target)){
            setOpenSearchMenu(false)
        }
    }

    const closeGenresMenu = (e) => {
        if(openGenresMenu && !dropdownGenresMenu.current?.contains(e.target)){
            setOpenGenresMenu(false)
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown',closeSearchMenu)

        return() => document.removeEventListener('mousedown',closeSearchMenu)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openSearchMenu])

    useEffect(() => {
        setOpenSearchMenu(false)
    }, [location.pathname])

    useEffect(() => {
        document.addEventListener('mousedown', closeGenresMenu)
        return() => document.removeEventListener('mousedown',closeGenresMenu)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openGenresMenu])

    return (

      <header>
        <div className={styles.headerInner}>
          <div className={styles.headerLeft}>
              <img src={logo}/>
              <Link to={"/"} className={styles.logoText}>
                  <span className={styles.blackText}>BOOK</span>
                  <span className={styles.blueText}>HEAVEN</span>
              </Link>
              <div className={styles.relativeElement} onClick={() => setOpenGenresMenu(!openGenresMenu)} ref={dropdownGenresMenu}>
                  <div className={styles.categoryButtonContainer} >
                      <div>Всі категорії</div>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                           stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                           className="lucide lucide-chevron-down-icon lucide-chevron-down">
                          <path d="m6 9 6 6 6-6"/>
                      </svg>
                  </div>
                  {openGenresMenu &&
                    <GenresMenu/>
                  }
              </div>
          </div>

            <div ref={dropdownSearchMenu} className={`${styles.searchContainer} ${styles.headerCenter}`}>
                <input onChange={(event: { target: { value: SetStateAction<string> } }) => {
                    setSearchInput(event.target.value);
                    setOpenSearchMenu(true)
                }} placeholder={"Уведіть назву книги"}/>
              {foundBooks.length > 0 && openSearchMenu &&
                  <SearchResults bookList={foundBooks} />
              }
          </div>
          <div className={styles.headerRight}>
              <img className={styles.clickableIcon} src={profile} alt="user_profile" onClick={() => {
                  resetLogout()
                  navigate(isStaff ? "/admin/orders/" : "/profile/")
              }}/>

              <div className={styles.cartWrapper}>
                  <img className={styles.clickableIcon} src={cart} alt="cart" onClick={() => {openModal('cart')}}/>
                  {items.length > 0 && <span className={styles.cartBadge}>{items.length}</span>}
              </div>
          </div>
        </div>
      </header>
    );
}

export default Header