import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Confirm_crop from "../../confirm_view/adds/Confirm_crop";
import {
  validatePhone,
  validateTextArea,
} from "../../../../hooks/useValidations";

const Form_lot_user = ({
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
  const [typeDocument, setTypeDocument] = useState([]);
  const [data, setData] = useState({});
  const [confirMessage, setConfirMessage] = useState();
  const [method, setMethod] = useState();
  const [uriPost, setUriPost] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [typeForm, setTypeForm] = useState();

  const [formData, setFormData] = useState({
    name: "",
    harvest_time: "",
    payment_interval_id: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    harvest_time: "",
    payment_interval_id: "",
  });

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchPayment();
    if (id != null) {
      getCrop();
    }
  }, [id]);

  const fetchPayment = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND +
          import.meta.env.VITE_ROUTE_BACKEND_COMPANY_PAYMENT_INTERVAL
      );
      const sortedData = response.data.data.sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      setTypeDocument(sortedData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error al obtener los intervalos de pago:", error);
    }
  };

  const getCrop = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND +
          import.meta.env.VITE_ROUTE_BACKEND_COMPANY_CROP_OTHER +
          id
      );

      const cropData = response.data.data;

      setData(cropData);

      setFormData({
        name: cropData.name ? cropData.name : "",
        harvest_time: cropData.harvest_time ? cropData.harvest_time : "",
        payment_interval_id: cropData.payment_interval_id
          ? cropData.payment_interval_id
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
    const isHarvestTimeValid = validatePhone(formData.harvest_time);
    const isPaymentIntervalValid = validatePhone(formData.payment_interval_id);

    setErrors({
      name: isNameValid ? "" : "false" && "Nombre inválido",
      harvest_time: isHarvestTimeValid
        ? ""
        : "false" && "Tiempo estimado inválido",
      payment_interval_id: isPaymentIntervalValid
        ? ""
        : "false" && "Intervalo de pago inválido",
    });

    if (isNameValid && isHarvestTimeValid && isPaymentIntervalValid) {
      if (id != null) {
        setConfirMessage("¿Desea editar el tipo de cultivo?");
        setMethod("put");
        setUriPost(
          import.meta.env.VITE_URI_BACKEND +
            import.meta.env.VITE_ROUTE_BACKEND_COMPANY_CROP_OTHER +
            id
        );
        setTypeForm("edit");
        setShowConfirm(true);
      } else {
        setConfirMessage('¿Desea crear el cultivo "' + formData.name + '"?');
        setMethod("post");
        setUriPost(
          import.meta.env.VITE_URI_BACKEND +
            import.meta.env.VITE_ROUTE_BACKEND_COMPANY_CROP
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
                  <label className="label">Tipo de cultivo</label>
                  <div className="control">
                    <input
                      className={`input ${
                        submitted ? (errors.name ? "is-false" : "is-true") : ""
                      }`}
                      type="text"
                      name="name"
                      placeholder="Ingrese el nombre del cultivo"
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
                    <label className="label">
                      Tiempo estimado de cosecha (días)
                    </label>
                    <div className="control">
                      <input
                        className={`input ${
                          submitted
                            ? errors.harvest_time
                              ? "is-false"
                              : "is-true"
                            : ""
                        }`}
                        type="text"
                        name="harvest_time"
                        placeholder="Ingrese el tiempo estimado de cosecha"
                        value={formData.harvest_time}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                    </div>
                    {submitted && errors.harvest_time && (
                      <p className="input-error">{errors.harvest_time}</p>
                    )}
                  </div>
                </div>
                <div className="column">
                  <div className="field">
                    <label className="label">Intervalo de pago</label>
                    <div className="control">
                      <div
                        className={`select ${
                          submitted
                            ? errors.payment_interval_id
                              ? "is-false"
                              : "is-true"
                            : ""
                        }`}
                      >
                        <select
                          name="payment_interval_id"
                          value={formData.payment_interval_id}
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
                      {submitted && errors.payment_interval_id && (
                        <p className="input-error">
                          {errors.payment_interval_id}
                        </p>
                      )}
                    </div>
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
        <Confirm_crop
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

export default Form_lot_user;
