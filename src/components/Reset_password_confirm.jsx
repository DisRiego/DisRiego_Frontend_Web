import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Icon from "../assets/icons/DisRiego.svg";
import IconGoogle from "../img/icon/iconGoogle.svg";
import IconOutlook from "../img/icon/iconOutlook.svg";
import { IoMdWarning } from "react-icons/io";
import { IoArrowBack } from "react-icons/io5";
import { validatePassword } from "../hooks/useValidations.jsx";

const Reset_password_confirm = () => {
  const [showButton, setShowButton] = useState(window.innerWidth >= 768);
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");

  const [formData, setFormData] = useState({
    password: "",
    repeat_password: "",
  });

  const [errors, setErrors] = useState({
    password: "",
    repeat_password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "password") {
      const isValid = validatePassword(value);
      setErrors({
        ...errors,
        password: isValid ? "" : "false",
      });
    }

    if (name === "repeat_password") {
      const isValid = validatePassword(value);
      setErrors({
        ...errors,
        repeat_password: isValid ? "" : "false",
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (errors.password === "" && errors.repeat_password === "") {
      try {
        console.log(formData);
        const response = await axios.post(
          import.meta.env.VITE_URI_BACKEND_USER + "/",
          formData
        );
        navigate("/login");
      } catch (error) {
        setLoginError("La contraseña no es inválida.");
      }
    } else {
      setLoginError("Las contraseñas no coinciden.");
    }
  };

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
                    name="password"
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
                    name="repeat_password"
                    type="password"
                    className="input input-padding"
                    placeholder="Ingresa nuevamente tu nueva contraseña"
                    onChange={handleChange}
                  />
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
                className="button text-button is-fullwidth is-primary button-login"
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
    </div>
  );
};

export default Reset_password_confirm;
