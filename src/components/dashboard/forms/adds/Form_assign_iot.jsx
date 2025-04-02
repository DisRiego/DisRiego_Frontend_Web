import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import { IoMdWarning } from "react-icons/io";
import { validateDate, validatePhone } from "../../../../hooks/useValidations";

const Form_assign_iot = ({
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
  const [showForm, setShowForm] = useState(false);
  const [confirMessage, setConfirMessage] = useState();
  const [method, setMethod] = useState();
  const [uriPost, setUriPost] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [typeForm, setTypeForm] = useState();
  const [disabled, setDisabled] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [propertyValidate, setPropertyValidate] = useState("");
  const [dataProperty, setDataProperty] = useState({});
  const [dataLots, setDataLots] = useState([]);
  const dateInstallationInputRef = useRef(null);

  const handleDateInstallationFocus = () => {
    if (dateInstallationInputRef.current) {
      dateInstallationInputRef.current.showPicker();
    }
  };

  const [data, setData] = useState({
    name_device: "",
    serial_number: "",
    model: "",
  });

  const [formData, setFormData] = useState({
    device_id: "",
    property_id: "",
    lot_id: "",
    installation_date: "",
    maintenance_interval_id: "",
    estimated_maintenance_date: "",
  });

  const [errorProperty, setErrorProperty] = useState({
    property_id: "",
  });

  const [errors, setErrors] = useState({
    device_id: "",
    property_id: "",
    lot_id: "",
    installation_date: "",
    maintenance_interval_id: "",
    estimated_maintenance_date: "",
  });

  useEffect(() => {
    getDevice();
  }, [id]);

  const getDevice = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND_IOT +
          import.meta.env.VITE_ROUTE_BACKEND_DEVICES +
          id
      );
      const backupData = response.data.data;
      setData({
        name_device: backupData.device_type_name,
        serial_number: backupData.serial_number,
        model: backupData.model,
      });

      setFormData({
        device_id: backupData.id,
        property_id: backupData.property_id ?? "",
        lot_id: backupData.lot_id ?? "",
        installation_date: backupData.installation_date ?? "",
        maintenance_interval_id: backupData.maintenance_interval_id ?? "",
        estimated_maintenance_date: backupData.estimated_maintenance_date ?? "",
      });
    } catch (error) {
      console.error("Error al obtener el dispositivo:", error);
    }
  };

  const toTitleCase = (str) => {
    if (typeof str !== "string") return str; // Evita errores si el input no es un string

    return str
      .toLowerCase() // Convierte todo a minúsculas primero
      .split(" ") // Divide el texto en palabras
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Convierte la primera letra de cada palabra en mayúscula
      .join(" "); // Une las palabras nuevamente en una sola cadena
  };

  const getProperty = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND +
          import.meta.env.VITE_ROUTE_BACKEND_PROPERTY +
          formData.property_id
      );
      const backupData = response.data.data;
      console.log(backupData);
      setShowForm(true);
      setDataProperty({
        nameProperty: backupData.name,
        owner_name:
          backupData.owner_name +
          " " +
          backupData.owner_first_last_name +
          " " +
          backupData.owner_second_last_name,
      });
      setPropertyValidate("");
      getLots();
      setDisabled(false);
    } catch (error) {
      setDisabled(true);
      setPropertyValidate("El predio no está registrado en la plataforma");
      setShowForm(false);
    }
  };

  const getLots = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND +
          import.meta.env.VITE_ROUTE_BACKEND_PROPERTY +
          formData.property_id +
          import.meta.env.VITE_ROUTE_BACKEND_LOTS
      );
      const backupData = response.data.data;
      console.log(backupData);

      setDataLots(backupData);
    } catch (error) {
      console.log("Error al obtener los lotes", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleChangeProperty = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleValidate = async () => {
    const isPropertyValid = validatePhone(formData.property_id);

    setErrorProperty({
      property_id: isPropertyValid ? "" : "false" && "ID del predio inválido",
    });

    if (isPropertyValid) {
      getProperty();
    }
  };

  const handleSaveClick = () => {
    setSubmitted(true);
    const isLotValid = validatePhone(formData.lot_id);
    const isInstallationDateValid = validateDate(formData.installation_date);

    setErrors({
      lot_id: isLotValid ? "" : "false" && "Debe seleccionar una opción",
      installation_date: isInstallationDateValid
        ? ""
        : "false" && "Fecha de instalación inválida",
    });

    if (isLotValid) {
      console.log("Entro!!");
      // if (id != null) {
      //   setConfirMessage(`¿Desea asignar el dispositivo al lote?`);
      //   setMethod("put");
      //   setUriPost(
      //     import.meta.env.VITE_URI_BACKEND +
      //       import.meta.env.VITE_ROUTE_BACKEND_COMPANY_PAYMENT_INTERVAL_OTHER +
      //       id
      //   );
      //   setTypeForm("edit");
      //   setShowConfirm(true);
      // }
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
            <div className="columns columns-mb">
              <div className="column">
                <div className="field">
                  <label className="label">Tipo de dispositivo</label>
                  <div className="control">
                    <div className={`select`}>
                      <select
                        name="name_device"
                        value={data.name_device}
                        disabled
                      >
                        <option>{data.name_device}</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="columns columns-mb">
              <div className="column">
                <div className="field">
                  <label className="label">Número de serie</label>
                  <div className="control">
                    <input
                      className={`input`}
                      type="number"
                      name="serial_number"
                      value={data.serial_number}
                      disabled
                    />
                  </div>
                </div>
              </div>
              <div className="column">
                <div className="field">
                  <label className="label">Modelo</label>
                  <div className="control">
                    <input
                      className={`input`}
                      type="text"
                      name="model"
                      value={data.model}
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="columns mb-0">
              <div className="column">
                <div className="control">
                  <label className="label">ID del predio</label>
                  <div className="field has-addons mb-0">
                    <div className="control is-expanded">
                      <input
                        className={`input`}
                        name="property_id"
                        type="number"
                        placeholder="Ingrese el ID del predio"
                        value={formData.property_id}
                        onChange={handleChangeProperty}
                        // disabled={isLoading}
                      />
                    </div>
                    <div className="control">
                      <button
                        className={`button button-search `}
                        onClick={handleValidate}
                      >
                        <FaSearch className="" />
                      </button>
                    </div>
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
                <div className="columns">
                  <div className="column">
                    <div className="field">
                      <label className="label">Nombre del predio</label>
                      <div className="control">
                        <input
                          className={`input`}
                          type="text"
                          name="serial_number"
                          value={dataProperty.nameProperty}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                  <div className="column">
                    <div className="field">
                      <label className="label">Nombre del usuario</label>
                      <div className="control">
                        <input
                          className={`input`}
                          type="text"
                          name="serial_number"
                          value={
                            `${[dataProperty.owner_name]
                              .map(toTitleCase) // Aplica Title Case a cada parte del nombre
                              .filter(Boolean) // Elimina valores vacíos
                              .join(" ")}` // Une con un solo espacio
                          }
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="columns">
                  <div className="column">
                    <div className="field">
                      <label className="label">Lote a asignar</label>
                      <div className="control">
                        <div
                          className={`select ${
                            submitted ? (errors.lot_id ? "is-false" : "") : ""
                          }`}
                        >
                          <select
                            className={`select`}
                            name="lot_id"
                            value={formData.lot_id}
                            onChange={handleChange}
                            // disabled={isLoading}
                          >
                            <option value="" disabled>
                              Seleccione una opción
                            </option>
                            {dataLots.map((lot) => (
                              <option key={lot.id} value={lot.id}>
                                {lot.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        {errors && errors.lot_id && (
                          <p className="input-error">{errors.lot_id}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="column">
                    <div className="field">
                      <label className="label">Fecha de siembra</label>
                      <div className="control">
                        <input
                          ref={dateInstallationInputRef}
                          className={`input ${
                            submitted
                              ? errors.installation_date
                                ? "is-false"
                                : ""
                              : ""
                          }`}
                          type="date"
                          name="installation_date"
                          placeholder="Ingrese la fecha de instalación"
                          value={formData.installation_date}
                          onChange={handleChange}
                          onFocus={handleDateInstallationFocus}
                        />
                      </div>
                      {submitted && errors.installation_date && (
                        <p className="input-error">
                          {errors.installation_date}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="columns">
                  <div className="column">
                    <div className="field">
                      <label className="label">
                        Intervalo de mantenimiento
                      </label>
                      <div className="control">
                        <input
                          className={`input`}
                          type="text"
                          name="maintenance_interval_id"
                          value={formData.maintenance_interval_id}
                          onChange={handleChange}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                  <div className="column">
                    <div className="field">
                      <label className="label">Fecha de siembra</label>
                      <div className="control">
                        <input
                          className={`input`}
                          type="date"
                          name="installation_date"
                          value={formData.installation_date}
                          onChange={handleChange}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            {/* <div className="container-input">
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
            </div> */}
          </section>
          <footer className="modal-card-foot is-flex is-justify-content-center">
            <div className="buttons container-button">
              <button className="button" onClick={onClose}>
                Cancelar
              </button>
              <button
                className="button color-hover"
                disabled={disabled}
                onClick={handleSaveClick}
              >
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

export default Form_assign_iot;
