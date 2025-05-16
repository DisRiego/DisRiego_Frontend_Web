import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Img_dis from "../img/dis_img.svg";
import { MdArrowOutward } from "react-icons/md";
import Form_update_info from "../components/Form_update_info";
import Message from "../components/Message";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const Update_info = () => {
  const [showModal, setShowModal] = useState(false);
  const [token, setToken] = useState();
  const navigate = useNavigate();
  const [showMessage, setShowMessage] = useState(false);
  const [titleMessage, setTitleMessage] = useState(false);
  const [message, setMessage] = useState(false);
  const [status, setStatus] = useState(false);
  const [loading, setLoading] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      navigate("/login");
    } else {
      setToken(storedToken);
      const decode = jwtDecode(storedToken);
    }
  }, [navigate]);

  const handleSignUp = async () => {
    try {
      setLoading("is-loading");
      const storedToken = localStorage.getItem("token");

      if (!storedToken) {
        navigate("/login");
        return;
      }

      await axios.post(
        import.meta.env.VITE_URI_BACKEND +
          import.meta.env.VITE_ROUTE_BACKEND_LOGOUT,
        {},
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );

      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <>
      <div className="container is-flex is-justify-content-center is-align-items-center">
        <div className="columns is-multiline is-flex is-justify-content-center columns-fullheight">
          <div className="column is-12-mobile is-6-tablet is-6-desktop is-flex is-flex-direction-column is-justify-content-center is-align-items-center">
            <div className="cont-activation">
              <h1 className="title">¡Bienvenid@ a DisRiego!</h1>
              <p>
                Antes de ingresar a la plataforma, necesitas actualizar tu
                información personal.
              </p>
              <div className="buttons">
                <Link
                  className="button color-hover mt-5 button-padding"
                  onClick={() => setShowModal(true)}
                >
                  <div className="mr-2">Actualizar</div>
                  <MdArrowOutward />
                </Link>
                <Link
                  className={"button is-light mt-5 button-padding " + loading}
                  onClick={handleSignUp}
                >
                  <div className={"mr-2 "}>Cerrar Sesión</div>
                  <MdArrowOutward className="icon-signup" />
                </Link>
              </div>
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
      {showModal && (
        <Form_update_info
          title="Actualizar información"
          onClose={() => setShowModal(false)}
          setShowMessage={setShowMessage}
          setTitleMessage={setTitleMessage}
          setMessage={setMessage}
          setStatus={setStatus}
          loading={loading}
          setLoading={setLoading}
        />
      )}
      {showMessage && (
        <Message
          titleMessage={titleMessage}
          message={message}
          status={status}
          onClose={() => setShowMessage(false)}
        />
      )}
    </>
  );
};

export default Update_info;
