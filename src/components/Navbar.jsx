import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/icons/Disriego_title.png";

const Navbar = ({ onScrollTo }) => {
  const [isActive, setIsActive] = useState(false);

  const toggleMenu = () => setIsActive(!isActive);

  const navItemStyle = {
    borderRadius: "6px",
    padding: "0.5rem 0.75rem",
  };

  return (
    <nav
      className="navbar"
      role="navigation"
      aria-label="main navigation"
      style={{ padding: "1rem 1.5rem" }}
    >
      <div className="navbar-brand is-flex is-align-items-center">
        <img
          src={Logo}
          alt="Logo DisRiego"
          style={{ height: "32px", marginRight: "8px" }}
        />

        <a
          role="button"
          className={`navbar-burger ${isActive ? "is-active" : ""}`}
          aria-label="menu"
          aria-expanded={isActive}
          onClick={toggleMenu}
          style={{ marginLeft: "auto" }}
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div className={`navbar-menu ${isActive ? "is-active" : ""}`}>
        <div className="navbar-start is-flex is-align-items-center">
          <a
            className="navbar-item has-text-weight-medium"
            style={navItemStyle}
            onClick={onScrollTo.beneficios}
          >
            Beneficios
          </a>
          <a
            className="navbar-item has-text-weight-medium"
            style={navItemStyle}
            onClick={onScrollTo.especificaciones}
          >
            Especificaciones
          </a>
          <a
            className="navbar-item has-text-weight-medium"
            style={navItemStyle}
            onClick={onScrollTo.contacto}
          >
            Contáctanos
          </a>
        </div>

        <div className="navbar-end is-flex is-align-items-center">
          <div className="navbar-item">
            <div className="buttons">
              <Link to="/signup" className="button is-light">
                Registrarse
              </Link>
              <Link to="/login" className="button button-login is-success">
                Iniciar Sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
