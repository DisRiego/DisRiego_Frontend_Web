import { useEffect, useState } from "react";
import { FaUpload } from "react-icons/fa6";
import Confirm_company from "../../confirm_view/Confirm_company";
import {
  validateImage,
  validateLastName,
  validatePhone,
  validateText,
} from "../../../../hooks/useValidations";
import axios from "axios";

const Form_edit_company_data = ({
  title,
  onClose,
  data,
  setShowMessage,
  setTitleMessage,
  setMessage,
  setStatus,
  loading,
  setLoading,
  updateData,
}) => {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirMessage, setConfirMessage] = useState();
  const [method, setMethod] = useState();
  const [uriPost, setUriPost] = useState("");
  const [typeForm, setTypeForm] = useState("");
  const [newData, setNewData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [certificateData, setCertificateData] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    nit: "",
    digital_certificate_id: "",
  });

  useEffect(() => {
    getCertificate();
  }, []);

  useEffect(() => {
    if (data) {
      getCompany();
    }
  }, [data]);

  const getCompany = () => {
    setFormData({
      name: data.name,
      nit: data.nit,
      digital_certificate_id: data.certificate.digital_certificate_id,
    });
  };

  console.log(formData);

  const getCertificate = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND +
          import.meta.env.VITE_ROUTE_BACKEND_COMPANY_CERTIFICATE
      );
      const certificateData = response.data.data;
      setCertificateData(certificateData);
      setIsLoading(false);

      // setDisabled(false);
    } catch (error) {
      console.log("Error al obtener el certificado", error);
    }
  };

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHasSubmitted(true);

    let newErrors = {};
    if (!validateText(formData.name)) newErrors.name = "Nombre inválido.";
    if (!validatePhone(formData.nit)) newErrors.nit = "NIT inválido.";
    if (!validatePhone(formData.digital_certificate_id))
      newErrors.digital_certificate_id = "Certificado inválido.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("nit", formData.nit);
      data.append(
        "digital_certificate_id",
        parseInt(formData.digital_certificate_id, 10)
      );

      setNewData(data);
      setConfirMessage(`¿Desea cambiar la información basica de la empresa?`);
      setMethod("patch");
      setUriPost(
        import.meta.env.VITE_URI_BACKEND +
          import.meta.env.VITE_ROUTE_BACKEND_COMPANY_EDIT_BASIC
      );
      setTypeForm("update_basic");
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
                    disabled={isLoading}
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
                    disabled={isLoading}
                  />
                </div>
                {errors.nit && <p className="input-error">{errors.nit}</p>}
              </div>
              <div className="field">
                <div className="field">
                  <label className="label">Certificado digital</label>
                  <div className="control">
                    <div
                      className={`select ${
                        hasSubmitted
                          ? errors.name
                            ? "is-false"
                            : "is-true"
                          : ""
                      }`}
                    >
                      <select
                        name="digital_certificate_id"
                        value={formData.digital_certificate_id}
                        onChange={handleChange}
                        disabled={isLoading}
                      >
                        <option value="" disabled>
                          Seleccione una opción
                        </option>
                        {certificateData.map((certificate) => (
                          <option key={certificate.id} value={certificate.id}>
                            {certificate.serial_number}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.digital_certificate_id && (
                      <p className="input-error">
                        {errors.digital_certificate_id}
                      </p>
                    )}
                  </div>
                </div>
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
      {showConfirm && (
        <Confirm_company
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

export default Form_edit_company_data;
