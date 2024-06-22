import { useState } from "react";
import { Link } from "react-router-dom"; // React Router의 Link 컴포넌트를 사용합니다.

const headerNav = [
    {
        title: "intro",
        url: "/#intro" // URL을 적절히 수정합니다.
    },
    {
        title: "news",
        url: "/#news" // URL을 적절히 수정합니다.
    }
];

const Header = () => {
    const [show, setShow] = useState(false);

    const toggleMenu = () => {
        setShow((prevShow) => !prevShow);
    };

    return (
        <header id="header" role="banner">
            <div className="header__inner">
                <div className="header__logo">
                    <Link to="/">Homepage<em>three.js</em></Link>
                </div>
                <nav className={`header__nav ${show ? "show" : ""}`} role="navigation" aria-label="메인 메뉴">
                    <ul>
                        {headerNav.map((nav, key) => (
                            <li key={key}>
                                <Link to={nav.url}>{nav.title}</Link>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div
                    className="header__nav__mobile"
                    id="headerToggle"
                    aria-controls="primary-menu"
                    aria-expanded={show ? "true" : "false"}
                    role="button" 
                    tabIndex="0"
                    onClick={toggleMenu}
                >
                    <span></span>
                </div>
            </div>
        </header>
    );
};

export default Header;
