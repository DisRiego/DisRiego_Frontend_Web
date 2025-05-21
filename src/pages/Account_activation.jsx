import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { MdArrowOutward } from "react-icons/md";
import Modal from "../components/Modal";
import Img_dis from "../img/dis_img.svg";

const Account_activation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const hasActivated = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDisable, setIsDisable] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [actionButton, setActionButton] = useState(() => () => {});

  useEffect(() => {
    if (!id) return;
    if (hasActivated.current) return;
    hasActivated.current = true;

    handleActivation();
  }, [id]);

  const handleActivation = async () => {
    setIsLoading(true);
    setIsDisable(true);

    try {
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND +
          import.meta.env.VITE_ROUTE_BACKEND_SIGNUP_ACTIVATION +
          id
      );

      if (!response.data.success) {
        setTitle("Error al activar cuenta");
        setDescription(
          "Ocurrió un problema al activar tu cuenta. Por favor, inténtalo de nuevo más tarde."
        );
        setActionButton(() => () => navigate("/login"));
        setShowModal(true);
      } else {
        setTitle("Cuenta activada exitosamente");
        setDescription(
          "Tu cuenta ha sido activada. Ahora puedes iniciar sesión."
        );
        setIsActive(false);
        setActionButton(() => () => setShowModal(false));
        setShowModal(true);
      }
    } catch (error) {
      setTitle("Error al activar cuenta");
      setDescription(
        "Hubo un problema al activar tu cuenta. Inténtalo de nuevo."
      );
      setActionButton(() => () => navigate("/login"));
      setShowModal(true);
    } finally {
      setIsLoading(false);
      setIsDisable(false);
    }
  };

  return (
    <>
      <div className="container is-flex is-justify-content-center is-align-items-center">
        <div className="columns is-multiline is-flex is-justify-content-center columns-fullheight">
          <div className="column is-12-mobile is-6-tablet is-6-desktop is-flex is-flex-direction-column is-justify-content-center is-align-items-center">
            <div className="cont-activation">
              <h1 className="title">¡Bienvenid@ a DisRiego!</h1>
              {!isActive ? (
                <p>
                  Tu cuenta ha sido activada exitosamente. Ahora puedes iniciar
                  sesión y comenzar a disfrutar de todos nuestros servicios.
                </p>
              ) : (
                <p>
                  En estos momentos estamos activando tu cuenta. Este proceso
                  tomará solo unos segundos, por favor espera mientras finaliza
                  la configuración.
                </p>
              )}
              <Link
                className={
                  "button is-primary color-hover mt-5 button-padding " +
                  (isLoading ? "is-loading" : "")
                }
                to="/login"
                disabled={isDisable}
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
      {showModal && (
        <Modal
          title={title}
          description={description}
          actionButton={actionButton}
        />
      )}
    </>
  );
};

export default Account_activation;
