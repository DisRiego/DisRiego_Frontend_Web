import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Icon from "../assets/icons/DisRiego.svg";
import IconGoogle from "../img/icon/iconGoogle.svg";
import IconOutlook from "../img/icon/iconOutlook.svg";
import { IoMdWarning } from "react-icons/io";
import { IoArrowBack } from "react-icons/io5";
import { validateEmail } from "../hooks/useValidations.jsx";
import emailjs from "@emailjs/browser";

const Reset_password = () => {
  const [showButton, setShowButton] = useState(window.innerWidth >= 768);
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
  });

  const [errors, setErrors] = useState({
    email: "",
  });

  useEffect(() => {
    const handleResize = () => {
      setShowButton(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "email") {
      const isValid = validateEmail(value);
      setErrors({
        ...errors,
        email: isValid ? "" : "false",
      });
    }
  };
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (errors.email === "") {
      try {
        const response = await axios.post(
          import.meta.env.VITE_URI_BACKEND + "/users/request-reset-password",
          formData
        );

        emailjs
          .send(
            "service_3n57kiy",
            "template_dhmkfwx",
            {
              to_name: "Nombre del destinatario",
              message:
                "http://localhost:5173/login/resetpassword/" +
                response.data.token,
              email: formData.email,
              phone: "Número de teléfono",
              address: "Dirección",
              city: "Ciudad",
              country: "País",
              reply_to: formData.email,
            },
            "zYatJthjuGoFy8q22"
          )
          .then(
            (result) => {
              console.log("Mensaje enviado con éxito:", result.text);
              alert("Correo enviado correctamente");
            },
            (error) => {
              console.error("Error al enviar el correo:", error.text);
              alert("Hubo un error al enviar el correo");
            }
          );
      } catch (error) {
        setLoginError("El correo electrónico es inválido.");
      }
    } else {
      setLoginError("El correo electrónico es inválido.");
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
                ¿Olvidaste tu contraseña?
              </h3>
              <p className="title-mb">
                No te preocupes, ingresa tu correo para recibir las
                instrucciones de restablecer la contraseña.
              </p>
            </div>

            <form className="" onSubmit={handleSubmit}>
              <div className="field">
                <div className="control">
                  <input
                    name="email"
                    type="email"
                    className="input input-padding"
                    placeholder="Email"
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
                className="button is-fullwidth is-primary button-login"
              >
                Enviar correo
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

export default Reset_password;
