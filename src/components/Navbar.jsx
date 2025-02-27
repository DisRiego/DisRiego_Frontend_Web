import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../assets/icons/DisRiego.svg";

const Navbar = () => {
  return (
    <>
      <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
          <Link class="navbar-item" to="">
            <img src={Icon} alt="Logo de la Empresa" />
            <h1 className="is-size-5 has-text-weight-bold">Dis_Riego</h1>
          </Link>

          <a
            role="button"
            class="navbar-burger"
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

        <div id="navbarBasicExample" class="navbar-menu">
          <div class="navbar-start">
            <a class="navbar-item">Inicio</a>
          </div>

          <div class="navbar-end">
            <div class="navbar-item">
              <div class="buttons">
                <Link class="button is-light" to="">
                  Registrarse
                </Link>
                <Link class="button button-login is-success" to="login">
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
