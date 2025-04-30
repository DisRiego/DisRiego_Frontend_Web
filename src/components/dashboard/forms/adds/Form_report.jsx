import { useEffect, useState } from "react";
import axios from "axios";
import Confirm_modal from "../../reusable/Confirm_modal";
import {
  validateDescriptionReject,
  validatePhone,
} from "../../../../hooks/useValidations";
import { FaSearch } from "react-icons/fa";
import { IoMdWarning } from "react-icons/io";

const Form_report = ({
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
  const [showForm, setShowForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [dataProperty, setDataProperty] = useState([]);
  const [newData, setNewData] = useState();
  const [propertyValidate, setPropertyValidate] = useState("");
  const [dataLot, setDataLot] = useState([]);
  const [dataTypeFailure, setDataTypeFailure] = useState([]);
  const [nameTypeFailure, setNameTypeFailure] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [submittedProperty, setSubmittedProperty] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [confirMessage, setConfirMessage] = useState();
  const [method, setMethod] = useState();
  const [uriPost, setUriPost] = useState("");
  const [typeForm, setTypeForm] = useState("");

  const feedbackMessages = {
    create: {
      successTitle: "Reporte creado exitosamente",
      successMessage: "El reporte ha sido creado correctamente.",
      errorTitle: "Error al crear el reporte",
      errorMessage:
        "No se pudo crear el reporte. Por favor, inténtelo de nuevo.",
    },
    edit: {
      successTitle: "Reporte actualizado exitosamente",
      successMessage: "El reporte ha sido actualizado correctamente.",
      errorTitle: "Error al actualizar el reporte",
      errorMessage:
        "No se pudo actualizar el reporte. Por favor, inténtelo de nuevo.",
    },
  };

  const [formProperty, setFormProperty] = useState({
    property_id: "",
  });

  const [errorsProperty, setErrorsProperty] = useState({
    property_id: "",
  });

  const [formData, setFormData] = useState({
    lot_id: "",
    type_failure_id: "",
    description_failure: "",
  });

  const [errors, setErrors] = useState({
    lot_id: "",
    type_failure_id: "",
    description_failure: "",
  });

  useEffect(() => {
    getFailureType();
  }, []);

  const getPropertyByID = async (property_id) => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND +
          import.meta.env.VITE_ROUTE_BACKEND_PROPERTY +
          property_id
      );
      const sortedData = response.data.data;
      getLot();
      setPropertyValidate("");
      setDataProperty(sortedData);
      setShowForm(true);
      setSubmittedProperty(true);
      setDisabled(false);
      setIsLoading(false);
    } catch (error) {
      console.error("Error al obtener los predios:", error);

      if (error.status === 404) {
        setPropertyValidate(
          "El predio no se encuentra registrado en la plataforma"
        );
        setShowForm(false);
      }
    }
  };

  const getLot = async () => {
    try {
      setFormData((prev) => ({ ...prev, lot_id: "" }));
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND +
          import.meta.env.VITE_ROUTE_BACKEND_PROPERTY +
          formProperty.property_id +
          import.meta.env.VITE_ROUTE_BACKEND_LOTS
      );
      console.log(response.data.data);
      const sortedData = response.data.data.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setDataLot(sortedData);
    } catch (error) {
      console.error("Error al obtener los lotes:", error);
      setDataLot([]);
    }
  };

  const getFailureType = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND_MAINTENANCE +
          import.meta.env.VITE_ROUTE_BACKEND_FAILURE_TYPE
      );
      const sortedData = response.data.data.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setDataTypeFailure(sortedData);
    } catch (error) {
      console.error("Error al obtener los predios:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "type_failure_id") {
      const selected = dataTypeFailure.find((f) => f.id.toString() === value);
      setNameTypeFailure(selected ? selected.name : "");
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleChangeProperty = (e) => {
    const { name, value } = e.target;

    setFormProperty({
      ...formProperty,
      [name]: value,
    });
  };

  const handleValidate = async () => {
    const isPropertyValid = validatePhone(formProperty.property_id);
    setErrors({
      property_id: isPropertyValid
        ? ""
        : "false" && "Debe seleccionar una opción",
    });

    if (isPropertyValid) {
      getPropertyByID(formProperty.property_id);
    }
    setSubmittedProperty(true);
  };

  const handleSaveClick = () => {
    setSubmitted(true);
    const isLotValid = validatePhone(formData.lot_id);
    const isTypeFailureValid = validatePhone(formData.type_failure_id);
    const isDescriptionValid = validateDescriptionReject(
      formData.description_failure
    );

    setErrors({
      lot_id: isLotValid ? "" : "false" && "Debe seleccionar una opción",
      type_failure_id: isTypeFailureValid
        ? ""
        : "false" && "Debe seleccionar una opción",
      description_failure: isDescriptionValid
        ? ""
        : "false" && "Observación del fallo inválida",
    });

    if (isLotValid && isTypeFailureValid && isDescriptionValid) {
      setNewData({
        lot_id: parseInt(formData.lot_id),
        type_failure_id: formData.type_failure_id,
        description_failure: formData.description_failure,
      });
      if (id != null) {
        setConfirMessage(
          `¿Desea actualizar el reporte de fallo con ID "${id}"?`
        );
        setMethod("put");
        setUriPost(
          import.meta.env.VITE_URI_BACKEND_MAINTENANCE +
            import.meta.env.VITE_ROUTE_BACKEND_REPORT
        );
        setTypeForm("edit");
        setShowConfirm(true);
      } else {
        setConfirMessage(
          `¿Desea crear el reporte con el tipo "${nameTypeFailure}"?`
        );
        setMethod("post");
        setUriPost(
          import.meta.env.VITE_URI_BACKEND_MAINTENANCE +
            import.meta.env.VITE_ROUTE_BACKEND_REPORT
        );
        setTypeForm("create");
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
                <label className="label">ID del predio afectado</label>
                <div className="field has-addons mb-0">
                  <div className="control is-expanded">
                    <input
                      className={`input ${
                        submittedProperty
                          ? errorsProperty.property_id
                            ? "is-false"
                            : ""
                          : ""
                      }`}
                      name="property_id"
                      type="number"
                      placeholder="Ingrese el ID del predio afectado"
                      value={formProperty.property_id}
                      onChange={handleChangeProperty}
                      // disabled={isLoading}
                    />
                  </div>
                  <div className="control">
                    <button
                      className={`button button-search ${
                        submittedProperty
                          ? errorsProperty.property_id
                            ? "is-false"
                            : ""
                          : ""
                      }`}
                      onClick={handleValidate}
                    >
                      <FaSearch className="" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {propertyValidate != "" && (
              <div className="is-flex is-flex-direction-row	is-justify-content-center is-align-items-center">
                <IoMdWarning className="icon login-error mr-2" />
                <p className="input-error">{propertyValidate}</p>
              </div>
            )}
            {showForm && (
              <>
                <div className="columns columns-mb">
                  {/* Campo Predio */}
                  <div className="column">
                    <div className="field">
                      <label className="label">
                        Nombre del predio afectado
                      </label>
                      <div className="control">
                        <input
                          className="input"
                          type="text"
                          disabled
                          value={dataProperty.name}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="column">
                    <div className="field">
                      <label className="label">Lote afectado</label>
                      <div className="control">
                        <div
                          className={`select ${
                            submitted && errors.lot_id ? "is-false" : ""
                          }`}
                        >
                          <select
                            name="lot_id"
                            value={formData.lot_id}
                            onChange={handleChange}
                            disabled={
                              isLoading ||
                              !formProperty.property_id ||
                              dataLot.length === 0
                            }
                          >
                            <option value="" disabled>
                              Seleccione una opción
                            </option>
                            {dataLot.map((lot) => (
                              <option key={lot.id} value={lot.id}>
                                {lot.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        {submitted && errors.lot_id && (
                          <p className="input-error">{errors.lot_id}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="columns columns-mb">
                  <div className="column">
                    <div className="field">
                      <label className="label">Posible fallo</label>
                      <div className="control">
                        <div
                          className={`select ${
                            submitted && errors.type_failure_id
                              ? "is-false"
                              : ""
                          }`}
                        >
                          <select
                            name="type_failure_id"
                            value={formData.type_failure_id}
                            onChange={handleChange}
                            disabled={isLoading}
                          >
                            <option value="" disabled>
                              Seleccione una opción
                            </option>
                            {dataTypeFailure.map((type) => (
                              <option key={type.id} value={type.id}>
                                {type.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        {submitted && errors.type_failure_id && (
                          <p className="input-error">
                            {errors.type_failure_id}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="columns">
                  <div className="column">
                    {" "}
                    <div className="field">
                      <label className="label">Observaciones del fallo</label>
                      <div className="control">
                        <textarea
                          className={`textarea ${
                            submitted
                              ? errors.description_failure
                                ? "is-false"
                                : ""
                              : ""
                          }`}
                          name="description_failure"
                          placeholder="Observaciones del fallo"
                          value={formData.description_failure}
                          onChange={handleChange}
                          disabled={isLoading}
                        />
                      </div>
                      {submitted && errors.description_failure && (
                        <p className="input-error">
                          {errors.description_failure}
                        </p>
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
              <button
                className="button is-primary button-login"
                onClick={handleSaveClick}
                disabled={disabled}
              >
                Guardar
              </button>
            </div>
          </footer>
        </div>
      </div>
      {showConfirm && (
        <Confirm_modal
          onClose={() => setShowConfirm(false)}
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
          feedbackMessages={feedbackMessages}
        />
      )}
    </>
  );
};

export default Form_report;
