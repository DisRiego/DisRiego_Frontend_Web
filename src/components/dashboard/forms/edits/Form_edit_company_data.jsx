import { useEffect, useState } from "react";
import { FaUpload } from "react-icons/fa6";
import {
  validateImage,
  validateLastName,
  validatePhone,
  validateText,
} from "../../../../hooks/useValidations";
import axios from "axios";

const Form_edit_company_data = ({ title, onClose, data }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    nit: "",
    digital_certificate: "",
    icon_company: "",
  });

  useEffect(() => {
    getCompany();
  }, []);

  console.log(formData);

  const getCompany = () => {
    setFormData({
      name: data.name,
      nit: data.nit,
      digital_certificate: 1,
      icon_company: data.logo,
    });
  };

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    const validation = validateImage(selectedFile);

    if (!validation.isValid) {
      setErrors((prev) => ({
        ...prev,
        icon_company: validation.error,
      }));
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setErrors((prev) => ({ ...prev, icon_company: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHasSubmitted(true);

    let newErrors = {};
    if (!validateText(formData.name)) newErrors.name = "Nombre inválido.";
    if (!validatePhone(formData.nit)) newErrors.nit = "NIT inválido.";
    if (!formData.digital_certificate)
      newErrors.digital_certificate = "Debe seleccionar un certificado.";
    if (!formData.icon_company) newErrors.icon_company = "Debe subir un logo.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("nit", formData.nit);
      data.append("digital_certificate_id", formData.digital_certificate);

      if (file) {
        data.append("logo", file);
      }

      try {
        const response = await axios.patch(
          import.meta.env.VITE_URI_BACKEND +
            import.meta.env.VITE_ROUTE_BACKEND_COMPANY_EDIT_BASIC,
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("Respuesta del servidor:", response.data);
      } catch (error) {
        console.error("Error al enviar el formulario:", error);
      }
    }

    // setConfirMessage(`¿Desea cambiar la información basica de la empresa?`);
    // setMethod("post");
    // setUriPost(
    //   import.meta.env.VITE_URI_BACKEND +
    //     import.meta.env.VITE_ROUTE_BACKEND_COMPANY_EDIT_BASIC
    // );
    // setTypeForm("update_basic");
    // setShowConfirm(true);
  };

  return (
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
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="label">Nombre</label>
              <div className="control">
                <input
                  type="text"
                  className={`input ${
                    hasSubmitted ? (errors.name ? "is-false" : "is-true") : ""
                  }`}
                  name="name"
                  placeholder="Ingrese el nombre de la empresa"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              {errors.name && <p className="input-error">{errors.name}</p>}
            </div>

            <div className="field">
              <label className="label">NIT</label>
              <div className="control">
                <input
                  type="number"
                  className={`input ${
                    hasSubmitted ? (errors.nit ? "is-false" : "is-true") : ""
                  }`}
                  name="nit"
                  placeholder="Ingrese el NIT de la empresa"
                  value={formData.nit}
                  onChange={handleChange}
                />
              </div>
              {errors.nit && <p className="input-error">{errors.nit}</p>}
            </div>
            <div className="field">
              <label className="label">Certificado digital</label>
              <div className="control">
                <div
                  className={`select is-fullwidth ${
                    hasSubmitted
                      ? errors.digital_certificate
                        ? "is-false"
                        : "is-true"
                      : ""
                  }`}
                >
                  <select
                    name="digital_certificate"
                    value={formData.digital_certificate}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      Seleccione una opción
                    </option>
                    <option value="1">Certificado 1</option>
                    <option value="2">Certificado 2</option>
                  </select>
                </div>
              </div>
              {errors.digital_certificate && (
                <p className="input-error">{errors.digital_certificate}</p>
              )}
            </div>

            <div className="field">
              <label className="label">Logo de la empresa</label>
              <div
                className={`file has-name is-fullwidth ${
                  errors.icon_company ? "is-danger" : ""
                } error-file`}
              >
                <label className="file-label">
                  <input
                    className="file-input"
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/gif"
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
              {errors.icon_company && (
                <p className="has-text-danger is-6">{errors.icon_company}</p>
              )}
            </div>
          </form>
        </section>
        <footer className="modal-card-foot is-flex is-justify-content-center">
          <div className="buttons">
            <button className="button" onClick={onClose}>
              Cancelar
            </button>
            <button className="button color-hover" onClick={handleSubmit}>
              Guardar
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Form_edit_company_data;
