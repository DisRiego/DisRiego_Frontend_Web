import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Icon from "../assets/icons/DisRiego.svg";
import { IoArrowBack } from "react-icons/io5";
import { validatePassword } from "../hooks/useValidations.jsx";
import { MdError } from "react-icons/md";
import Modal from "../components/Modal.jsx";

const Signup = () => {
  const [showButton, setShowButton] = useState(window.innerWidth >= 768);
  const [typeDocument, setTypeDocument] = useState([]);
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const token = useParams();
  const dateInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  const [formValidate, setFormValidate] = useState({
    document_type: "",
    document_number: "",
    date_issuance_document: "",
  });

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirm_password: "",
  });

  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    hasNumber: false,
    hasUppercase: false,
    hasLowercase: false,
    hasSpecialChar: false,
  });

  useEffect(() => {
    fetchTypeDocument();
    const handleResize = () => {
      setShowButton(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const fetchTypeDocument = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND +
          import.meta.env.VITE_ROUTE_BACKEND_USERS_TYPEDOCUMENT
      );
      setTypeDocument(response.data.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error al obtener los permisos:", error);
    }
  };

  const handleChangeValidate = (e) => {
    const { name, value } = e.target;

    setFormValidate({
      ...formValidate,
      [name]: value,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleValidate = (e) => {
    e.preventDefault();
    // Aquí puedes agregar validaciones reales, por ahora solo simulamos que se validó correctamente
    setIsValidated(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

    if (formData.new_password !== formData.confirm_password) {
      setLoginError("Las contraseñas no coinciden.");
      return;
    }

    try {
      setLoading("is-loading");
      await axios.post(
        import.meta.env.VITE_URI_BACKEND +
          import.meta.env.VITE_ROUTE_BACKEND_LOGIN_UPDATE_RESETPASSWORD +
          token.id,
        formData
      );
      setLoading("");
      setShowModal(true);
    } catch (error) {
      setLoading("");
      setShowModal(true);
    }
  };

  const handleDateFocus = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker();
    }
  };

  console.log(formValidate);

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
            <div className="is-flex is-flex-direction-row is-justify-content-center is-align-items-center title-mb">
              <img src={Icon} alt="Logo de la Empresa" className="icon-login" />
              <h2 className="title has-text-centered">Dis Riego</h2>
            </div>

            {!isValidated ? (
              <div>
                <div className="has-text-centered">
                  <h3 className="subtitle has-text-weight-semibold mb-2">
                    Registrar usuario
                  </h3>
                  <p className="title-mb">
                    Ingresa la siguiente información para verificar que el
                    usuario no esté registrado.
                  </p>
                </div>
                <form onSubmit={handleValidate}>
                  <div className="columns columns-pb">
                    <div className="column">
                      <div className="field">
                        <div className="control">
                          <div className={`select select-padding`}>
                            <select
                              name="document_type"
                              value={formData.document_type}
                              onChange={handleChange}
                              disabled={isLoading}
                            >
                              {typeDocument.map((doc) => (
                                <option key={doc.id} value={doc.id}>
                                  {doc.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="column is-two-thirds">
                      <div className="field">
                        <div className="control">
                          <input
                            name="document_number"
                            type="number"
                            className="input input-padding"
                            placeholder="N° documento"
                            value={formValidate.document_number}
                            onChange={handleChangeValidate}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="field">
                    <div className="control">
                      <input
                        ref={dateInputRef}
                        name="date_issuance_document"
                        type="date"
                        className="input input-padding"
                        placeholder="Fecha de expedición"
                        onFocus={handleDateFocus}
                        value={formValidate.date_issuance_document}
                        onChange={handleChangeValidate}
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className={
                      "button is-fullwidth is-primary button-login " + loading
                    }
                  >
                    Validar
                  </button>
                </form>
              </div>
            ) : (
              <div>
                <div className="has-text-centered">
                  <h3 className="subtitle has-text-weight-semibold mb-2">
                    Registrar usuario
                  </h3>
                  <p className="mb-5">
                    Ingresa la siguiente información para completar el proceso.
                  </p>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="field">
                    <div className="control">
                      <input
                        name="email"
                        type="email"
                        className="input input-padding"
                        placeholder="Ingresa tu correo electrónico"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="field">
                    <div className="control">
                      <input
                        name="new_password"
                        type="password"
                        className="input input-padding"
                        placeholder="Ingresa tu contraseña"
                        value={formData.password}
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
                        placeholder="Ingresa nuevamente tu contraseña"
                        value={formData.confirm_password}
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
                    Registrar
                  </button>
                </form>
              </div>
            )}
            <div className="has-text-centered">
              <span>¿Tienes cuenta? </span>
              <Link to="/login">Inicia sesión aquí.</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
