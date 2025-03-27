import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Confirm_interval from "../../confirm_view/adds/Confirm_interval";
import {
  validatePhone,
  validateTextArea,
} from "../../../../hooks/useValidations";

const Form_interval = ({
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
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [data, setData] = useState({});
  const [confirMessage, setConfirMessage] = useState();
  const [method, setMethod] = useState();
  const [uriPost, setUriPost] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [typeForm, setTypeForm] = useState();

  const [formData, setFormData] = useState({
    name: "",
    interval_days: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    interval_days: "",
  });

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (id != null) {
      getCrop();
    } else {
      setIsLoading(false);
    }
  }, [id]);

  const getCrop = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND +
          import.meta.env.VITE_ROUTE_BACKEND_COMPANY_PAYMENT_INTERVAL_OTHER +
          id
      );

      const intervalData = response.data.data;

      setData(intervalData);

      setFormData({
        name: intervalData.name ? intervalData.name : "",
        interval_days: intervalData.interval_days
          ? intervalData.interval_days
          : "",
      });

      setIsLoading(false);
    } catch (error) {
      console.error("Error al obtener el tipo de cultivo:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSaveClick = () => {
    setSubmitted(true);
    const isNameValid = validateTextArea(formData.name);
    const isIntervalDaysValid = validatePhone(formData.interval_days);

    setErrors({
      name: isNameValid ? "" : "false" && "Nombre inválido",
      interval_days: isIntervalDaysValid ? "" : "false" && "Intervalo inválido",
    });

    if (isNameValid && isIntervalDaysValid) {
      if (id != null) {
        setConfirMessage("¿Desea editar el intervalo?");
        setMethod("put");
        setUriPost(
          import.meta.env.VITE_URI_BACKEND +
            import.meta.env.VITE_ROUTE_BACKEND_COMPANY_PAYMENT_INTERVAL_OTHER +
            id
        );
        setTypeForm("edit");
        setShowConfirm(true);
      } else {
        setConfirMessage('¿Desea crear el intervalo "' + formData.name + '"?');
        setMethod("post");
        setUriPost(
          import.meta.env.VITE_URI_BACKEND +
            import.meta.env.VITE_ROUTE_BACKEND_COMPANY_PAYMENT_INTERVAL
        );
        setTypeForm("create");
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
            <div className="columns">
              <div className="column">
                <div className="field">
                  <label className="label">Nombre</label>
                  <div className="control">
                    <input
                      className={`input ${
                        submitted ? (errors.name ? "is-false" : "is-true") : ""
                      }`}
                      type="text"
                      name="name"
                      placeholder="Ingrese el nombre del intervalo"
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
            </div>

            <div className="container-input">
              <div className="columns">
                <div className="column">
                  <div className="field">
                    <label className="label">Intervalo de tiempo (días)</label>
                    <div className="control">
                      <input
                        className={`input ${
                          submitted
                            ? errors.interval_days
                              ? "is-false"
                              : "is-true"
                            : ""
                        }`}
                        type="number"
                        name="interval_days"
                        placeholder="Ingrese el intevalo de tiempo (días)"
                        value={formData.interval_days}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                    </div>
                    {submitted && errors.interval_days && (
                      <p className="input-error">{errors.interval_days}</p>
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
        <Confirm_interval
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
        />
      )}
    </>
  );
};

export default Form_interval;
