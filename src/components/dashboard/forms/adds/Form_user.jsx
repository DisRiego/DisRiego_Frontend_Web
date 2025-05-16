import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Confirm_modal from "../../reusable/Confirm_modal";
import {
  validatePhone,
  validateTextArea,
  validateLastName,
  validateBirthdate,
  validateIssuanceDate,
} from "../../../../hooks/useValidations";
import { IoMdWarning } from "react-icons/io";

const Form_user = ({
  title,
  onClose,
  setShowMessage,
  setTitleMessage,
  setMessage,
  setStatus,
  updateData,
  id,
  loading,
  setLoading,
  token,
  typeForm,
  setTypeForm,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [typeDocument, setTypeDocument] = useState([]);
  const [roles, setRoles] = useState([]);
  const [user, setUser] = useState({});
  const [gender, setGender] = useState([]);
  const birthDateInputRef = useRef(null);
  const dateIssuanceInputRef = useRef(null);
  const [confirMessage, setConfirMessage] = useState();
  const [method, setMethod] = useState();
  const [uriPost, setUriPost] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isRolesOpen, setIsRolesOpen] = useState(false);

  const feedbackMessages = {
    create: {
      successTitle: "Usuario creado exitosamente",
      successMessage: "El usuario ha sido creado correctamente.",
      errorTitle: "Error al crear el usuario",
      errorMessage:
        "No se pudo crear el usuario, por favor, inténtelo de nuevo.",
    },
    edit: {
      successTitle: "Usuario actualizado exitosamente",
      successMessage: "El usuario ha sido actualizado correctamente.",
      errorTitle: "Error al actualizar el usuario",
      errorMessage:
        "No se pudo actualizar el usuario, por favor, inténtelo de nuevo.",
    },
  };

  const [formData, setFormData] = useState({
    name: "",
    first_last_name: "",
    second_last_name: "",
    type_document_id: "",
    document_number: "",
    birthday: "",
    date_issuance_document: "",
    gender_id: "",
    roles: [],
  });

  const [errors, setErrors] = useState({
    name: "",
    first_last_name: "",
    second_last_name: "",
    type_document_id: "",
    document_number: "",
    birthday: "",
    date_issuance_document: "",
    gender_id: "",
    roles: [],
  });

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchTypeDocument();
    fetchRoles();
    fetchGenders();
    if (id != null) {
      getUser();
    }
  }, [id]);

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

  const getUser = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND +
          import.meta.env.VITE_ROUTE_BACKEND_USERS +
          id
      );

      const userData = response.data.data[0];

      setUser(userData);

      setFormData({
        name: userData.name ? userData.name : "",
        first_last_name: userData.first_last_name
          ? userData.first_last_name
          : "",
        second_last_name: userData.second_last_name
          ? userData.second_last_name
          : "",
        type_document_id: userData.type_document_id
          ? userData.type_document_id
          : "",
        document_number: userData.document_number
          ? userData.document_number.toString()
          : "",
        birthday: userData.birthday ? userData.birthday.slice(0, 10) : "",
        date_issuance_document: userData.date_issuance_document
          ? userData.date_issuance_document.slice(0, 10)
          : "",
        gender_id: userData.gender_id ? userData.gender_id : "",
        roles: userData.roles ? userData.roles.map((role) => role.id) : [],
      });

      setIsLoading(false);
    } catch (error) {
      console.error("Error al obtener el usuario:", error);
    }
  };

  const fetchGenders = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND +
          import.meta.env.VITE_ROUTE_BACKEND_USERS_GENDER
      );
      setGender(response.data.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error al obtener los generos:", error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND +
          import.meta.env.VITE_ROUTE_BACKEND_ROL
      );
      const activeRoles = response.data.data.filter(
        (role) => role.status_name === "Activo"
      );

      setRoles(activeRoles);
      setIsLoading(false);
    } catch (error) {
      console.error("Error al obtener los permisos:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRoleChange = (e) => {
    const { value, checked } = e.target;
    const roleId = parseInt(value, 10); // Convertir a número

    setFormData((prevFormData) => {
      const updatedRoles = checked
        ? [...prevFormData.roles, roleId] // Agregar si está marcado
        : prevFormData.roles.filter((role) => role !== roleId); // Eliminar si se desmarca

      return { ...prevFormData, roles: updatedRoles };
    });
  };

  const toggleRolesAccordion = () => {
    setIsRolesOpen(!isRolesOpen);
  };

  const handleBirthDateFocus = () => {
    if (birthDateInputRef.current) {
      birthDateInputRef.current.showPicker();
    }
  };

  const handleDateIssuanceFocus = () => {
    if (dateIssuanceInputRef.current) {
      dateIssuanceInputRef.current.showPicker();
    }
  };

  const toTitleCase = (str) => {
    if (typeof str !== "string") return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const handleSaveClick = () => {
    setSubmitted(true);
    const isNameValid = validateTextArea(formData.name);
    const isFirstLastValid = validateLastName(formData.first_last_name);
    const isSecondLastValid = validateLastName(formData.second_last_name);
    const isDocumentTypeValid = validatePhone(formData.type_document_id);
    const isDocumentNumberValid = validatePhone(formData.document_number);
    const isBirhdateValid = validateBirthdate(formData.birthday);
    const isDateIssuanceValid = validateIssuanceDate(
      formData.date_issuance_document,
      formData.birthday
    );
    const isGenderValid = validatePhone(formData.gender_id);
    const isRolValid = formData.roles.length > 0;

    const birthDate = new Date(formData.birthday);
    const issuanceDate = new Date(formData.date_issuance_document);
    const isDateValid = isDateIssuanceValid && issuanceDate >= birthDate;

    setErrors({
      name: isNameValid ? "" : "false" && "Nombre o nombres inválidos",
      first_last_name: isFirstLastValid
        ? ""
        : "false" && "Primer apellido inválido",
      second_last_name: isSecondLastValid
        ? ""
        : "false" && "Segundo  apellido inválido",
      type_document_id: isDocumentTypeValid
        ? ""
        : "Debe seleccionar una opción",
      document_number: isDocumentNumberValid
        ? ""
        : "false" && "Número de documento inválido",
      birthday: isBirhdateValid
        ? ""
        : "false" && "Fecha de nacimiento inválida",
      date_issuance_document: isDateValid
        ? ""
        : "false" && "Fecha de expedición inválida",
      gender_id: isGenderValid ? "" : "Debe seleccionar una opción",
      roles: isRolValid ? "" : "Debe seleccionar al menos un rol.",
    });

    if (
      isNameValid &&
      isFirstLastValid &&
      isSecondLastValid &&
      isDocumentTypeValid &&
      isDocumentNumberValid &&
      isDateIssuanceValid &&
      isGenderValid &&
      isRolValid
    ) {
      if (id != null) {
        setConfirMessage("¿Desea editar el usuario?");
        setMethod("put");
        setUriPost(
          import.meta.env.VITE_URI_BACKEND +
            import.meta.env.VITE_ROUTE_BACKEND_EDIT_USERS +
            id
        );
        setTypeForm("edit");
        setShowConfirm(true);
      } else {
        setConfirMessage('¿Desea crear el usuario "' + formData.name + '"?');
        setMethod("post");
        setUriPost(
          import.meta.env.VITE_URI_BACKEND +
            import.meta.env.VITE_ROUTE_BACKEND_CREATE_USERS
        );
        setTypeForm("create");
        setShowConfirm(true);
      }
    }
  };

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
            <div className="columns">
              <div className="column">
                <div className="field">
                  <label className="label">Nombre(s)</label>
                  <div className="control">
                    <input
                      className={`input ${
                        submitted ? (errors.name ? "is-false" : "is-true") : ""
                      }`}
                      type="text"
                      name="name"
                      placeholder="Ingrese el/los nombre(s)"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </div>
                  {submitted && errors.name && (
                    <p className="input-error">{errors.name}</p>
                  )}
                </div>
              </div>
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
            </div>

            <div className="container-input">
              <div className="columns">
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
                        placeholder="Ingrese el segundo apellido"
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
                <div className="column">
                  <div className="field">
                    <label className="label">Tipo de documento</label>
                    <div className="control">
                      <div
                        className={`select ${
                          submitted
                            ? errors.type_document_id
                              ? "is-false"
                              : "is-true"
                            : ""
                        }`}
                      >
                        <select
                          name="type_document_id"
                          value={formData.type_document_id}
                          onChange={handleChange}
                          disabled={isLoading}
                        >
                          <option value="" disabled>
                            Seleccione una opción
                          </option>
                          {typeDocument.map((doc) => (
                            <option key={doc.id} value={doc.id}>
                              {doc.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      {submitted && errors.type_document_id && (
                        <p className="input-error">{errors.type_document_id}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="container-input">
              <div className="columns">
                <div className="column">
                  <div className="field">
                    <label className="label">Número de documento</label>
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
                <div className="column">
                  <div className="field">
                    <label className="label">Fecha de nacimiento</label>
                    <div className="control">
                      <input
                        ref={birthDateInputRef}
                        className={`input ${
                          submitted
                            ? errors.birthday
                              ? "is-false"
                              : "is-true"
                            : ""
                        }`}
                        type="date"
                        name="birthday"
                        placeholder="Ingrese la fecha de nacimiento"
                        value={formData.birthday}
                        onChange={handleChange}
                        onFocus={handleBirthDateFocus}
                        disabled={isLoading}
                      />
                    </div>
                    {submitted && errors.birthday && (
                      <p className="input-error">{errors.birthday}</p>
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
                        ref={dateIssuanceInputRef}
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
                        onFocus={handleDateIssuanceFocus}
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
                    <label className="label">Genero</label>
                    <div className="control">
                      <div
                        className={`select ${
                          submitted
                            ? errors.gender_id
                              ? "is-false"
                              : "is-true"
                            : ""
                        }`}
                      >
                        <select
                          name="gender_id"
                          value={formData.gender_id}
                          onChange={handleChange}
                          disabled={isLoading}
                        >
                          <option value="" disabled>
                            Seleccione una opción
                          </option>
                          {gender.map((doc) => (
                            <option key={doc.id} value={doc.id}>
                              {doc.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      {submitted && errors.gender_id && (
                        <p className="input-error">{errors.gender_id}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="container-input">
              <div className="columns">
                <div className="column">
                  <div className="field">
                    <div className="accordion">
                      <div
                        className="accordion-header"
                        onClick={toggleRolesAccordion}
                      >
                        <span className="accordion-title">Roles</span>
                        <span>{isRolesOpen ? "−" : "+"}</span>
                      </div>
                      <div
                        className={`accordion-body ${
                          isRolesOpen ? "open" : ""
                        }`}
                      >
                        {roles.map((role) => (
                          <div className="control" key={role.id}>
                            <label className="checkbox">
                              <input
                                type="checkbox"
                                value={role.role_id}
                                checked={formData.roles.includes(role.role_id)}
                                onChange={handleRoleChange}
                              />{" "}
                              {toTitleCase(role.role_name)}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    {submitted && errors.roles && (
                      <div className="is-flex is-flex-direction-row	is-justify-content-center is-align-items-center">
                        <IoMdWarning className="icon login-error mr-2" />
                        <p className="input-error">{errors.roles}</p>
                      </div>
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
        <Confirm_modal
          onClose={() => {
            setShowConfirm(false);
          }}
          onSuccess={onClose}
          confirMessage={confirMessage}
          method={method}
          formData={formData}
          setShowMessage={setShowMessage}
          setTitleMessage={setTitleMessage}
          setMessage={setMessage}
          setStatus={setStatus}
          updateData={updateData}
          uriPost={uriPost}
          token={token}
          loading={loading}
          setLoading={setLoading}
          typeForm={typeForm}
          setTypeForm={setTypeForm}
          feedbackMessages={feedbackMessages}
        />
      )}
    </>
  );
};

export default Form_user;
