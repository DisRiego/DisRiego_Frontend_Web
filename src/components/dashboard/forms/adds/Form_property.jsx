import { useEffect, useState } from "react";
import axios from "axios";
import Confirm_modal from "../../reusable/Confirm_modal";
import {
  validateFile,
  validateLatitude,
  validateLongitude,
  validatePhone,
  validateText,
} from "../../../../hooks/useValidations";
import { FaSearch } from "react-icons/fa";
import { IoMdWarning } from "react-icons/io";
import { FaUpload } from "react-icons/fa6";

const Form_property = ({
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
}) => {
  const [typeDocument, setTypeDocument] = useState([]);
  const [submittedUser, setSubmittedUser] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [userValidate, setUserValidate] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [nameUser, setNameUser] = useState({});
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileCtl, setFileCtl] = useState(null);
  const [fileNameCtl, setFileNameCtl] = useState("");
  const [newData, setNewData] = useState();
  const [confirMessage, setConfirMessage] = useState();
  const [method, setMethod] = useState();
  const [uriPost, setUriPost] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [typeForm, setTypeForm] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [dataProperty, setDataProperty] = useState({});

  const feedbackMessages = {
    create_property: {
      successTitle: "Predio creado exitosamente",
      successMessage: "El predio se ha creado correctamente.",
      errorTitle: "Error al crear el predio",
      errorMessage:
        "No se pudo crear el predio. Por favor, inténtelo de nuevo.",
    },
    edit_property: {
      successTitle: "Predio actualizado exitosamente",
      successMessage: "El predio ha sido actualizado correctamente.",
      errorTitle: "Error al actualizar el predio",
      errorMessage:
        "No se pudo actualizar el predio. Por favor, inténtelo de nuevo.",
    },
  };

  const [formUser, setFormUser] = useState({
    document_type: "",
    document_number: "",
  });

  const [errorsUser, setErrorsUser] = useState({
    document_type: "",
    document_number: "",
  });

  const [formData, setFormData] = useState({
    user_id: "",
    name: "",
    longitude: "",
    latitude: "",
    extension: "",
    real_estate_registration_number: "",
  });

  const [errors, setErrors] = useState({
    user_id: "",
    name: "",
    longitude: "",
    latitude: "",
    extension: "",
    real_estate_registration_number: "",
  });

  const [errorFile, setErrorFile] = useState("");
  const [errorFileCtl, setErrorFileCtl] = useState("");

  useEffect(() => {
    fetchTypeDocument();
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

  useEffect(() => {
    if (id != null) {
      fetchProperty();
      setShowForm(true);
      setDisabled(false);
    }
  }, [id]);

  const fetchProperty = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND +
          import.meta.env.VITE_ROUTE_BACKEND_PROPERTY +
          id
      );
      const propertyData = response.data.data;
      setDataProperty(propertyData);

      setFormData({
        user_id: propertyData?.owner_id || "",
        name: propertyData?.name || "",
        longitude: propertyData?.longitude || "",
        latitude: propertyData?.latitude || "",
        extension: propertyData?.extension || "",
        real_estate_registration_number:
          propertyData?.real_estate_registration_number || "",
      });
    } catch (error) {
      console.log("Error al obtener el predio:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormUser({
      ...formUser,
      [name]: value,
    });
  };

  const handleChangeProperty = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleValidate = async () => {
    setSubmittedUser(true);
    const isTypeDocumentValid = validatePhone(formUser.document_type);
    const isNumberDocumentValid = validatePhone(formUser.document_number);

    setErrorsUser({
      document_type: isTypeDocumentValid ? "" : "Tipo de documento inválido",
      document_number: isNumberDocumentValid
        ? ""
        : "Número de documento inválido",
    });
    if (isTypeDocumentValid && isNumberDocumentValid) {
      try {
        const response = await axios.post(
          import.meta.env.VITE_URI_BACKEND +
            import.meta.env.VITE_ROUTE_BACKEND_SEARCH_USER,
          formUser,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setFormData({
          user_id: response.data.data.user_id,
          name: "",
          longitude: "",
          latitude: "",
          extension: "",
          real_estate_registration_number: "",
          freedom_tradition_certificate: null,
          public_deed: null,
        });

        setNameUser(response.data.data);

        setUserValidate("");
        setShowForm(true);
        setDisabled(false);
      } catch (error) {
        if (error.status === 422) {
          setUserValidate("");
          // setUserValidate("El usuario no está registrado en la plataforma");
        } else {
          // setUserValidate("");
          setDisabled(true);
          setUserValidate("El usuario no está registrado en la plataforma");
        }

        setShowForm(false);
      }
    }
  };

  const handleFilePublicChange = (event) => {
    const selectedFile = event.target.files[0];
    const validation = validateFile(selectedFile);

    if (!validation.isValid) {
      setFile(null);
      setFileName("");
      setErrorFile(validation.error);
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setErrorFile("");
  };

  const handleFileCtlChange = (event) => {
    const selectedFile = event.target.files[0];
    const validation = validateFile(selectedFile);

    if (!validation.isValid) {
      setFileCtl(null);
      setFileNameCtl("");
      setErrorFileCtl(validation.error);
      return;
    }

    setFileCtl(selectedFile);
    setFileNameCtl(selectedFile.name);
    setErrorFileCtl("");
  };

  const toTitleCase = (str) => {
    if (typeof str !== "string") return str; // Evita errores si el input no es un string

    return str
      .toLowerCase() // Convierte todo a minúsculas primero
      .split(" ") // Divide el texto en palabras
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Convierte la primera letra de cada palabra en mayúscula
      .join(" "); // Une las palabras nuevamente en una sola cadena
  };

  const handleSaveClick = async () => {
    setSubmitted(true);
    const isNameValid = validateText(formData.name);
    const isLongitudeValid = validateLongitude(formData.longitude);
    const isLatitudeValid = validateLatitude(formData.latitude);
    const isExtensionValid = validatePhone(formData.extension);
    const isRealStateValid = validatePhone(
      formData.real_estate_registration_number
    );

    setErrors({
      name: isNameValid ? "" : "Nombre del predio inválido",
      longitude: isLongitudeValid ? "" : "Longitud inválida",
      latitude: isLatitudeValid ? "" : "Latitud inválida",
      extension: isExtensionValid ? "" : "Extensión inválida",
      real_estate_registration_number: isRealStateValid
        ? ""
        : "Número de folio inválido",
    });

    if (!file && !id) setErrorFile("Debes seleccionar un archivo válido.");
    if (!fileCtl && !id)
      setErrorFileCtl("Debes seleccionar un archivo válido.");

    if (
      isNameValid &&
      isLongitudeValid &&
      isLatitudeValid &&
      isExtensionValid &&
      isRealStateValid &&
      (id || (file && fileCtl))
    ) {
      const formArchive = new FormData();
      formArchive.append("user_id", formData.user_id);
      formArchive.append("name", formData.name);
      formArchive.append("longitude", formData.longitude);
      formArchive.append("latitude", formData.latitude);
      formArchive.append("extension", formData.extension);
      formArchive.append(
        "real_estate_registration_number",
        formData.real_estate_registration_number
      );

      if (file) {
        formArchive.append("freedom_tradition_certificate", file);
      }
      if (fileCtl) {
        formArchive.append("public_deed", fileCtl);
      }

      setNewData(formArchive);

      if (id != null) {
        setConfirMessage(`¿Desea actualizar el predio?`);
        setMethod("put");
        setUriPost(
          import.meta.env.VITE_URI_BACKEND +
            import.meta.env.VITE_ROUTE_BACKEND_PROPERTY +
            id,
          newData
        );
        setTypeForm("edit_property");
        setShowConfirm(true);
      } else {
        setConfirMessage(`¿Desea crear el predio "${formData.name}"?`);
        setMethod("post");
        setUriPost(
          import.meta.env.VITE_URI_BACKEND +
            import.meta.env.VITE_ROUTE_BACKEND_PROPERTY,
          newData
        );
        setTypeForm("create_property");
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
            {/* Inputs aquí */}
            {id == null && (
              <div className="columns columns-mb">
                <div className="column">
                  <div className="field">
                    <label className="label">Tipo de documento</label>
                    <div className="control">
                      <div
                        className={`select ${
                          submittedUser
                            ? errorsUser.document_type
                              ? "is-false"
                              : ""
                            : ""
                        }`}
                      >
                        <select
                          className={`select`}
                          name="document_type"
                          value={formUser.document_type}
                          onChange={handleChange}
                          // disabled={isLoading}
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
                      {submittedUser && errorsUser.document_type && (
                        <p className="input-error">
                          {errorsUser.document_type}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="column">
                  <div className="control">
                    <label className="label">Número de documento</label>
                    <div className="field has-addons mb-0">
                      <div className="control is-expanded">
                        <input
                          className={`input ${
                            submittedUser
                              ? errorsUser.document_number
                                ? "is-false"
                                : ""
                              : ""
                          }`}
                          name="document_number"
                          type="number"
                          placeholder="Ingrese el número de documento"
                          value={formUser.document_number}
                          onChange={handleChange}
                          // disabled={isLoading}
                        />
                      </div>
                      <div className="control">
                        <button
                          className={`button button-search ${
                            submittedUser
                              ? errorsUser.document_number
                                ? "is-false"
                                : ""
                              : ""
                          }`}
                          onClick={handleValidate}
                        >
                          <FaSearch className="" />
                        </button>
                      </div>
                    </div>
                    {submittedUser && errorsUser.document_number && (
                      <p className="input-error">
                        {errorsUser.document_number}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
            {userValidate != "" && (
              <div className="is-flex is-flex-direction-row	is-justify-content-center is-align-items-center">
                <IoMdWarning className="icon login-error mr-2" />
                <p className="input-error">{userValidate}</p>
              </div>
            )}
            {showForm && (
              <>
                {id == null && (
                  <div className="columns columns-mb">
                    <div className="column">
                      <div className="field">
                        <label className="label">Nombre del Usuario</label>
                        <div className="control">
                          <input
                            className="input"
                            type="text"
                            disabled
                            value={
                              `${[
                                nameUser.name,
                                nameUser.first_lastname,
                                nameUser.second_lastname,
                              ]
                                .map(toTitleCase) // Aplica Title Case a cada parte del nombre
                                .filter(Boolean) // Elimina valores vacíos
                                .join(" ")}` // Une con un solo espacio
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="columns columns-mb">
                  <div className="column">
                    <div className="field">
                      <label className="label">Nombre del predio</label>
                      <div className="control">
                        <input
                          className={`input ${
                            submitted ? (errors.name ? "is-false" : "") : ""
                          }`}
                          type="text"
                          name="name"
                          placeholder="Ingrese el nombre del predio"
                          onChange={handleChangeProperty}
                          value={formData.name}
                        />
                      </div>
                      {submitted && errors.name && (
                        <p className="input-error">{errors.name}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="columns columns-mb">
                  <div className="column">
                    <div className="field">
                      <label className="label">
                        Número de folio inmobiliario
                      </label>
                      <div className="control">
                        <input
                          className={`input ${
                            submitted
                              ? errors.real_estate_registration_number
                                ? "is-false"
                                : ""
                              : ""
                          }`}
                          type="text"
                          name="real_estate_registration_number"
                          placeholder="Ingrese el número de folio inmobiliario"
                          onChange={handleChangeProperty}
                          value={formData.real_estate_registration_number}
                        />
                      </div>
                      {submitted && errors.real_estate_registration_number && (
                        <p className="input-error">
                          {errors.real_estate_registration_number}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="column">
                    <div className="field">
                      <label className="label">Extensión (m²)</label>
                      <div className="control">
                        <input
                          className={`input ${
                            submitted
                              ? errors.extension
                                ? "is-false"
                                : ""
                              : ""
                          }`}
                          type="number"
                          name="extension"
                          placeholder="Ingrese la extensión del predio"
                          onChange={handleChangeProperty}
                          value={formData.extension}
                        />
                      </div>
                      {submitted && errors.extension && (
                        <p className="input-error">{errors.extension}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="columns columns-mb">
                  <div className="column">
                    <div className="field">
                      <label className="label">Latitud</label>
                      <div className="control">
                        <input
                          className={`input ${
                            submitted ? (errors.latitude ? "is-false" : "") : ""
                          }`}
                          type="text"
                          name="latitude"
                          placeholder="Ingrese la latitud"
                          onChange={handleChangeProperty}
                          value={formData.latitude}
                        />
                      </div>
                      {submitted && errors.latitude && (
                        <p className="input-error">{errors.latitude}</p>
                      )}
                    </div>
                  </div>
                  <div className="column">
                    <div className="field">
                      <label className="label">Longitud</label>
                      <div className="control">
                        <input
                          className={`input ${
                            submitted
                              ? errors.longitude
                                ? "is-false"
                                : ""
                              : ""
                          }`}
                          type="text"
                          name="longitude"
                          placeholder="Ingrese la longitud"
                          onChange={handleChangeProperty}
                          value={formData.longitude}
                        />
                      </div>
                      {submitted && errors.longitude && (
                        <p className="input-error">{errors.longitude}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="columns columns-mb">
                  <div className="column">
                    <div className="field">
                      <div className="label">Escritura pública</div>
                      <div
                        className={`file has-name is-boxed is-centered  ${
                          errorFile ? "is-danger" : ""
                        }`}
                      >
                        <label className="file-label">
                          <input
                            className="file-input"
                            type="file"
                            accept="application/pdf"
                            onChange={handleFilePublicChange}
                          />
                          <span className="file-cta">
                            <span className="file-icon">
                              <FaUpload />
                            </span>
                            <span className="file-label">Subir archivo…</span>
                          </span>
                          <span className="file-name">
                            {fileName || "Ningún archivo seleccionado"}
                          </span>
                        </label>
                      </div>
                      {errorFile && (
                        <p className="has-text-danger is-6">{errorFile}</p>
                      )}
                    </div>
                  </div>
                  <div className="column">
                    <div className="field">
                      <div className="label">
                        Certificado de libertad y tradición
                      </div>
                      <div
                        className={`file has-name is-boxed is-centered ${
                          errorFileCtl ? "is-danger" : ""
                        }`}
                      >
                        <label className="file-label">
                          <input
                            className="file-input"
                            type="file"
                            accept="application/pdf"
                            onChange={handleFileCtlChange}
                          />
                          <span className="file-cta">
                            <span className="file-icon">
                              <FaUpload />
                            </span>
                            <span className="file-label">Subir archivo…</span>
                          </span>
                          <span className="file-name">
                            {fileNameCtl || "Ningún archivo seleccionado"}
                          </span>
                        </label>
                      </div>
                      {errorFileCtl && (
                        <p className="has-text-danger is-6">{errorFileCtl}</p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </section>
          <footer className="modal-card-foot is-flex is-justify-content-center">
            <div className="buttons">
              <button className="button" onClick={onClose}>
                Cancelar
              </button>
              <button
                className="button is-primary button-login"
                disabled={disabled}
                onClick={handleSaveClick}
              >
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
          formData={newData}
          setShowMessage={setShowMessage}
          setTitleMessage={setTitleMessage}
          setMessage={setMessage}
          setStatus={setStatus}
          updateData={updateData}
          uriPost={uriPost}
          typeForm={typeForm}
          loading={loading}
          setLoading={setLoading}
          feedbackMessages={feedbackMessages}
        />
      )}
    </>
  );
};

export default Form_property;
