import { useEffect, useState } from "react";
import Confirm_lot from "../../confirm_view/adds/Confirm_lot";
import {
  validateFile,
  validateLatitude,
  validateLongitude,
  validatePhone,
  validateText,
} from "../../../../hooks/useValidations";
import { FaUpload } from "react-icons/fa6";
import axios from "axios";

const Form_lot = ({
  title,
  onClose,
  setShowMessage,
  setTitleMessage,
  setMessage,
  setStatus,
  updateData,
  id,
  idRow,
  loading,
  setLoading,
}) => {
  const [data, setData] = useState();
  const [submitted, setSubmitted] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileCtl, setFileCtl] = useState(null);
  const [fileNameCtl, setFileNameCtl] = useState("");
  const [newData, setNewData] = useState();
  const [confirMessage, setConfirMessage] = useState();
  const [method, setMethod] = useState();
  const [uriPost, setUriPost] = useState("");
  const [typeForm, setTypeForm] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    property_id: parseInt(id, 10),
    name: "",
    longitude: "",
    latitude: "",
    extension: "",
    real_estate_registration_number: "",
  });

  const [errors, setErrors] = useState({
    property_id: "",
    name: "",
    longitude: "",
    latitude: "",
    extension: "",
    real_estate_registration_number: "",
  });

  const [errorFile, setErrorFile] = useState("");
  const [errorFileCtl, setErrorFileCtl] = useState("");

  useEffect(() => {
    if (idRow != null) {
      fetLot();
    } else {
      setDisabled(false);
    }
  }, [idRow]);

  const fetLot = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND +
          import.meta.env.VITE_ROUTE_BACKEND_LOTS_PROPERTY +
          idRow
      );
      if (response.data.success === true) {
        const lotData = response.data.data;
        setData(lotData);

        setFormData({
          name: lotData.name || "",
          longitude: lotData.longitude || "",
          latitude: lotData.latitude || "",
          extension: lotData.extension || "",
          real_estate_registration_number:
            lotData.real_estate_registration_number || "",
        });

        setDisabled(false);
      } else {
        console.error("El lote no fue encontrado");
      }
    } catch (error) {
      console.log("Error al obtener el lote", error);
    }
  };

  const handleChangeProperty = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
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

    if (!file && !idRow) setErrorFile("Debes seleccionar un archivo válido.");
    if (!fileCtl && !idRow)
      setErrorFileCtl("Debes seleccionar un archivo válido.");

    if (
      isNameValid &&
      isLongitudeValid &&
      isLatitudeValid &&
      isExtensionValid &&
      isRealStateValid &&
      (idRow || (file && fileCtl))
    ) {
      const formArchive = new FormData();
      formArchive.append("property_id", formData.property_id);
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

      const formObject = Object.fromEntries(formArchive.entries());
      console.log(formObject);

      if (idRow != null) {
        setConfirMessage(`¿Desea actualizar el predio?`);
        setMethod("put");
        setUriPost(
          import.meta.env.VITE_URI_BACKEND +
            import.meta.env.VITE_ROUTE_BACKEND_LOTS_PROPERTY +
            idRow,
          newData
        );
        setTypeForm("edit_lot");
        setShowConfirm(true);
      } else {
        setConfirMessage(`¿Desea crear el predio "${formData.name}"?`);
        setMethod("post");
        setUriPost(
          import.meta.env.VITE_URI_BACKEND +
            import.meta.env.VITE_ROUTE_BACKEND_LOTS_PROPERTY,
          newData
        );
        setTypeForm("create_lot");
        setShowConfirm(true);
      }
    }
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
            <div className="columns columns-mb">
              <div className="column">
                <div className="field">
                  <label className="label">Nombre del lote</label>
                  <div className="control">
                    <input
                      className={`input ${
                        submitted ? (errors.name ? "is-false" : "") : ""
                      }`}
                      type="text"
                      name="name"
                      onChange={handleChangeProperty}
                      placeholder="Ingrese el nombre del lote"
                      value={formData.name}
                      disabled={disabled}
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
                  <label className="label">Número de folio inmobiliario</label>
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
                      disabled={disabled}
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
                        submitted ? (errors.extension ? "is-false" : "") : ""
                      }`}
                      type="number"
                      name="extension"
                      placeholder="Ingrese la extensión del lote"
                      onChange={handleChangeProperty}
                      value={formData.extension}
                      disabled={disabled}
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
                      disabled={disabled}
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
                        submitted ? (errors.longitude ? "is-false" : "") : ""
                      }`}
                      type="text"
                      name="longitude"
                      placeholder="Ingrese la longitud"
                      onChange={handleChangeProperty}
                      value={formData.longitude}
                      disabled={disabled}
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
                        disabled={disabled}
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
                        disabled={disabled}
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
          </section>
          <footer className="modal-card-foot is-flex is-justify-content-center">
            <div className="buttons">
              <button className="button" onClick={onClose}>
                Cancelar
              </button>
              <button
                className="button is-primary button-login"
                onClick={handleSaveClick}
              >
                Guardar
              </button>
            </div>
          </footer>
        </div>
      </div>
      {showConfirm && (
        <Confirm_lot
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
        />
      )}
    </>
  );
};

export default Form_lot;
