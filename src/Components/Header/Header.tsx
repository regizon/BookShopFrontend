import styles from "./Header.module.css"
import logo from '/src/assets/logo.png'
import heart from '/src/assets/heart.png'
import profile from '/src/assets/profile.png'
import cart from '/src/assets/shopping-cart.png'
import {Link} from "react-router";
import {useModal} from "../../Contexts/ModalContext.ts";
import {useAuth} from "../../Contexts/AuthContext.ts";
import { useNavigate } from "react-router"


function Header() {

    const {openModal} = useModal();
    const {isAuthenticated} = useAuth()
    const navigate = useNavigate();

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

          <div className={`${styles.searchContainer} ${styles.headerCenter}`}>
              <input placeholder={"Пошук книг, авторів, жанрів..."}/>
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