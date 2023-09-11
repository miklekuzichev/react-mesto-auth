import logo from '../images/logo.svg';

function Header(props) {
    const { loggedIn } = props;
    return (
        <header className="header">
            <img src={logo} alt="Лого шапки сайта" className="header__logo"/>
            <div className="header__sign">Войти</div>
        </header>
    );
}

export default Header;
