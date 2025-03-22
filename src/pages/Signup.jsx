import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import emailjs from "@emailjs/browser";
import Icon from "../assets/icons/DisRiego.svg";
import { IoMdWarning } from "react-icons/io";
import { IoArrowBack } from "react-icons/io5";
import {
  validateDate,
  validatePassword,
  validatePhone,
} from "../hooks/useValidations.jsx";
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
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isDisable, setIsDisable] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [actionButton, setActionButton] = useState("");

  const [formValidate, setFormValidate] = useState({
    document_type_id: "",
    document_number: "",
    date_issuance_document: "",
  });

  const [errorsValidate, setErrorsValidate] = useState({
    document_type_id: "",
    document_number: "",
    date_issuance_document: "",
  });

  const [formData, setFormData] = useState({
    token: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [errorsFormData, setErrorsFormData] = useState({
    token: "",
    email: "",
    password: "",
    password_confirmation: "",
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
      const documents = response.data.data;
      setTypeDocument(documents);
      if (documents.length > 0) {
        setFormValidate((prevState) => ({
          ...prevState,
          document_type_id: documents[0].id,
        }));
      }
      setIsLoading(false);
      setIsDisable(false);
    } catch (error) {
      console.log(error);
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

    setLoginError("");

    if (name === "password") {
      const isValid = validatePassword(value);
      setErrorsFormData({
        ...errorsFormData,
        password: isValid ? "" : "false",
      });
    }

    if (name === "password_confirmation") {
      const isValid = validatePassword(value);
      setErrorsFormData({
        ...errorsFormData,
        password_confirmation: isValid ? "" : "false",
      });
    }

    if (name === "password") {
      const value = e.target.value;
      setPasswordCriteria({
        length: value.length >= 12,
        hasNumber: /\d/.test(value),
        hasUppercase: /[A-ZÑ]/.test(value),
        hasLowercase: /[a-zñ]/.test(value),
        hasSpecialChar: /[.,;_@%+\-]/.test(value),
      });

      setErrorsValidate({
        ...errorsFormData,
        password: validatePassword(value) ? "" : "false",
      });
    }
  };

  const validationUser = async (e) => {
    e.preventDefault();
    setHasSubmitted(true);

    const isDocumentType = validatePhone(formValidate.document_type_id);
    const isNumberDocument = validatePhone(formValidate.document_number);
    const isDateIssuance = validateDate(formValidate.date_issuance_document);

    setErrorsValidate({
      document_type_id: isDocumentType
        ? ""
        : "false" && "Tipo de documento inválido",
      document_number: isNumberDocument
        ? ""
        : "false" && "Número de documento inválido",
      date_issuance_document: isDateIssuance
        ? ""
        : "false" && "Fecha de expedición inválida",
    });

    if (isDocumentType & isNumberDocument & isDateIssuance) {
      try {
        setLoading("is-loading");
        const response = await axios.post(
          import.meta.env.VITE_URI_BACKEND +
            import.meta.env.VITE_ROUTE_BACKEND_SIGNUP_VALIDATE,
          formValidate
        );

        if (response.data.success === true) {
          setFormData((prevState) => ({
            ...prevState,
            token: response.data.token,
          }));
          setLoginError("");
          setIsValidated(true);
        } else {
          setLoginError(
            "El usuario ingresado no es válido o ya se encuentra registrado."
          );
        }
        setLoading("");
      } catch (error) {
        setLoading("");
        console.error(error);
      }
    }
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

    if (formData.password !== formData.password_confirmation) {
      setLoginError("Las contraseñas no coinciden.");
      return;
    }

    try {
      setLoading("is-loading");
      const response = await axios.post(
        import.meta.env.VITE_URI_BACKEND +
          import.meta.env.VITE_ROUTE_BACKEND_SIGNUP_COMPLETE,
        formData
      );
      console.log("Response: " + response.data.token);

      if (response.data.success == true) {
        emailjs
          .send(
            "service_3n57kiy",
            "template_o07dr51",
            {
              to_name: "Nombre del destinatario",
              message:
                import.meta.env.VITE_URI_FRONTED +
                import.meta.env.VITE_ROUTE_FRONTEND_SIGNUP_ACTIVATION +
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
              setLoading("");
              setTitle("Usuario registrado exitosamente");
              setDescription(
                "Tu usuario ha sido creado correctamente. Por favor, verifica tu correo electrónico para activar tu cuenta y poder iniciar sesión."
              );
              setActionButton(() => () => navigate("/login"));
              setShowModal(true);
            },
            (error) => {
              setTitle("Error al enviar el correo de activación");
              setDescription(
                "Ocurrió un problema al generar y enviar el correo de activación de tu cuenta. Por favor, inténtalo de nuevo."
              );
              setActionButton(() => () => setShowModal(false));
              setShowModal(true);
            }
          );
      } else {
        setLoading("");
        setTitle("Error al registrar usuario");
        setDescription(
          "Ocurrió un problema durante el registro. Por favor, verifica tu información e inténtalo de nuevo. Si el problema persiste, contacta a soporte."
        );
        setActionButton(() => () => setShowModal(false));
        setShowModal(true);
      }
    } catch (error) {
      console.log("Error: " + error);
      setLoading("");
      setTitle("Error al registrar usuario");
      setDescription(
        "Ocurrió un problema durante el registro. Por favor, verifica tu información e inténtalo de nuevo. Si el problema persiste, contacta a soporte."
      );
      setActionButton(() => () => setShowModal(false));
      setShowModal(true);
    }
  };

  const sendEmail = async (e) => {};

  const handleDateFocus = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker();
    }
  };

  const handleBack = () => {
    setIsValidated(false);
  };

  //console.log(formData);

  return (
    <>
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
                <img
                  src={Icon}
                  alt="Logo de la Empresa"
                  className="icon-login"
                />
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
                  <form onSubmit={validationUser}>
                    <div className="columns columns-pb">
                      <div className="column column-validation">
                        <div className="field">
                          <div className="control">
                            <div
                              className={`select select-padding ${
                                hasSubmitted
                                  ? errorsValidate.document_type_id
                                    ? "is-false"
                                    : ""
                                  : ""
                              }`}
                            >
                              <select
                                name="document_type_id"
                                value={formValidate.document_type_id}
                                onChange={handleChangeValidate}
                                disabled={
                                  isLoading || typeDocument.length === 0
                                }
                              >
                                {typeDocument.map((doc) => (
                                  <option key={doc.id} value={doc.id}>
                                    {doc.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          {hasSubmitted && errorsValidate.document_type_id && (
                            <p className="input-error">
                              {errorsValidate.document_type_id}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="column is-two-thirds">
                        <div className="field">
                          <div className="control">
                            <input
                              name="document_number"
                              type="number"
                              className={`input input-padding ${
                                hasSubmitted
                                  ? errorsValidate.document_number
                                    ? "is-false"
                                    : ""
                                  : ""
                              }`}
                              placeholder="N° documento"
                              value={formValidate.document_number}
                              onChange={handleChangeValidate}
                            />
                          </div>
                          {hasSubmitted && errorsValidate.document_number && (
                            <p className="input-error">
                              {errorsValidate.document_number}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="field">
                      <div className="control">
                        <input
                          ref={dateInputRef}
                          name="date_issuance_document"
                          type="date"
                          className={`input input-padding ${
                            hasSubmitted
                              ? errorsValidate.date_issuance_document
                                ? "is-false"
                                : ""
                              : ""
                          }`}
                          placeholder="Fecha de expedición"
                          onFocus={handleDateFocus}
                          value={formValidate.date_issuance_document}
                          onChange={handleChangeValidate}
                        />
                      </div>
                      {hasSubmitted &&
                        errorsValidate.date_issuance_document && (
                          <p className="input-error">
                            {errorsValidate.date_issuance_document}
                          </p>
                        )}
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
                      disabled={isDisable}
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
                      Ingresa la siguiente información para completar el
                      proceso.
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
                          name="password"
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
                          name="password_confirmation"
                          type="password"
                          className="input input-padding"
                          placeholder="Ingresa nuevamente tu contraseña"
                          value={formData.password_confirmation}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="field">
                      <div className="control">
                        <div className="is-flex">
                          <MdError
                            className={
                              formData.password === ""
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
                              formData.password === ""
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
                              formData.password === ""
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
                              formData.password === ""
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
                              formData.password === ""
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
                    <div className="buttons is-flex is-justify-content-center mt-5 mb-2">
                      <button
                        className={"button is-light is-flex-grow-1"}
                        onClick={handleBack}
                      >
                        Regresar
                      </button>
                      <button
                        type="submit"
                        className={
                          "button is-primary button-login is-flex-grow-1 " +
                          loading
                        }
                      >
                        Finalizar
                      </button>
                    </div>
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

export default Signup;
