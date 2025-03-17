import { useState, useEffect, useRef } from "react";
import axios from "axios";

// Importamos las funciones de validación
import {
  validateDate,
} from "../../../../hooks/useValidations";

// Función de validación para campos numéricos con longitud máxima
const validateNumericField = (value, maxLength = 60) => {
  // Verifica que no esté en blanco
  if (!value || value.trim() === "") return false;
  
  // Verifica que sean solo números
  const numericRegex = /^[0-9]+$/;
  if (!numericRegex.test(value)) return false;
  
  // Verifica la longitud máxima
  if (value.length > maxLength) return false;
  
  return true;
};

// Función para validar el tamaño y tipo de archivo
const validateFile = (file) => {
  if (!file) return { valid: false, message: "El certificado digital es requerido" };
  
  // Validar el tamaño (máximo 1MB)
  const maxSizeInBytes = 1 * 1024 * 1024; // 1MB en bytes
  if (file.size > maxSizeInBytes) {
    return { 
      valid: false, 
      message: "El archivo no debe exceder 1MB de tamaño"
    };
  }
  
  // Validar el tipo (solo PDF)
  if (file.type !== 'application/pdf') {
    return {
      valid: false,
      message: "Solo se permiten archivos PDF"
    };
  }
  
  return { valid: true, message: "" };
};

const Form_edit_certificate = ({
  title,
  onClose,
  setShowMessage,
  setTitleMessage,
  setMessage,
  setStatus,
  updateData,
  certificateData
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirMessage, setConfirMessage] = useState("");
  const [method, setMethod] = useState("put");
  const [uriPost, setUriPost] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    serialNumber: certificateData?.serial_number || "",
    companyNit: certificateData?.company_nit || "",
    startDate: certificateData?.generation_date || "",
    expirationDate: certificateData?.expiration_date || "",
    certificate: null
  });

  const [errors, setErrors] = useState({
    serialNumber: "",
    companyNit: "",
    startDate: "",
    expirationDate: "",
    certificate: ""
  });

  const [submitted, setSubmitted] = useState(false);
  const [fileFieldTouched, setFileFieldTouched] = useState(false);
  const [fileName, setFileName] = useState(certificateData?.attachment || "");

  // Función para manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Función para manejar la carga de archivos
  const handleFileChange = (e) => {
    setFileFieldTouched(true);
    
    const file = e.target.files[0];
    if (file) {
      const fileValidation = validateFile(file);
      
      if (!fileValidation.valid) {
        setErrors({
          ...errors,
          certificate: fileValidation.message
        });
        
        setFileFieldTouched(true);
        
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        setFormData({
          ...formData,
          certificate: null
        });
        setFileName("");
        
        return;
      }
      
      setFormData({
        ...formData,
        certificate: file
      });
      setFileName(file.name);
      
      if (errors.certificate) {
        setErrors({
          ...errors,
          certificate: ""
        });
      }
    } else {
      setErrors({
        ...errors,
        certificate: "El certificado digital es requerido"
      });
    }
  };

  // Función para eliminar el archivo seleccionado
  const handleRemoveFile = (e) => {
    e.stopPropagation();
    
    // Marcar el campo como tocado cuando el usuario elimina un archivo
    setFileFieldTouched(true);
    
    setFormData({
      ...formData,
      certificate: null
    });
    setFileName("");
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Siempre mostrar error cuando se elimina el archivo
    setErrors({
      ...errors,
      certificate: "El certificado digital es requerido"
    });
  };

  // Función para abrir el selector de archivos cuando se hace clic en el área
  const handleFileAreaClick = () => {
    fileInputRef.current.click();
  };

  // Función para manejar el drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setFileFieldTouched(true);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      
      const fileValidation = validateFile(file);
      
      if (!fileValidation.valid) {
        setErrors({
          ...errors,
          certificate: fileValidation.message
        });
        
        setFileFieldTouched(true);
        
        setFormData({
          ...formData,
          certificate: null
        });
        setFileName("");
        
        return;
      }
      
      setFormData({
        ...formData,
        certificate: file
      });
      setFileName(file.name);
      
      if (errors.certificate) {
        setErrors({
          ...errors,
          certificate: ""
        });
      }
    }
  };

  // Evitar que se abra el archivo cuando se suelta en el área
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Abrir los selectores de fecha
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

  // Validar el formulario y mostrar confirmación
  const handleSaveClick = () => {
    setSubmitted(true);
    
    // Validaciones
    const isSerialValid = validateNumericField(formData.serialNumber);
    const isNitValid = validateNumericField(formData.companyNit);
    const isStartDateValid = formData.startDate && formData.startDate.trim() !== "";
    const isEndDateValid = formData.expirationDate && formData.expirationDate.trim() !== "";
    
    // Validación del archivo: Requerimos que haya un archivo seleccionado o que se mantenga el existente
    const hasSelectedNewFile = formData.certificate !== null;
    const isKeepingExistingFile = !fileFieldTouched && fileName !== ""; // No ha tocado el campo y hay un nombre de archivo
    const isFileValid = hasSelectedNewFile || isKeepingExistingFile;
    
    const certificateValidation = formData.certificate 
      ? validateFile(formData.certificate) 
      : isKeepingExistingFile 
        ? { valid: true, message: "" } 
        : { valid: false, message: "El certificado digital es requerido" };
    
    // Verificar que la fecha de expiración sea posterior a la fecha de inicio
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.expirationDate);
    const isDateRangeValid = endDate > startDate;

    setErrors({
      serialNumber: isSerialValid 
        ? "" 
        : formData.serialNumber.trim() === "" 
          ? "El número de serie es requerido" 
          : formData.serialNumber.length > 60
            ? "El número de serie no debe exceder los 60 caracteres"
            : "El número de serie debe contener solo números",
      companyNit: isNitValid 
        ? "" 
        : formData.companyNit.trim() === "" 
          ? "El NIT de la empresa es requerido" 
          : formData.companyNit.length > 60
            ? "El NIT no debe exceder los 60 caracteres"
            : "El NIT debe contener solo números",
      startDate: isStartDateValid ? "" : "La fecha de inicio es requerida",
      expirationDate: isEndDateValid 
        ? isDateRangeValid 
          ? "" 
          : "La fecha de expiración debe ser posterior a la fecha de inicio"
        : "La fecha de expiración es requerida",
      certificate: certificateValidation.valid ? "" : certificateValidation.message
    });

    // Si todas las validaciones pasan
    if (isSerialValid && isNitValid && isStartDateValid && isEndDateValid && certificateValidation.valid && isDateRangeValid && isFileValid) {
      setConfirMessage(`¿Desea actualizar el certificado de la empresa?`);
      setMethod("put");
      setUriPost(`/certificates/${certificateData.id}`);
      setShowConfirm(true);
    }
  };

  // Función para confirmar la actualización del certificado
  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      
      // Crear un FormData para enviar el archivo
      const formDataToSend = new FormData();
      formDataToSend.append("serialNumber", formData.serialNumber);
      formDataToSend.append("companyNit", formData.companyNit);
      formDataToSend.append("startDate", formData.startDate);
      formDataToSend.append("expirationDate", formData.expirationDate);
      
      // Si hay un nuevo archivo, enviarlo
      if (formData.certificate) {
        formDataToSend.append("certificate", formData.certificate);
      }
      
      // Indicar si se debe mantener o eliminar el archivo existente
      formDataToSend.append("keepExistingFile", !fileFieldTouched || !!formData.certificate);

      // Llamada a la API
      const response = await axios({
        method: method,
        url: import.meta.env.VITE_URI_BACKEND + uriPost,
        data: formDataToSend,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setTitleMessage("Certificado actualizado exitosamente");
      setMessage("El certificado se ha actualizado correctamente.");
      setStatus("is-true");
      setShowMessage(true);
      onClose();
      
      // Actualizar datos en el componente padre
      if (updateData) {
        updateData();
      }
    } catch (error) {
      setTitleMessage("Error al actualizar el certificado");
      setMessage("No se pudo actualizar el certificado. Por favor, inténtelo de nuevo.");
      setStatus("is-false");
      setShowMessage(true);
      console.error("Error al actualizar certificado:", error);
    } finally {
      setIsLoading(false);
      setShowConfirm(false);
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
            <div className="field">
              <label className="label">Número de serie</label>
              <div className="control">
                <input
                  className={`input ${
                    submitted ? (errors.serialNumber ? "is-false" : "is-true") : ""
                  }`}
                  type="text"
                  name="serialNumber"
                  placeholder="No. de serie"
                  value={formData.serialNumber}
                  onChange={handleChange}
                  maxLength={60}
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
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
                    submitted ? (errors.companyNit ? "is-false" : "is-true") : ""
                  }`}
                  type="text"
                  name="companyNit"
                  placeholder="NIT"
                  value={formData.companyNit}
                  onChange={handleChange}
                  maxLength={60}
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
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
                        submitted ? (errors.startDate ? "is-false" : "is-true") : ""
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
                        submitted ? (errors.expirationDate ? "is-false" : "is-true") : ""
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
                className={`file-drop-area ${
                  (submitted || fileFieldTouched) && errors.certificate ? "is-false" : formData.certificate ? "is-true" : ""
                }`}
                onClick={formData.certificate ? null : () => {
                  setFileFieldTouched(true);
                  handleFileAreaClick();
                }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  name="certificate"
                  className="file-input"
                  onChange={handleFileChange}
                  accept="application/pdf"
                  style={{ display: 'none' }}
                  disabled={isLoading}
                />
                <div className="file-drop-content">
                  {formData.certificate || fileName ? (
                    <div className="selected-file">
                      <div className="file-info">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="16" y1="13" x2="8" y2="13"></line>
                          <line x1="16" y1="17" x2="8" y2="17"></line>
                          <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                        <div>
                          <span className="file-name">{fileName}</span>
                          {formData.certificate && (
                            <span className="file-size">
                              ({Math.round(formData.certificate.size / 1024)} KB)
                            </span>
                          )}
                        </div>
                      </div>
                      <button 
                        type="button" 
                        className="remove-file-btn"
                        onClick={handleRemoveFile}
                        disabled={isLoading}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="12" y1="18" x2="12" y2="12"></line>
                        <line x1="9" y1="15" x2="15" y2="15"></line>
                      </svg>
                      <p>Haga click o arrastre y suelte el archivo</p>
                      <span>(Solo archivos PDF - Tamaño máx.: 1MB)</span>
                    </>
                  )}
                </div>
              </div>
              {fileFieldTouched && errors.certificate && (
                <p className="input-error file-error">{errors.certificate}</p>
              )}
            </div>
          </section>
          <footer className="modal-card-foot is-flex is-justify-content-center">
            <div className="buttons">
              <button 
                className="button is-danger" 
                onClick={onClose}
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button 
                className={`button color-hover ${isLoading ? "is-loading" : ""}`} 
                onClick={handleSaveClick}
                disabled={isLoading}
              >
                Confirmar
              </button>
            </div>
          </footer>
        </div>
      </div>

      {showConfirm && (
        <div className="modal is-active">
          <div className="modal-background"></div>
          <div className="modal-card p-5">
            <div className="modal-confirm modal-card-body">
              <p className="title has-text-centered is-5">
                ¿Está seguro de realizar la siguiente acción?
              </p>
              <p className="text-confirm has-text-centered mt-2">
                {confirMessage}
              </p>
              <div className="buttons is-centered mt-4">
                <div className="buttons">
                  <button 
                    className="button is-danger" 
                    onClick={() => setShowConfirm(false)}
                    disabled={isLoading}
                  >
                    No, cancelar
                  </button>
                  <button 
                    className={`button color-hover ${isLoading ? "is-loading" : ""}`} 
                    onClick={handleConfirm}
                    disabled={isLoading}
                  >
                    Sí, confirmar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Form_edit_certificate;