import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../assets/icons/DisRiego.svg";

const Navbar = () => {
  return (
    <>
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <Link className="navbar-item" to="">
            <img src={Icon} alt="Logo de la Empresa" />
            <h1 className="is-size-5 has-text-weight-bold">Dis_Riego</h1>
          </Link>

          <a
            role="button"
            className="navbar-burger"
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarBasicExample"
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div id="navbarBasicExample" className="navbar-menu">
          <div className="navbar-start">
            <a className="navbar-item">Inicio</a>
          </div>

          <div className="navbar-end">
            <div className="navbar-item">
              <div className="buttons">
                <Link className="button is-light" to="signup">
                  Registrarse
                </Link>
                <Link className="button button-login is-success" to="login">
                  Iniciar Sesión
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
