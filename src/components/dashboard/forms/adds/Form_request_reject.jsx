import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  validatePhone,
  validateDescriptionReject,
} from "../../../../hooks/useValidations";
import Confirm_reject_request from "../../confirm_view/adds/Confirm_reject_request";

const Form_request_reject = ({
  title,
  onClose,
  setShowMessage,
  setTitleMessage,
  setMessage,
  setStatus,
  loading,
  setLoading,
  id,
  updateData,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [confirMessage, setConfirMessage] = useState();
  const [method, setMethod] = useState();
  const [uriPost, setUriPost] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [typeForm, setTypeForm] = useState();
  const [typeAperture, setTypeAperture] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    request_id: id,
    reason_id: "",
    comment: "",
  });

  const [errors, setErrors] = useState({
    request_id: "",
    reason_id: "",
    comment: "",
  });

  useEffect(() => {
    getTypeAperture();
  }, []);

  const getTypeAperture = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND_IOT +
          import.meta.env.VITE_ROUTE_BACKEND_REJECTION_REASONS
      );
      const sortedData = response.data.data.sort((a, b) =>
        a.description.localeCompare(b.description)
      );

      setTypeAperture(sortedData);
      setIsLoading(false);
      setDisabled(false);
    } catch (error) {
      console.error("Error al obtener los intervalos de pago:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSaveClick = async () => {
    setSubmitted(true);

    const isRequestValid = validatePhone(formData.request_id);
    const isReasonValid = validatePhone(formData.reason_id);
    const isCommentValid = validateDescriptionReject(formData.comment);

    setErrors({
      request_id: isRequestValid ? "" : "Solicitud inválida",
      reason_id: isReasonValid ? "" : "Debe seleccionar una opción",
      comment: isCommentValid ? "" : "Descripción inválida",
    });

    console.log(formData);
    console.log(errors);

    if (isRequestValid && isReasonValid && isCommentValid) {
      setConfirMessage(`¿Desea denegar la solicitud con ID "${id}"?`);
      setMethod("post");
      setUriPost(
        import.meta.env.VITE_URI_BACKEND_IOT +
          import.meta.env.VITE_ROUTE_BACKEND_REQUEST_CHANGE_STATUS_REJECT
      );
      setTypeForm("denegar");
      setShowConfirm(true);
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
                  <label className="label">Motivo</label>
                  <div className="control">
                    <div
                      className={`select ${
                        submitted
                          ? errors.type_opening_id
                            ? "is-false"
                            : "is-true"
                          : ""
                      }`}
                    >
                      <select
                        name="reason_id"
                        value={formData.reason_id}
                        onChange={handleChange}
                        disabled={disabled}
                      >
                        <option value="" disabled>
                          Seleccione una opción
                        </option>
                        {typeAperture.map((reason) => (
                          <option key={reason.id} value={reason.id}>
                            {reason.description}
                          </option>
                        ))}
                      </select>
                    </div>
                    {submitted && errors.reason_id && (
                      <p className="input-error">{errors.reason_id}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {formData.reason_id && (
              <>
                <div className="columns">
                  <div className="column">
                    <div className="field">
                      <label className="label">Descripción</label>
                      <div className="control">
                        <textarea
                          className={`textarea ${
                            submitted
                              ? errors.comment
                                ? "is-false"
                                : "is-true"
                              : ""
                          }`}
                          type="text"
                          name="comment"
                          value={formData.comment}
                          onChange={handleChange}
                          disabled={isLoading}
                        />
                      </div>
                      {submitted && errors.comment && (
                        <p className="input-error">{errors.comment}</p>
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
              <button className="button color-hover" onClick={handleSaveClick}>
                Guardar
              </button>
            </div>
          </footer>
        </div>
      </div>
      {showConfirm && (
        <Confirm_reject_request
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
          uriPost={uriPost}
          typeForm={typeForm}
          loading={loading}
          setLoading={setLoading}
          updateData={updateData}
        />
      )}
    </>
  );
};

export default Form_request_reject;
