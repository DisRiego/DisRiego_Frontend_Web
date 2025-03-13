import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Icon from "../assets/icons/DisRiego.svg";
import IconGoogle from "../img/icon/iconGoogle.svg";
import IconOutlook from "../img/icon/iconOutlook.svg";
import { IoMdWarning } from "react-icons/io";
import { IoArrowBack } from "react-icons/io5";
import { validatePassword } from "../hooks/useValidations.jsx";
import Modal from "./Modal.jsx";
import { MdError } from "react-icons/md";

const Reset_password_confirm = () => {
  const [showButton, setShowButton] = useState(window.innerWidth >= 768);
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState("");
  const [showModal, setShowModal] = useState();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [actionButton, setActionButton] = useState("");
  const token = useParams();

  const [formData, setFormData] = useState({
    new_password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState({
    new_password: "",
    confirm_password: "",
  });

  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    hasNumber: false,
    hasUppercase: false,
    hasLowercase: false,
    hasSpecialChar: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    setLoginError("");

    if (name === "new_password") {
      const isValid = validatePassword(value);
      setErrors({
        ...errors,
        new_password: isValid ? "" : "false",
      });
    }

    if (name === "confirm_password") {
      const isValid = validatePassword(value);
      setErrors({
        ...errors,
        confirm_password: isValid ? "" : "false",
      });
    }

    if (name === "new_password") {
      const value = e.target.value;
      setPasswordCriteria({
        length: value.length >= 12,
        hasNumber: /\d/.test(value),
        hasUppercase: /[A-ZÑ]/.test(value),
        hasLowercase: /[a-zñ]/.test(value),
        hasSpecialChar: /[.,;_@%+\-]/.test(value),
      });

      setErrors({
        ...errors,
        new_password: validatePassword(value) ? "" : "false",
      });
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setShowButton(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [message, setMessage] = useState("");
  console.log(formData);
  console.log(errors);
  console.log(passwordCriteria);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar si la nueva contraseña cumple con los criterios de seguridad
    if (
      !passwordCriteria.length ||
      !passwordCriteria.hasNumber ||
      !passwordCriteria.hasUppercase ||
      !passwordCriteria.hasLowercase ||
      !passwordCriteria.hasSpecialChar
    ) {
      setLoginError("La contraseña no cumple con los requisitos de seguridad.");
      return;
    }

    // Verificar si las contraseñas coinciden
    if (formData.new_password !== formData.confirm_password) {
      setLoginError("Las contraseñas no coinciden.");
      return;
    }

    try {
      setLoading("is-loading");
      const response = await axios.post(
        import.meta.env.VITE_URI_BACKEND +
          import.meta.env.VITE_ROUTE_BACKEND_LOGIN_UPDATE_RESETPASSWORD +
          token.id,
        formData
      );

      setLoading("");
      setTitle("Contraseña cambiada exitosamente");
      setDescription(
        "Tu contraseña ha sido actualizada correctamente. Ahora puedes iniciar sesión con tu nueva contraseña."
      );
      setActionButton(() => () => navigate("/login"));
      setShowModal(true);
    } catch (error) {
      console.log(error.status);
      if (error.status == "404") {
        setTitle("Error al cambiar la contraseña");
        setDescription(
          "El enlace para cambiar la contraseña ha expirado o es inválido. Por favor, genera uno nuevo e inténtalo nuevamente."
        );

        setLoading("");
        setActionButton(() => () => navigate("/login"));
        setShowModal(true);
      } else {
        setTitle("Error al cambiar la contraseña");
        setDescription(
          "Ocurrió un problema al intentar actualizar tu contraseña. Por favor, inténtalo de nuevo."
        );
        setLoading("");
        setActionButton(() => () => setShowModal(false));
        setShowModal(true);
      }
    }
  };

  console.log(loading);

  return (
    <div className="container-login">
      {showButton && (
        <Link className="button-back" to="/login">
          <IoArrowBack className="icon" />
        </Link>
      )}
      <div className="columns background-image">
        <div className="column is-4-tablet is-4-desktop is-4-widescreen is-offset-two-thirds is-one-third is-flex is-flex-direction-column is-justify-content-center form-container column-padding">
          <div className="">
            <div className="is-flex is-flex-direction-row	is-justify-content-center is-align-items-center title-mb">
              <img src={Icon} alt="Logo de la Empresa" className="icon-login" />
              <h2 className="title has-text-centered ">Dis Riego</h2>
            </div>

            <div className="has-text-centered">
              <h3 className="subtitle has-text-weight-semibold mb-2">
                Restablecer contraseña
              </h3>
              <p className="title-mb">
                Ingresa tu nueva contraseña para completar el proceso.
              </p>
            </div>

            <form className="" onSubmit={handleSubmit}>
              <div className="field">
                <div className="control">
                  <input
                    name="new_password"
                    type="password"
                    className="input input-padding"
                    placeholder="Ingresa tu nueva contraseña"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <input
                    name="confirm_password"
                    type="password"
                    className="input input-padding"
                    placeholder="Ingresa nuevamente tu nueva contraseña"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <div className="is-flex">
                    <MdError
                      className={
                        formData.new_password === ""
                          ? "icon-password"
                          : passwordCriteria.length
                          ? "icon-password is-true"
                          : "icon-password is-false"
                      }
                    />
                    <p>Mínimo 12 caracteres</p>
                  </div>
                  <div className="is-flex">
                    <MdError
                      className={
                        formData.new_password === ""
                          ? "icon-password"
                          : passwordCriteria.hasUppercase
                          ? "icon-password is-true"
                          : "icon-password is-false"
                      }
                    />
                    <p>Mínimo una letra mayúscula</p>
                  </div>
                  <div className="is-flex">
                    <MdError
                      className={
                        formData.new_password === ""
                          ? "icon-password"
                          : passwordCriteria.hasLowercase
                          ? "icon-password is-true"
                          : "icon-password is-false"
                      }
                    />
                    <p>Mínimo una letra minúscula</p>
                  </div>
                  <div className="is-flex">
                    <MdError
                      className={
                        formData.new_password === ""
                          ? "icon-password"
                          : passwordCriteria.hasNumber
                          ? "icon-password is-true"
                          : "icon-password is-false"
                      }
                    />
                    <p>Mínimo un número</p>
                  </div>
                  <div className="is-flex">
                    <MdError
                      className={
                        formData.new_password === ""
                          ? "icon-password"
                          : passwordCriteria.hasSpecialChar
                          ? "icon-password is-true"
                          : "icon-password is-false"
                      }
                    />
                    <p>Mínimo un carácter especial</p>
                  </div>
                </div>
              </div>

              {loginError && (
                <div className="is-flex is-flex-direction-row	is-justify-content-center is-align-items-center">
                  <IoMdWarning className="icon login-error mr-3" />
                  <p className="login-error is-6">{loginError}</p>
                </div>
              )}
              <button
                type="submit"
                className={
                  "button is-fullwidth is-primary button-login " + loading
                }
              >
                Confirmar
              </button>
            </form>
            <div className="has-text-centered">
              <span>¿Quieres volver al inicio de sesión? </span>
              <Link to="/login">Haz clic aquí.</Link>
            </div>
          </div>
        </div>
        {message && (
          <p className="has-text-danger has-text-centered m-3">{message}</p>
        )}
      </div>
      {showModal && (
        <Modal
          title={title}
          description={description}
          actionButton={actionButton}
        />
      )}
    </div>
  );
};

export default Reset_password_confirm;
