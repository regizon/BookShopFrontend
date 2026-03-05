import styles from "./Header.module.css"
import logo from '/src/assets/logo.png'
import heart from '/src/assets/heart.png'
import profile from '/src/assets/profile.png'
import cart from '/src/assets/shopping-cart.png'
import {Link, useLocation} from "react-router";
import {useModal} from "../../Contexts/ModalContext.ts";
import {useAuth} from "../../Contexts/AuthContext.ts";
import { useNavigate } from "react-router"
import {useBookSearch} from "../../hooks/BookSearch.ts";
import {type SetStateAction, useEffect, useRef, useState} from "react";
import SearchResults from "../SearchResults/SearchResults.tsx";

function Header() {
    const {openModal} = useModal();
    const {isAuthenticated} = useAuth()
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState("");
    const [openMenu, setOpenMenu] = useState<boolean>();
    const foundBooks = useBookSearch(searchInput, 1000)
    const dropdownMenu = useRef(null)
    const location = useLocation()

    const closeMenu = (e) => {
        if(openMenu && !dropdownMenu.current?.contains(e.target)){
            setOpenMenu(false)
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown',closeMenu)

        return() => document.removeEventListener('mousedown',closeMenu)

    }, [openMenu])

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setOpenMenu(false)
    }, [location.pathname])

    return (

      <header>
        <div className={styles.headerInner}>
          <div className={styles.headerLeft}>
              <img src={logo}/>
              <Link to={"/"} className={styles.logoText}>
                  <span className={styles.blackText}>BOOK</span>
                  <span className={styles.blueText}>HEAVEN</span>
              </Link>
          </div>

          <div ref={dropdownMenu} className={`${styles.searchContainer} ${styles.headerCenter}`}>
              <input onChange = {(event: {target: { value: SetStateAction<string>}}) => { setSearchInput(event.target.value); setOpenMenu(true) }} placeholder={"Пошук книг, авторів, жанрів..."}/>
              {foundBooks.length > 0 && openMenu &&
                  <SearchResults bookList={foundBooks} />
              }
          </div>
          <div className={styles.headerRight}>
              <img className={styles.clickableIcon} src={profile} alt="user_profile" onClick={() =>
              {if(!isAuthenticated){
                  {openModal('login')}
              }else {
                  navigate("/profile/")
              }
              }}/>
              <img src={heart} alt="favorites"/>
              <img className={styles.clickableIcon} src={cart} alt="cart" onClick={() => {openModal('cart')}}/>
          </div>
        </div>
      </header>
    );
}

export default Header