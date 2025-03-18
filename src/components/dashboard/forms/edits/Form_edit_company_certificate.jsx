import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  validateDate,
  validateFile,
  validatePhone,
  validateSerial,
} from "../../../../hooks/useValidations";
import { FaUpload } from "react-icons/fa6";

const Form_edit_company_certificate = ({
  title,
  onClose,
  setShowMessage,
  setTitleMessage,
  setMessage,
  setStatus,
  updateData,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirMessage, setConfirMessage] = useState("");
  const [method, setMethod] = useState("post");
  const [uriPost, setUriPost] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
  const [submitted, setSubmitted] = useState(false);
  const [fileName, setFileName] = useState("");

  const [formData, setFormData] = useState({
    serialNumber: "",
    companyNit: "",
    startDate: "",
    expirationDate: "",
    certificate: null,
  });

  const [errors, setErrors] = useState({
    serialNumber: "",
    companyNit: "",
    startDate: "",
    expirationDate: "",
    certificate: "",
  });

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
      setFormData((prev) => ({ ...prev, certificate: null }));
      setFileName("");
      setErrors((prev) => ({ ...prev, certificate: validation.error }));
      return;
    }

    setFormData((prev) => ({ ...prev, certificate: selectedFile }));
    setFileName(selectedFile.name);
    setErrors((prev) => ({ ...prev, certificate: "" }));
  };

  const handleStartDateFocus = () => {
    if (startDateRef.current) {
      startDateRef.current.showPicker();
    }
  };

  const handleEndDateFocus = () => {
    if (endDateRef.current) {
      endDateRef.current.showPicker();
    }
  };

  const handleSaveClick = () => {
    setSubmitted(true);

    const isSerialValid = validateSerial(formData.serialNumber);
    const isNitValid = validatePhone(formData.companyNit);
    const isStartDateValid = validateDate(formData.startDate);
    const isEndDateValid = validateDate(formData.expirationDate);
    const certificateValidation = formData.certificate
      ? validateFile(formData.certificate)
      : { isValid: false, error: "El certificado digital es requerido" };

    setErrors({
      serialNumber: !isSerialValid ? "Número de serie inválido" : "",
      companyNit: !isNitValid ? "NIT inválido" : "",
      startDate: !isStartDateValid ? "Fecha de inicio inválida" : "",
      expirationDate: isEndDateValid
        ? isDateRangeValid
          ? ""
          : "La fecha de expiración debe ser posterior a la fecha de inicio"
        : "La fecha de expiración es inválida",
      certificate: certificateValidation.isValid
        ? ""
        : certificateValidation.error,
    });

    if (
      isSerialValid &&
      isNitValid &&
      isStartDateValid &&
      isEndDateValid &&
      certificateValidation.isValid &&
      isDateRangeValid
    ) {
      setConfirMessage(`¿Desea añadir el certificado de la empresa?`);
      setMethod("post");
      setUriPost("/certificates");
      setShowConfirm(true);
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
            <div className="field">
              <label className="label">Número de serie</label>
              <div className="control">
                <input
                  className={`input ${
                    submitted
                      ? errors.serialNumber
                        ? "is-false"
                        : "is-true"
                      : ""
                  }`}
                  type="text"
                  name="serialNumber"
                  placeholder="No. de serie"
                  value={formData.serialNumber}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
              {submitted && errors.serialNumber && (
                <p className="input-error">{errors.serialNumber}</p>
              )}
            </div>
            <div className="field">
              <label className="label">NIT de la empresa</label>
              <div className="control">
                <input
                  className={`input ${
                    submitted
                      ? errors.companyNit
                        ? "is-false"
                        : "is-true"
                      : ""
                  }`}
                  type="number"
                  name="companyNit"
                  placeholder="NIT"
                  value={formData.companyNit}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
              {submitted && errors.companyNit && (
                <p className="input-error">{errors.companyNit}</p>
              )}
            </div>
            <div className="columns">
              <div className="column">
                <div className="field">
                  <label className="label">Fecha de inicio</label>
                  <div className="control">
                    <input
                      ref={startDateRef}
                      className={`input ${
                        submitted
                          ? errors.startDate
                            ? "is-false"
                            : "is-true"
                          : ""
                      }`}
                      type="date"
                      name="startDate"
                      placeholder="Fecha inicio"
                      value={formData.startDate}
                      onChange={handleChange}
                      onFocus={handleStartDateFocus}
                      disabled={isLoading}
                    />
                  </div>
                  {submitted && errors.startDate && (
                    <p className="input-error">{errors.startDate}</p>
                  )}
                </div>
              </div>
              <div className="column">
                <div className="field">
                  <label className="label">Fecha de expiración</label>
                  <div className="control">
                    <input
                      ref={endDateRef}
                      className={`input ${
                        submitted
                          ? errors.expirationDate
                            ? "is-false"
                            : "is-true"
                          : ""
                      }`}
                      type="date"
                      name="expirationDate"
                      placeholder="Fecha expiración"
                      value={formData.expirationDate}
                      onChange={handleChange}
                      onFocus={handleEndDateFocus}
                      disabled={isLoading}
                    />
                  </div>
                  {submitted && errors.expirationDate && (
                    <p className="input-error">{errors.expirationDate}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="field">
              <label className="label">Certificado digital</label>
              <div
                className={`file has-name is-fullwidth ${
                  errors.certificate ? "is-danger" : ""
                } error-file`}
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
              {errors.certificate && (
                <p className="has-text-danger is-6">{errors.certificate}</p>
              )}
            </div>
          </section>
          <footer className="modal-card-foot is-flex is-justify-content-center">
            <div className="buttons">
              <button className="button" onClick={onClose}>
                Cancelar
              </button>
              <button className="button color-hover" onClick={handleSaveClick}>
                Confirmar
              </button>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Form_edit_company_certificate;
