import "./Header.css"
import logo from '/src/assets/logo.png'
import heart from '/src/assets/heart.png'
import profile from '/src/assets/profile.png'
import cart from '/src/assets/shopping-cart.png'

function Header() {
    return (
      <header>
          <div className={"header_left"}>
              <img src={logo}/>
              <span className={"logo_text"}>
                  <span className={"black_text"}>BOOK</span>
                  <span className={"blue_text"}>HEAVEN</span>
              </span>
          </div>

          <div className={"search_container header_center"}>
              <input placeholder={"Пошук книг, авторів, жанрів..."}/>
          </div>

          <div className={"header_right"}>
              <img src={profile} alt="user_profile" />
              <img src={heart} alt="favorites"/>
              <img src={cart} alt="cart"/>

          </div>
      </header>
    );
}

export default Header