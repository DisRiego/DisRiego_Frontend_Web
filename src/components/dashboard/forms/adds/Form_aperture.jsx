import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  validateOpenDate,
  validateCloseDate,
  validatePhone,
  validateTime,
  validateCloseTime,
} from "../../../../hooks/useValidations";
import Confirm_aperture from "../../confirm_view/adds/Confirm_aperture";

const Form_aperture = ({
  title,
  onClose,
  setShowMessage,
  setTitleMessage,
  setMessage,
  setStatus,
  loading,
  setLoading,
  id,
  dataOwner,
  valveID,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [confirMessage, setConfirMessage] = useState();
  const [method, setMethod] = useState();
  const [uriPost, setUriPost] = useState("");
  const [newData, setNewData] = useState();
  const [disabled, setDisabled] = useState(true);
  const [typeForm, setTypeForm] = useState();
  const [typeAperture, setTypeAperture] = useState([]);
  const [nameTypeAperture, setNameTypeAperture] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const openDateInputRef = useRef(null);
  const hourOpenRef = useRef(null);
  const closedDateRef = useRef(null);
  const hourClosedRef = useRef(null);

  const handleOpenDateFocus = () => {
    if (openDateInputRef.current) {
      openDateInputRef.current.showPicker();
    }
  };

  const handleHourOpenFocus = () => {
    if (hourOpenRef.current) {
      hourOpenRef.current.showPicker();
    }
  };

  const handleClosedDateFocus = () => {
    if (closedDateRef.current) {
      closedDateRef.current.showPicker();
    }
  };

  const handleHourClosedFocus = () => {
    if (hourClosedRef.current) {
      hourClosedRef.current.showPicker();
    }
  };

  const [formData, setFormData] = useState({
    type_opening_id: "",
    lot_id: id ?? "",
    user_id: dataOwner?.id ?? "",
    device_iot_id: valveID ?? "",
    open_date: "",
    hour_open_date: "",
    close_date: "",
    hour_closed_date: "",
    volume_water: "",
  });

  const [errors, setErrors] = useState({
    type_opening_id: "",
    lot_id: "",
    user_id: "",
    device_iot_id: "",
    open_date: "",
    hour_open_date: "",
    close_date: "",
    hour_closed_date: "",
    volume_water: "",
  });

  useEffect(() => {
    getTypeAperture();
  }, []);

  const getTypeAperture = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND_IOT +
          import.meta.env.VITE_ROUTE_BACKEND_IOT_APERTURE_VALVE
      );
      const sortedData = response.data.data.sort((a, b) =>
        a.type_opening.localeCompare(b.type_opening)
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

    // Si el campo cambiado es el tipo de apertura
    if (name === "type_opening_id") {
      // Buscar el objeto completo por el ID seleccionado
      const selectedType = typeAperture.find(
        (type) => String(type.id) === value
      );

      // Actualizar el nombre también si se encontró
      if (selectedType) {
        setNameTypeAperture(selectedType.type_opening);
      }
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSaveClick = async () => {
    setSubmitted(true);

    const isTypeApertureValid = validatePhone(formData.type_opening_id);
    const isOpenDateValid = validateOpenDate(formData.open_date);
    const isHourOpenValid = validateTime(formData.hour_open_date);
    const isClosedDateValid = validateCloseDate(
      formData.open_date,
      formData.close_date
    );
    const isHourClosedValid = validateCloseTime(
      formData.open_date,
      formData.close_date,
      formData.hour_open_date,
      formData.hour_closed_date
    );
    const isVolumeWaterValid =
      formData.type_opening_id === "1"
        ? validatePhone(formData.volume_water)
        : true;

    setErrors({
      type_opening_id: isTypeApertureValid ? "" : "Debe seleccionar una opción",
      open_date: isOpenDateValid ? "" : "Fecha de apertura inválida",
      hour_open_date: isHourOpenValid ? "" : "Hora de apertura inválida",
      close_date: isClosedDateValid ? "" : "Fecha de cierre inválida",
      hour_closed_date: isHourClosedValid ? "" : "Hora de cierre inválida",
      volume_water:
        formData.type_opening_id === "1" && !isVolumeWaterValid
          ? "Volumen de agua inválido"
          : "",
    });

    if (
      isTypeApertureValid &&
      isOpenDateValid &&
      isHourOpenValid &&
      isClosedDateValid &&
      isHourClosedValid &&
      isVolumeWaterValid
    ) {
      const openTimestamp = new Date(
        `${formData.open_date}T${formData.hour_open_date}:00`
      ).toISOString();

      const closedTimestamp = new Date(
        `${formData.close_date}T${formData.hour_closed_date}:00`
      ).toISOString();

      const dataToSend = {
        type_opening_id: formData.type_opening_id,
        lot_id: formData.lot_id,
        user_id: formData.user_id,
        device_iot_id: parseInt(formData.device_iot_id),
        open_date: openTimestamp,
        close_date: closedTimestamp,
        volume_water: formData.volume_water
          ? parseInt(formData.volume_water)
          : null,
      };

      setNewData(dataToSend);
      setConfirMessage(
        `¿Desea crear la solicitud de "${nameTypeAperture}" para el lote con ID "${
          formData.lot_id
        }" con la siguiente información?
        \n Fecha de apertura: ${formData.open_date}, ${formatTime12h(
          formData.hour_open_date
        )}\n Fecha de cierre: ${formData.close_date}, ${formatTime12h(
          formData.hour_closed_date
        )}`
      );
      setMethod("post");
      setUriPost(
        import.meta.env.VITE_URI_BACKEND_IOT +
          import.meta.env.VITE_ROUTE_BACKEND_IOT_APERTURE_CREATE
      );
      setTypeForm("create");
      setShowConfirm(true);
    }
  };

  const formatTime12h = (timeStr) => {
    if (!timeStr) return "";
    const [hour, minute] = timeStr.split(":").map(Number);

    const ampm = hour >= 12 ? "pm" : "am";
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;

    return `${hour12}:${minute.toString().padStart(2, "0")} ${ampm}`;
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
                  <label className="label">Tipo de solicitud</label>
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
                        name="type_opening_id"
                        value={formData.type_opening_id}
                        onChange={handleChange}
                        disabled={disabled}
                      >
                        <option value="" disabled>
                          Seleccione una opción
                        </option>
                        {typeAperture.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.type_opening}
                          </option>
                        ))}
                      </select>
                    </div>
                    {submitted && errors.type_opening_id && (
                      <p className="input-error">{errors.type_opening_id}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {formData.type_opening_id && (
              <>
                {formData.type_opening_id === "1" && (
                  <>
                    <div className="columns">
                      <div className="column">
                        <div className="field">
                          <label className="label">Volumen de agua (m³)</label>
                          <div className="control">
                            <input
                              className={`input ${
                                submitted
                                  ? errors.volume_water
                                    ? "is-false"
                                    : "is-true"
                                  : ""
                              }`}
                              type="number"
                              name="volume_water"
                              placeholder="Ingrese el volumen de agua (m³)"
                              value={formData.volume_water}
                              onChange={handleChange}
                              disabled={isLoading}
                            />
                          </div>
                          {submitted && errors.volume_water && (
                            <p className="input-error">{errors.volume_water}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
                <div className="columns">
                  <div className="column">
                    <div className="field">
                      <label className="label">Fecha de apertura</label>
                      <div className="control">
                        <input
                          ref={openDateInputRef}
                          className={`input ${
                            submitted
                              ? errors.open_date
                                ? "is-false"
                                : "is-true"
                              : ""
                          }`}
                          type="date"
                          name="open_date"
                          placeholder="Ingrese la fecha de apertura"
                          value={formData.open_date}
                          onChange={handleChange}
                          onFocus={handleOpenDateFocus}
                          disabled={isLoading}
                        />
                      </div>
                      {submitted && errors.open_date && (
                        <p className="input-error">{errors.open_date}</p>
                      )}
                    </div>
                  </div>
                  <div className="column">
                    <div className="field">
                      <label className="label">Hora de apertura</label>
                      <div className="control">
                        <input
                          ref={hourOpenRef}
                          className={`input ${
                            submitted
                              ? errors.hour_open_date
                                ? "is-false"
                                : "is-true"
                              : ""
                          }`}
                          type="time"
                          name="hour_open_date"
                          placeholder="Ingrese la hora de apertura"
                          value={formData.hour_open_date}
                          onChange={handleChange}
                          onFocus={handleHourOpenFocus}
                          // disabled={isLoading}
                        />
                      </div>
                      {submitted && errors.hour_open_date && (
                        <p className="input-error">{errors.hour_open_date}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="columns">
                  <div className="column">
                    <div className="field">
                      <label className="label">Fecha de cierre</label>
                      <div className="control">
                        <input
                          ref={closedDateRef}
                          className={`input ${
                            submitted
                              ? errors.close_date
                                ? "is-false"
                                : "is-true"
                              : ""
                          }`}
                          type="date"
                          name="close_date"
                          placeholder="Ingrese la fecha de apertura"
                          value={formData.close_date}
                          onChange={handleChange}
                          onFocus={handleClosedDateFocus}
                          disabled={isLoading}
                        />
                      </div>
                      {submitted && errors.close_date && (
                        <p className="input-error">{errors.close_date}</p>
                      )}
                    </div>
                  </div>
                  <div className="column">
                    <div className="field">
                      <label className="label">Hora de cierre</label>
                      <div className="control">
                        <input
                          className={`input ${
                            submitted
                              ? errors.hour_closed_date
                                ? "is-false"
                                : "is-true"
                              : ""
                          }`}
                          ref={hourClosedRef}
                          type="time"
                          name="hour_closed_date"
                          placeholder="Ingrese la hora de cierre"
                          value={formData.hour_closed_date}
                          onChange={handleChange}
                          onFocus={handleHourClosedFocus}
                          // disabled={isLoading}
                        />
                      </div>
                      {submitted && errors.hour_closed_date && (
                        <p className="input-error">{errors.hour_closed_date}</p>
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
        <Confirm_aperture
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
          uriPost={uriPost}
          typeForm={typeForm}
          loading={loading}
          setLoading={setLoading}
        />
      )}
    </>
  );
};

export default Form_aperture;
