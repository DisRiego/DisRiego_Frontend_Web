import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Icon_dis from "../assets/icons/DisRiego.svg";
import Img_dis from "../img/dis_img.svg";
import { MdArrowOutward } from "react-icons/md";

const Account_activation = () => {
  return (
    <>
      <div className="container is-flex is-justify-content-center is-align-items-center">
        <div className="columns is-multiline is-flex is-justify-content-center columns-fullheight">
          <div className="column is-12-mobile is-6-tablet is-6-desktop is-flex is-flex-direction-column is-justify-content-center is-align-items-center">
            <div className="cont-activation">
              <h1 className="title">¡Bienvenidos a DisRiego!</h1>
              <p>
                Tu cuenta ha sido activada exitosamente. Ahora puedes iniciar
                sesión y comenzar a disfrutar de todos nuestros servicios.
              </p>
              <Link
                className="button color-hover mt-5 button-padding"
                to="/login"
              >
                <div className="mr-2">Iniciar sesión</div>
                <MdArrowOutward />
              </Link>
            </div>
          </div>

          <div className="column is-12-mobile is-6-tablet is-6-desktop is-flex is-justify-content-center is-align-items-center">
            <img
              className="image-active"
              src={Img_dis}
              alt="Descripción de la imagen"
            />
          </div>
        </div>
      </div>
      <div className="border"></div>
    </>
  );
};

export default Account_activation;
