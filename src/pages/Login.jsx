import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Icon from "../assets/icons/DisRiego.svg";
import IconGoogle from "../img/icon/iconGoogle.svg";
import IconOutlook from "../img/icon/iconOutlook.svg";
import { IoMdWarning } from "react-icons/io";
import { IoArrowBack } from "react-icons/io5";
import { validateEmail, validatePassword } from "../hooks/useValidations.jsx";
import { jwtDecode } from "jwt-decode";
import emailjs from "@emailjs/browser";
import Modal from "../components/Modal.jsx";
// import { useGoogleLogin } from "@react-oauth/google";

const Login = () => {
  const [showButton, setShowButton] = useState(window.innerWidth >= 768);
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [actionButton, setActionButton] = useState("");

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

    setLoginError("");

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
        setLoading("is-loading");
        const response = await axios.post(
          import.meta.env.VITE_URI_BACKEND +
            import.meta.env.VITE_ROUTE_BACKEND_LOGIN,
          formData
        );

        const token = response.data.access_token;
        localStorage.setItem("token", token);
        const decode = jwtDecode(token);

        if (decode.first_login_complete === false) {
          navigate("/login/update-info");
        } else {
          navigate("/dashboard/profile");
        }
      } catch (error) {
        if (
          error.status === 401 &&
          error.response.data.detail.status === "false"
        ) {
          setLoading("");
          const activate = error.response.data.detail.token;
          emailjs
            .send(
              "service_3n57kiy",
              "template_o07dr51",
              {
                to_name: "Nombre del destinatario",
                message:
                  import.meta.env.VITE_URI_FRONTED +
                  import.meta.env.VITE_ROUTE_FRONTEND_SIGNUP_ACTIVATION +
                  activate,
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
                setLoading("");
                setTitle("Usuario no activado");
                setDescription(
                  "Tu usuario no se encuentra activado. Por favor, revisa tu correo electrónico, ya que te hemos enviado un mensaje para activar tu cuenta y poder iniciar sesión."
                );

                setActionButton(() => () => setShowModal(false));
                setShowModal(true);
              },
              (error) => {
                setTitle("Error al enviar el correo de activación");
                setDescription(
                  "Ocurrió un problema al generar y enviar el correo de activación de tu cuenta. Por favor, inténtalo más tarde."
                );
                setActionButton(() => () => setShowModal(false));
                setShowModal(true);
              }
            );
        } else {
          if (error.status === 429) {
            setLoading("");
            setTitle("Error al enviar el correo de activación");
            setDescription(
              "Debido a que has generado recientemente múltiples correos de activación en poco tiempo, el sistema ha restringido temporalmente el envío de nuevos correos. Por favor, inténtalo nuevamente más tarde."
            );
            setActionButton(() => () => setShowModal(false));
            setShowModal(true);
          } else {
            setLoading("");
            setLoginError(
              "El correo electrónico o la contraseña son incorrectos."
            );
          }
        }
      }
    } else {
      setLoading("");
      setLoginError("El correo electrónico o la contraseña son inválidos.");
    }
  };

  // const login = useGoogleLogin({
  //   onSuccess: async (response) => {
  //     try {
  //       const res = await axios.get(
  //         "https://www.googleapis.com/oauth2/v3/userinfo",
  //         {
  //           headers: {
  //             Authorization: `Bearer ${response.access_token}`,
  //           },
  //         }
  //       );
  //       console.log(res);
  //     } catch (error) {
  //       console.error("Error obteniendo datos del usuario de Google:", error);
  //     }
  //   },
  //   onError: () => {
  //     console.error("Error al iniciar sesión con Google");
  //   },
  // });

  return (
    <>
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
                <img
                  src={Icon}
                  alt="Logo de la Empresa"
                  className="icon-login"
                />
                <h2 className="title has-text-centered ">Dis Riego</h2>
              </div>

              {/* <div className="field">
              <div className="buttons">
                <button className="button is-fullwidth" onClick={login}>
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
            </div> */}
              <div className="has-text-centered">
                <h3 className="subtitle has-text-weight-semibold mb-2">
                  ¡Bienvenid@!
                </h3>
                <p className="title-mb">
                  Ingresa tu correo y contraseña para acceder a la plataforma.
                </p>
              </div>

              <form className="" onSubmit={handleSubmit}>
                <div className="field">
                  <div className="control">
                    <input
                      name="email"
                      type="email"
                      className="input input-padding"
                      placeholder="Correo"
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
                  className={
                    "button is-fullwidth is-primary button-login " + loading
                  }
                >
                  Iniciar Sesión
                </button>
              </form>
              <div className="has-text-centered mb-2">
                <span>¿Olvidaste tu contraseña?</span>
                <Link to="/login/resetpassword"> Restablécela aquí.</Link>
              </div>
              <div className="has-text-centered">
                <span>¿No has activado tu cuenta? </span>
                <Link to="/signup">Haz clic aquí.</Link>
              </div>
            </div>
          </div>

          {message && (
            <p className="has-text-danger has-text-centered m-3">{message}</p>
          )}
        </div>
      </div>
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

export default Login;
