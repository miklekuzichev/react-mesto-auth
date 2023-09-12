import logo from '../images/logo.svg';
import { Link, useLocation } from 'react-router-dom';

function Header(props) {
    const { loggedIn, userEmail } = props;
    //const location = useLocation(); <div className="header__sign">Войти</div>

    return (
        <header className="header">
            <img src={logo} alt="Лого шапки сайта" className="header__logo"/>
 
            <nav className="header__navigate">
                <label className="header__label">{userEmail}</label>
                <button className="header__sign-out">Выйти
                </button>
        </nav>
        </header>
    );
}

export default Header;
