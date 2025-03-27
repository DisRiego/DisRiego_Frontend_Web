import { useEffect, useRef, useState } from "react";
import Confirm_certificate from "../../confirm_view/adds/Confirm_certificate";
import axios from "axios";
import {
  validateFile,
  validatePhone,
  validateBirthdate,
  validateIssuanceDate,
  validateExpirationDate,
} from "../../../../hooks/useValidations";
import { FaUpload } from "react-icons/fa6";

const Form_certificate = ({
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
  const [data, setData] = useState();
  const [submitted, setSubmitted] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [newData, setNewData] = useState();
  const [confirMessage, setConfirMessage] = useState();
  const [method, setMethod] = useState();
  const [uriPost, setUriPost] = useState("");
  const [typeForm, setTypeForm] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const startDateInputRef = useRef(null);
  const dateExpirationInputRef = useRef(null);

  const [formData, setFormData] = useState({
    serial_number: "",
    nit: "",
    start_date: "",
    expiration_date: "",
    certificate_file: null,
  });

  const [errors, setErrors] = useState({
    serial_number: "",
    nit: "",
    start_date: "",
    expiration_date: "",
    certificate_file: null,
  });

  const [errorFile, setErrorFile] = useState("");

  useEffect(() => {
    if (id != null) {
      getCertificate();
    } else {
      setDisabled(false);
    }
  }, [id]);

  const getCertificate = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND +
          import.meta.env.VITE_ROUTE_BACKEND_COMPANY_CERTIFICATE_OTHER +
          id
      );
      if (response.data.success === true) {
        const certificateData = response.data.data;
        setData(certificateData);

        setFormData({
          serial_number: certificateData.serial_number || "",
          nit: certificateData.nit || "",
          start_date: certificateData.start_date || "",
          expiration_date: certificateData.expiration_date || "",
        });

        setDisabled(false);
      } else {
        console.error("Certificado no encontrado");
      }
    } catch (error) {
      console.log("Error al obtener el certificado", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (event) => {
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

  const handleStartDate = () => {
    if (startDateInputRef.current) {
      startDateInputRef.current.showPicker();
    }
  };

  const handleExpirationDate = () => {
    if (dateExpirationInputRef.current) {
      dateExpirationInputRef.current.showPicker();
    }
  };

  const handleSaveClick = async () => {
    setSubmitted(true);
    const isSerialValid = validatePhone(formData.serial_number);
    const isNitValid = validatePhone(formData.nit);
    const isStartDateValid = validateBirthdate(formData.start_date);
    const isExpirationDateValid = validateExpirationDate(
      formData.start_date,
      formData.expiration_date
    );

    // const startDate = new Date(formData.start_date);
    // const expirationDate = new Date(formData.expiration_date);
    // const isDateValid = isExpirationDateValid && expirationDate >= startDate;

    setErrors({
      serial_number: isSerialValid ? "" : "Número de serie inválido",
      nit: isNitValid ? "" : "Nit inválido",
      start_date: isStartDateValid ? "" : "Fecha de generación inválida",
      expiration_date: isExpirationDateValid
        ? ""
        : "Fecha de expiración inválida",
    });

    if (!file && !id) setErrorFile("Debes seleccionar un archivo válido");

    if (
      isSerialValid &&
      isNitValid &&
      isStartDateValid &&
      isExpirationDateValid &&
      (id || file)
    ) {
      const formArchive = new FormData();
      formArchive.append("serial_number", formData.serial_number);
      formArchive.append("nit", formData.nit);
      formArchive.append("start_date", formData.start_date);
      formArchive.append("expiration_date", formData.expiration_date);

      if (file) {
        formArchive.append("certificate_file", file);
      }

      setNewData(formArchive);

      const formObject = Object.fromEntries(formArchive.entries());
      console.log(formObject);

      if (id != null) {
        setConfirMessage(`¿Desea actualizar el certificado?`);
        setMethod("put");
        setUriPost(
          import.meta.env.VITE_URI_BACKEND +
            import.meta.env.VITE_ROUTE_BACKEND_COMPANY_CERTIFICATE_OTHER +
            id,
          newData
        );
        setTypeForm("edit_certificate");
        setShowConfirm(true);
      } else {
        setConfirMessage(`¿Desea crear un nuevo certificado digital?`);
        setMethod("post");
        setUriPost(
          import.meta.env.VITE_URI_BACKEND +
            import.meta.env.VITE_ROUTE_BACKEND_COMPANY_CERTIFICATE,
          newData
        );
        setTypeForm("create_certificate");
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
            <div className="columns columns-mb">
              <div className="column">
                <div className="field">
                  <label className="label">Número de serie</label>
                  <div className="control">
                    <input
                      className={`input ${
                        submitted
                          ? errors.serial_number
                            ? "is-false"
                            : ""
                          : ""
                      }`}
                      type="number"
                      name="serial_number"
                      placeholder="Ingrese el número de serie"
                      onChange={handleChange}
                      value={formData.serial_number}
                      disabled={disabled}
                    />
                  </div>
                  {submitted && errors.serial_number && (
                    <p className="input-error">{errors.serial_number}</p>
                  )}
                </div>
              </div>
              <div className="column">
                <div className="field">
                  <label className="label">NIT de la empresa</label>
                  <div className="control">
                    <input
                      className={`input ${
                        submitted ? (errors.nit ? "is-false" : "") : ""
                      }`}
                      type="number"
                      name="nit"
                      placeholder="Ingrese el NIT de la empresa"
                      onChange={handleChange}
                      value={formData.nit}
                      disabled={disabled}
                    />
                  </div>
                  {submitted && errors.nit && (
                    <p className="input-error">{errors.nit}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="columns columns-mb">
              <div className="column">
                <div className="field">
                  <label className="label">Fecha de generación</label>
                  <div className="control">
                    <input
                      className={`input ${
                        submitted ? (errors.start_date ? "is-false" : "") : ""
                      }`}
                      ref={startDateInputRef}
                      type="date"
                      name="start_date"
                      onChange={handleChange}
                      value={formData.start_date}
                      disabled={disabled}
                      onFocus={handleStartDate}
                    />
                  </div>
                  {submitted && errors.start_date && (
                    <p className="input-error">{errors.start_date}</p>
                  )}
                </div>
              </div>
              <div className="column">
                <div className="field">
                  <label className="label">Fecha de expiración</label>
                  <div className="control">
                    <input
                      className={`input ${
                        submitted
                          ? errors.expiration_date
                            ? "is-false"
                            : ""
                          : ""
                      }`}
                      ref={dateExpirationInputRef}
                      type="date"
                      name="expiration_date"
                      onChange={handleChange}
                      value={formData.expiration_date}
                      disabled={disabled}
                      onFocus={handleExpirationDate}
                    />
                  </div>
                  {submitted && errors.expiration_date && (
                    <p className="input-error">{errors.expiration_date}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="columns columns-mb">
              <div className="column">
                <div className="field">
                  <label className="label">Certificado digital (anexo)</label>
                  <div
                    className={`file mb-0 has-name is-fullwidth ${
                      errorFile ? "is-danger" : ""
                    }`}
                  >
                    <label className="file-label">
                      <input
                        className="file-input"
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                      />
                      <span className="file-cta">
                        <span className="file-icon">
                          <FaUpload />
                        </span>
                        <span className="file-label"> Subir foto… </span>
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
        <Confirm_certificate
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

export default Form_certificate;
