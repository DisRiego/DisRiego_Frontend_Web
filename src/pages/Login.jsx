import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Icon from "../assets/icons/DisRiego.svg";
import IconGoogle from "../img/icon/iconGoogle.svg";
import IconOutlook from "../img/icon/iconOutlook.svg";
import { IoMdWarning } from "react-icons/io";
import { IoArrowBack } from "react-icons/io5";
import { validateEmail, validatePassword } from "../hooks/useValidations.jsx";

const Login = () => {
  const [showButton, setShowButton] = useState(window.innerWidth >= 768);
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

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

    if (name === "password") {
      const isValid = validatePassword(value);
      setErrors({
        ...errors,
        password: isValid ? "" : "false",
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

    if (errors.email === "" && errors.password === "") {
      try {
        console.log(formData);
        const response = await axios.post(
          import.meta.env.VITE_URI_BACKEND_USER + "/login",
          formData
        );
        navigate("/dashboard");
      } catch (error) {
        setLoginError("El correo electrónico o la contraseña son incorrectos.");
      }
    } else {
      setLoginError("El correo electrónico o la contraseña son inválidos.");
    }
  };

  return (
    <div className="container-login">
      {showButton && (
        <Link className="button-back" to="/">
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

            <div className="field">
              <div className="buttons">
                <button className="button is-fullwidth">
                  <span className="icon">
                    <img src={IconGoogle} alt="Icono Club" />
                  </span>
                  <p>Google</p>
                </button>
                <button className="button is-fullwidth">
                  <span className="icon">
                    <img src={IconOutlook} alt="Icono Club" />
                  </span>
                  <p>Microsoft</p>
                </button>
              </div>
            </div>

            <div className="field">
              <div className="separator">
                <p>O</p>
              </div>
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
              <div className="field">
                <div className="control">
                  <input
                    name="password"
                    type="password"
                    className="input input-padding"
                    placeholder="Contraseña"
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
                Iniciar Sesión
              </button>
            </form>
            <div className="has-text-centered mb-2">
              <span>¿Olvidaste tu contraseña?</span>
              <Link to="/login/resetpassword"> Restablécela aquí.</Link>
            </div>
            <div className="has-text-centered">
              <span>¿No tienes cuenta? </span>
              <Link to="/signup">Haz clic aquí.</Link>
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

export default Login;
