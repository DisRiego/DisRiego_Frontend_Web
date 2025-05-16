import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Confirm_modal from "../../reusable/Confirm_modal";
import {
  validatePlaningDate,
  validatePhone,
} from "../../../../hooks/useValidations";

const Form_lot_user = ({
  title,
  onClose,
  setShowMessage,
  setTitleMessage,
  setMessage,
  setStatus,
  updateData,
  idRow,
  loading,
  setLoading,
  token,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [typeDocument, setTypeDocument] = useState([]);
  const [data, setData] = useState({});
  const [dataCrop, setDataCrop] = useState([]);
  const [confirMessage, setConfirMessage] = useState();
  const [method, setMethod] = useState();
  const [uriPost, setUriPost] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [typeForm, setTypeForm] = useState();
  const [nameInterval, setNameInterval] = useState("");
  const [paymentInterval, setPaymentInterval] = useState("");
  const estimateDateInputRef = useRef(null);

  const handleEstimateDateFocus = () => {
    if (estimateDateInputRef.current) {
      estimateDateInputRef.current.showPicker();
    }
  };

  const feedbackMessages = {
    edit_user: {
      successTitle: "Lote actualizado exitosamente",
      successMessage: "El lote ha sido actualizado correctamente.",
      errorTitle: "Error al actualizar el lote",
      errorMessage:
        "No se pudo actualizar el lote. Por favor, inténtelo de nuevo.",
    },
  };

  const [formData, setFormData] = useState({
    type_crop_id: "",
    planting_date: "",
    estimated_harvest_date: "",
    payment_interval: "",
  });

  const [errors, setErrors] = useState({
    type_crop_id: "",
    planting_date: "",
    estimated_harvest_date: "",
    payment_interval: "",
  });

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    getCrop();
    if (idRow != null) {
      getPaymentInterval();
      getLot();
    }
  }, [idRow]);

  useEffect(() => {
    if (formData.type_crop_id && formData.planting_date) {
      const selectedCrop = dataCrop.find(
        (crop) => crop.id === parseInt(formData.type_crop_id)
      );
      if (selectedCrop) {
        const plantingDate = new Date(formData.planting_date);
        plantingDate.setDate(
          plantingDate.getDate() + selectedCrop.harvest_time
        );

        setFormData((prev) => ({
          ...prev,
          estimated_harvest_date: plantingDate.toISOString().split("T")[0],
        }));
      }
    }
  }, [formData.type_crop_id, formData.planting_date, dataCrop]);

  const getLot = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND +
          import.meta.env.VITE_ROUTE_BACKEND_LOTS_PROPERTY +
          idRow
      );
      const lotData = response.data.data;

      setFormData({
        type_crop_id: lotData.type_crop_id ?? "",
        planting_date: lotData.planting_date ?? "",
        estimated_harvest_date: lotData.estimated_harvest_date ?? "",
        payment_interval: lotData.payment_interval ?? "",
      });

      setNameInterval(lotData.nombre_intervalo_pago ?? "");
    } catch (error) {
      console.error("Error al obtener el lote:", error);
    }
  };

  const getCrop = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND +
          import.meta.env.VITE_ROUTE_BACKEND_COMPANY_CROP
      );
      const sortedData = response.data.data.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setDataCrop(sortedData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error al obtener los tipos de cultivo:", error);
    }
  };

  const getPaymentInterval = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND +
          import.meta.env.VITE_ROUTE_BACKEND_COMPANY_PAYMENT_INTERVAL
      );
      const intervalData = response.data.data;
      setPaymentInterval(intervalData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error al obtener los tipos de cultivo:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "type_crop_id") {
      const selectedCrop = dataCrop.find((crop) => crop.id === parseInt(value));
      if (selectedCrop) {
        setFormData((prev) => ({
          ...prev,
          payment_interval: selectedCrop.payment_interval_id,
        }));

        const selectedInterval = paymentInterval.find(
          (interval) => interval.id === selectedCrop.payment_interval_id
        );
        setNameInterval(selectedInterval ? selectedInterval.name : "");

        // Si ya hay una fecha de siembra, recalcular la cosecha
        if (formData.planting_date) {
          const plantingDate = new Date(formData.planting_date);
          plantingDate.setDate(
            plantingDate.getDate() + selectedCrop.harvest_time
          );
          setFormData((prev) => ({
            ...prev,
            estimated_harvest_date: plantingDate.toISOString().split("T")[0],
          }));
        }
      }
    }

    if (name === "planting_date" && formData.type_crop_id) {
      const selectedCrop = dataCrop.find(
        (crop) => crop.id === parseInt(formData.type_crop_id)
      );
      if (selectedCrop) {
        const plantingDate = new Date(value);
        plantingDate.setDate(
          plantingDate.getDate() + selectedCrop.harvest_time
        );
        setFormData((prev) => ({
          ...prev,
          estimated_harvest_date: plantingDate.toISOString().split("T")[0],
        }));
      }
    }
  };

  const handleSaveClick = () => {
    setSubmitted(true);
    const isTypeCropValid = validatePhone(formData.type_crop_id);
    const isHarvestDateValid = validatePlaningDate(formData.planting_date);
    const isEstimatedHarvestValid = validatePlaningDate(
      formData.estimated_harvest_date
    );
    const isPaymentIntervalValid = validatePhone(formData.payment_interval);

    setErrors({
      type_crop_id: isTypeCropValid
        ? ""
        : "false" && "Debe seleccionar una opción",
      planting_date: isHarvestDateValid ? "" : "false" && "Fecha invalída",
      estimated_harvest_date: isEstimatedHarvestValid
        ? ""
        : "false" && "Fecha estimada inválida",
      payment_interval: isPaymentIntervalValid
        ? ""
        : "false" && "Intervalo de pago inválido",
    });

    console.log(errors);

    if (
      isTypeCropValid &&
      isHarvestDateValid &&
      isEstimatedHarvestValid &&
      isPaymentIntervalValid
    ) {
      const formLot = new FormData();
      formLot.append("type_crop_id", formData.type_crop_id);
      formLot.append("planting_date", formData.planting_date);
      formLot.append("estimated_harvest_date", formData.estimated_harvest_date);
      formLot.append("payment_interval", formData.payment_interval);

      setData(formLot);

      setConfirMessage("¿Desea actualizar la información del lote?");
      setMethod("put");
      setUriPost(
        import.meta.env.VITE_URI_BACKEND +
          import.meta.env.VITE_ROUTE_BACKEND_LOTS_PROPERTY +
          idRow +
          import.meta.env.VITE_ROUTE_BACKEND_LOTS_PROPERTY_USER
      );
      setTypeForm("edit_user");
      setShowConfirm(true);
    }
  };

  const toTitleCase = (str) => {
    if (typeof str !== "string") return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
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
            <div className="columns">
              <div className="column">
                <div className="field">
                  <label className="label">Tipo de cultivo</label>
                  <div className="control">
                    <div
                      className={`select ${
                        submitted ? (errors.type_crop_id ? "is-false" : "") : ""
                      }`}
                    >
                      <select
                        name="type_crop_id"
                        value={formData.type_crop_id}
                        onChange={handleChange}
                        disabled={isLoading}
                      >
                        <option value="" disabled>
                          Seleccione una opción
                        </option>
                        {dataCrop.map((crop) => (
                          <option key={crop.id} value={crop.id}>
                            {toTitleCase(crop.name)}
                          </option>
                        ))}
                      </select>
                    </div>
                    {submitted && errors.type_crop_id && (
                      <p className="input-error">{errors.type_crop_id}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="column">
                <div className="field">
                  <label className="label">Fecha de siembra</label>
                  <div className="control">
                    <input
                      ref={estimateDateInputRef}
                      className={`input ${
                        submitted
                          ? errors.planting_date
                            ? "is-false"
                            : ""
                          : ""
                      }`}
                      type="date"
                      name="planting_date"
                      placeholder="Ingrese la fecha de nacimiento"
                      value={formData.planting_date}
                      onChange={handleChange}
                      onFocus={handleEstimateDateFocus}
                      disabled={isLoading}
                    />
                  </div>
                  {submitted && errors.planting_date && (
                    <p className="input-error">{errors.planting_date}</p>
                  )}
                </div>
              </div>
            </div>
            {formData.type_crop_id && formData.planting_date && (
              <div className="container-input">
                <div className="columns">
                  <div className="column">
                    <div className="field">
                      <label className="label">Intervalo de pago</label>
                      <div className="control">
                        <input
                          className={`input`}
                          type="text"
                          value={nameInterval ?? ""}
                          onChange={handleChange}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                  <div className="column">
                    <div className="field">
                      <label className="label">Fecha estimada de cosecha</label>
                      <div className="control">
                        <input
                          className={`input`}
                          type="date"
                          name="estimated_harvest_date"
                          placeholder="Ingrese la fecha de nacimiento"
                          value={formData.estimated_harvest_date}
                          onChange={handleChange}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
        <Confirm_modal
          onClose={() => {
            setShowConfirm(false);
          }}
          onSuccess={onClose}
          confirMessage={confirMessage}
          method={method}
          formData={data}
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
          feedbackMessages={feedbackMessages}
        />
      )}
    </>
  );
};

export default Form_lot_user;
