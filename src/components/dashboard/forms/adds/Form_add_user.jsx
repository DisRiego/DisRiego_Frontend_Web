import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Confirm_add_rol from "../../confirm_view/adds/Confirm_add_rol";
import {
  validateDate,
  validatePhone,
  validateText,
  validateTextArea,
  validateLastName,
} from "../../../../hooks/useValidations";

const Form_add_user = ({
  title,
  onClose,
  setShowMessage,
  setMessage,
  setStatus,
  updateData,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [typeDocument, setTypeDocument] = useState([]);
  const [roles, setRoles] = useState([]);
  const dateInputRef = useRef(null);
  const [confirMessage, setConfirMessage] = useState();
  const [method, setMethod] = useState();
  const [uriPost, setUriPost] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    first_last_name: "",
    second_last_name: "",
    document_type: "",
    document_number: "",
    date_issuance_document: "",
    role_id: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    first_last_name: "",
    second_last_name: "",
    document_type: "",
    document_number: "",
    date_issuance_document: "",
    role_id: "",
  });

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchTypeDocument();
    fetchRoles();
  }, []);

  const fetchTypeDocument = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND +
          import.meta.env.VITE_ROUTE_BACKEND_USERS_TYPEDOCUMENT
      );
      setTypeDocument(response.data.data);
    } catch (error) {
      console.error("Error al obtener los permisos:", error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND +
          import.meta.env.VITE_ROUTE_BACKEND_ROL
      );
      setRoles(response.data.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error al obtener los permisos:", error);
    }
  };

  const handleSaveClick = () => {
    setSubmitted(true);
    const isNameValid = validateTextArea(formData.name);
    const isFirstLastValid = validateLastName(formData.first_last_name);
    const isSecondLastValid = validateLastName(formData.second_last_name);
    const isDocumentTypeValid = validatePhone(formData.document_type);
    const isDocumentNumberValid = validatePhone(formData.document_number);
    const isDateIssuanceValid = validateDate(formData.date_issuance_document);
    const isRolValid = formData.role_id.length > 0;

    setErrors({
      name: isNameValid ? "" : "false" && "Nombre o nombres inválidos",
      first_last_name: isFirstLastValid
        ? ""
        : "false" && "Primer apellido inválido",
      second_last_name: isSecondLastValid
        ? ""
        : "false" && "Segundo  apellido inválido",
      document_type: isDocumentTypeValid
        ? ""
        : "Debe seleccionar un tipo de documento",
      document_number: isDocumentNumberValid
        ? ""
        : "false" && "Número de documento inválido",
      date_issuance_document: isDateIssuanceValid
        ? ""
        : "false" && "Fecha de expedición inválida",
      role_id: isRolValid ? "" : "Debe seleccionar un rol",
    });

    if (
      isNameValid &&
      isFirstLastValid &&
      isSecondLastValid &&
      isDocumentTypeValid &&
      isDocumentNumberValid &&
      isDateIssuanceValid &&
      isRolValid
    ) {
      setConfirMessage('¿Desea crear el usuario "' + formData.name + '"?');
      setMethod("post");
      setUriPost(import.meta.env.VITE_ROUTE_BACKEND_USERS);
      setShowConfirm(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateFocus = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker();
    }
  };

  const toTitleCase = (str) => {
    if (typeof str !== "string") return str; // Evita errores con números u otros tipos
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  console.log(formData);

  return (
    <>
      <div className="modal is-active">
        <div className="modal-background" onClick={onClose}></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">{title}</p>
            <button
              className="delete"
              aria-label="close"
              onClick={onClose}
            ></button>
          </header>
          <section className="modal-card-body">
            <div className="field">
              <label className="label">Nombres</label>
              <div className="control">
                <input
                  className={`input ${
                    submitted ? (errors.name ? "is-false" : "is-true") : ""
                  }`}
                  type="text"
                  name="name"
                  placeholder="Ingrese el nombre o nombres"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
              {submitted && errors.name && (
                <p className="input-error">{errors.name}</p>
              )}
            </div>

            <div className="container-input">
              <div className="columns">
                <div className="column">
                  <div className="field">
                    <label className="label">Primer apellido</label>
                    <div className="control">
                      <input
                        className={`input ${
                          submitted
                            ? errors.first_last_name
                              ? "is-false"
                              : "is-true"
                            : ""
                        }`}
                        type="text"
                        name="first_last_name"
                        placeholder="Ingrese el primer apellido"
                        value={formData.first_last_name}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                    </div>
                    {submitted && errors.first_last_name && (
                      <p className="input-error">{errors.first_last_name}</p>
                    )}
                  </div>
                </div>
                <div className="column">
                  <div className="field">
                    <label className="label">Segundo apellido</label>
                    <div className="control">
                      <input
                        className={`input ${
                          submitted
                            ? errors.second_last_name
                              ? "is-false"
                              : "is-true"
                            : ""
                        }`}
                        type="text"
                        name="second_last_name"
                        placeholder="Ingrese el primer apellido"
                        value={formData.second_last_name}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                    </div>
                    {submitted && errors.second_last_name && (
                      <p className="input-error">{errors.second_last_name}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="container-input">
              <div className="columns">
                <div className="column">
                  <div className="field">
                    <label className="label">Tipo de documento</label>
                    <div className="control">
                      <div
                        className={`select ${
                          submitted
                            ? errors.document_type
                              ? "is-false"
                              : "is-true"
                            : ""
                        }`}
                      >
                        <select
                          name="document_type"
                          value={formData.document_type}
                          onChange={handleChange}
                          disabled={isLoading}
                        >
                          <option value="" disabled>
                            Seleccione un tipo de documento
                          </option>
                          {typeDocument.map((doc) => (
                            <option key={doc.id} value={doc.id}>
                              {toTitleCase(doc.name)}
                            </option>
                          ))}
                        </select>
                      </div>
                      {submitted && errors.document_type && (
                        <p className="input-error">{errors.document_type}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="column">
                  <div className="field">
                    <label className="label">N° Documento</label>
                    <div className="control">
                      <input
                        className={`input ${
                          submitted
                            ? errors.document_number
                              ? "is-false"
                              : "is-true"
                            : ""
                        }`}
                        type="number"
                        name="document_number"
                        placeholder="Ingrese el número de documento"
                        value={formData.document_number}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                    </div>
                    {submitted && errors.document_number && (
                      <p className="input-error">{errors.document_number}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="container-input">
              <div className="columns">
                <div className="column">
                  <div className="field">
                    <label className="label">Fecha de expedición</label>
                    <div className="control">
                      <input
                        ref={dateInputRef}
                        className={`input ${
                          submitted
                            ? errors.date_issuance_document
                              ? "is-false"
                              : "is-true"
                            : ""
                        }`}
                        type="date"
                        name="date_issuance_document"
                        placeholder="Ingrese la fecha de expedición"
                        value={formData.date_issuance_document}
                        onChange={handleChange}
                        onFocus={handleDateFocus}
                        disabled={isLoading}
                      />
                    </div>
                    {submitted && errors.date_issuance_document && (
                      <p className="input-error">
                        {errors.date_issuance_document}
                      </p>
                    )}
                  </div>
                </div>
                <div className="column">
                  <div className="field">
                    <label className="label">Rol</label>
                    <div className="control">
                      <div
                        className={`select ${
                          submitted
                            ? errors.role_id
                              ? "is-false"
                              : "is-true"
                            : ""
                        }`}
                      >
                        <select
                          name="role_id"
                          value={formData.role_id}
                          onChange={handleChange}
                          disabled={isLoading}
                        >
                          <option value="" disabled>
                            Seleccione un rol
                          </option>
                          {roles.map((role) => (
                            <option key={role.role_id} value={role.role_id}>
                              {toTitleCase(role.role_name)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {submitted && errors.role_id && (
                      <p className="input-error">{errors.role_id}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
          <footer className="modal-card-foot is-flex is-justify-content-center">
            <div className="buttons">
              <button className="button" onClick={onClose}>
                Cancelar
              </button>
              <button className="button color-hover" onClick={handleSaveClick}>
                Guardar
              </button>
            </div>
          </footer>
        </div>
      </div>
      {showConfirm && (
        <Confirm_add_rol
          onClose={() => {
            setShowConfirm(false);
          }}
          onSuccess={onClose}
          confirMessage={confirMessage}
          method={method}
          formData={formData}
          setShowMessage={setShowMessage}
          setMessage={setMessage}
          setStatus={setStatus}
          updateData={updateData}
        />
      )}
    </>
  );
};

export default Form_add_user;
