import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  validateLastName,
  validateModel,
  validatePhone,
  validateText,
  validateTextArea,
} from "../../../../hooks/useValidations";
import Confirm_iot from "../../confirm_view/adds/Confirm_iot";

const Form_device = ({
  title,
  onClose,
  id,
  setShowMessage,
  setTitleMessage,
  setMessage,
  setStatus,
  updateData,
  token,
  loading,
  setLoading,
  typeForm,
  setTypeForm,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [buttonSubmitted, setButtonSubmitted] = useState(false);
  const [typeDevice, setTypeDevice] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [confirMessage, setConfirMessage] = useState();
  const [method, setMethod] = useState();
  const [uriPost, setUriPost] = useState("");
  const [newData, setNewData] = useState();

  const [formData, setFormData] = useState({
    devices_id: "",
    serial_number: "",
    model: "",
  });

  const [errors, setErrors] = useState({
    devices_id: "",
    serial_number: "",
    model: "",
  });

  useEffect(() => {
    fetchTypeDevice();

    if (id != null) {
      getDevice();
    }
  }, [id]);

  const fetchTypeDevice = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND_IOT +
          import.meta.env.VITE_ROUTE_BACKEND_DEVICES_TYPES
      );

      const sortedData = response.data.sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      setTypeDevice(sortedData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error al obtener los tipos de dispositivos", error);
    }
  };

  const getDevice = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND_IOT +
          import.meta.env.VITE_ROUTE_BACKEND_DEVICES +
          id
      );
      const backupData = response.data.data;

      const { price_device, serial_number, model, devices_id } = backupData;

      const uncompressed = {
        serial_number: serial_number?.toString() || "",
        model: model || "",
        devices_id: devices_id?.toString() || "",
        ...(price_device || {}),
      };

      console.log(uncompressed);
      setFormData(uncompressed);
    } catch (error) {
      console.error("Error al obtener el dispositivo:", error);
    }
  };

  const selectedDevice = typeDevice.find(
    (device) => device.id === parseInt(formData.devices_id)
  );

  useEffect(() => {
    if (!formData.devices_id) return;

    // Limpiar todos los campos adicionales cuando cambia el tipo
    setFormData((prev) => {
      const { serial_number, model, devices_id } = prev;
      return { serial_number, model, devices_id };
    });

    // También reinicia errores si estás validando por campo
    setErrors((prev) => {
      const { serial_number, model, devices_id } = prev;
      return { serial_number, model, devices_id };
    });

    setSubmitted(false); // Opcional, para evitar que los mensajes de error se queden
  }, [formData.devices_id]);

  useEffect(() => {
    if (!selectedDevice?.properties) return;

    const newFields = {};

    Object.entries(selectedDevice.properties).forEach(([key, value]) => {
      if (typeof value === "string" || value.type === "select") {
        if (!(key in formData)) {
          newFields[key] = "";
        }
      } else if (value.type === "dynamic_fields") {
        const dependsOnValue =
          formData[value.depends_on] || formData["cantidad_de_polos"] || "0";
        const dynamicFields = value.fields_per_option?.[dependsOnValue] || [];
        dynamicFields.forEach((fieldKey) => {
          if (!(fieldKey in formData)) {
            newFields[fieldKey] = "";
          }
        });
      }
    });

    if (Object.keys(newFields).length > 0) {
      setFormData((prev) => ({
        ...prev,
        ...newFields,
      }));
    }
  }, [formData.devices_id, formData["cantidad_de_polos"]]);

  const toLabel = (str) => {
    const UNITS = [
      "Ah",
      "A",
      "W",
      "V",
      "VAC",
      "VDC",
      "Hz",
      "VA",
      "kWh",
      "kW",
      "mA",
    ];

    return str
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => {
        // Detecta si es tipo "(ah)" o "(vdc)"
        const matchParens = word.match(/^\((.+)\)$/);
        if (matchParens) {
          const inner = matchParens[1];
          const matchedUnit = UNITS.find(
            (unit) => unit.toLowerCase() === inner.toLowerCase()
          );
          if (matchedUnit) return `(${matchedUnit})`;
        }

        // Detecta palabra completa que es unidad
        const matchedUnit = UNITS.find(
          (unit) => unit.toLowerCase() === word.toLowerCase()
        );
        if (matchedUnit) return matchedUnit;

        // Capitaliza palabra normal
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(" ");
  };

  const chunkArray = (arr, size) => {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  };

  const getDynamicFieldGroups = () => {
    if (!selectedDevice?.properties) return [];

    const fields = [];

    Object.entries(selectedDevice.properties).forEach(([key, value]) => {
      if (typeof value === "string") {
        fields.push({
          name: key,
          label: toLabel(key),
          type: "text",
          validationType: "number",
        });
      } else if (value.type === "select") {
        const matchedOptionSource = Object.entries(optionsMap).find(
          ([, options]) =>
            options?.some((opt) => value.options.includes(opt.name))
        );

        if (matchedOptionSource) {
          const [optionsSource] = matchedOptionSource;

          fields.push({
            name: key,
            label: toLabel(key),
            type: "select",
            optionsSource,
            validationType: "select",
          });
        } else {
          // fallback: usar opciones estáticas si no hay match
          fields.push({
            name: key,
            label: toLabel(key),
            type: "select",
            options: value.options,
          });
        }
      } else if (value.type === "dynamic_fields") {
        const dependsOnValue =
          formData[value.depends_on] || formData[`cantidad_de_polos`] || "0";

        const dynamicFields = value.fields_per_option?.[dependsOnValue] || [];

        dynamicFields.forEach((fieldKey) => {
          fields.push({
            name: fieldKey,
            label: toLabel(fieldKey),
            type: "text",
            validationType: "number",
          });
        });
      }
    });

    // Ahora agrupamos en columnas de a 2 (o la cantidad que prefieras)
    const chunked = chunkArray(fields, 2);
    return chunked.map((columns) => ({ columns }));
  };
  const optionsMap = {};
  const dynamicGroups = useMemo(() => {
    return formData.devices_id ? getDynamicFieldGroups() : [];
  }, [formData.devices_id, formData["cantidad_de_polos"]]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const buildPayload = () => {
    const { devices_id, serial_number, model, ...rest } = formData;

    const price_device = Object.fromEntries(
      Object.entries(rest).filter(
        ([key]) => !["devices_id", "serial_number", "model"].includes(key)
      )
    );

    return {
      devices_id,
      serial_number,
      model,
      price_device,
    };
  };

  const validateDynamicFields = () => {
    const dynamicFieldErrors = {};
    dynamicGroups.forEach((group) => {
      group.columns.forEach((field) => {
        const value = formData[field.name];

        if (field.type === "select" && !value) {
          dynamicFieldErrors[field.name] = "Debe seleccionar una opción";
          return;
        }

        if (field.validationType === "number" && !validatePhone(value)) {
          dynamicFieldErrors[field.name] = "Dato inválido";
          return;
        }

        if (
          field.validationType === "alphanumeric" &&
          !validateTextArea(value)
        ) {
          dynamicFieldErrors[field.name] = "Dato inválido";
          return;
        }
      });
    });

    return dynamicFieldErrors;
  };

  const handleSaveClick = async () => {
    setSubmitted(true);
    const isTypeDeviceValid = validatePhone(formData.devices_id);
    const isSerialNumberValid = validatePhone(formData.serial_number);
    const isModelValid = validateModel(formData.model);

    const dynamicErrors = validateDynamicFields();

    const baseErrors = {
      devices_id: isTypeDeviceValid ? "" : "Tipo de dispositivo inválido",
      serial_number: isSerialNumberValid ? "" : "Número de serie inválido",
      model: isModelValid ? "" : "Modelo inválido",
    };

    const combinedErrors = { ...baseErrors, ...dynamicErrors };
    setErrors(combinedErrors);

    const hasErrors = Object.values(combinedErrors).some((msg) => msg);

    if (!hasErrors) {
      if (id != null) {
        const payload = buildPayload();
        setNewData(payload);

        setConfirMessage(`¿Desea editar el dispositivo?`);
        setMethod("put");
        setUriPost(
          import.meta.env.VITE_URI_BACKEND_IOT +
            import.meta.env.VITE_ROUTE_BACKEND_DEVICES +
            id
        );
        setTypeForm("edit_device");
        setShowConfirm(true);
      } else {
        const payload = buildPayload();
        setNewData(payload);

        setConfirMessage(`¿Desea crear un nuevo dispositivo?`);
        setMethod("post");
        setUriPost(
          import.meta.env.VITE_URI_BACKEND_IOT +
            import.meta.env.VITE_ROUTE_BACKEND_DEVICES
        );
        setTypeForm("create_device");
        setShowConfirm(true);
      }
    }
  };

  console.log(newData);

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
                    <div
                      className={`select ${
                        submitted
                          ? errors.devices_id
                            ? "is-false"
                            : "is-true"
                          : ""
                      }`}
                    >
                      <select
                        name="devices_id"
                        value={formData.devices_id}
                        onChange={handleChange}
                      >
                        <option value="" disabled>
                          Seleccione una opción
                        </option>
                        {typeDevice.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {submitted && errors.devices_id && (
                      <p className="input-error">{errors.devices_id}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {formData.devices_id && (
              <>
                {/* Inputs básicos */}
                <div className="columns mb-0">
                  <div className="column">
                    <div className="field">
                      <label className="label">Número de serie</label>
                      <div className="control">
                        <input
                          className={`input ${
                            submitted
                              ? errors.serial_number
                                ? "is-false"
                                : "is-true"
                              : ""
                          }`}
                          type="number"
                          name="serial_number"
                          placeholder="Ingrese el número de serie"
                          onChange={handleChange}
                          value={formData.serial_number}
                        />
                      </div>
                      {submitted && errors.serial_number && (
                        <p className="input-error">{errors.serial_number}</p>
                      )}
                    </div>
                  </div>
                  <div className="column">
                    <div className="field">
                      <label className="label">Modelo</label>
                      <div className="control">
                        <input
                          className={`input ${
                            submitted
                              ? errors.model
                                ? "is-false"
                                : "is-true"
                              : ""
                          }`}
                          type="text"
                          name="model"
                          placeholder="Ingrese el modelo del dispositivo"
                          onChange={handleChange}
                          value={formData.model}
                        />
                      </div>
                      {submitted && errors.model && (
                        <p className="input-error">{errors.model}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Inputs adicionales según tipo de dispositivo */}
                {dynamicGroups.map((group, index) => {
                  const hasPolos = group.columns.some((field) =>
                    field.name.startsWith("polo_")
                  );

                  return (
                    <div key={`extra-${index}`}>
                      {hasPolos &&
                        index ===
                          dynamicGroups.findIndex((g) =>
                            g.columns.some((f) => f.name.startsWith("polo_"))
                          ) && (
                          <div className="columns">
                            <div className="column column-p0">
                              <label className="label">
                                Tensión máxima por polo
                              </label>
                            </div>
                          </div>
                        )}
                      <div className="columns columns-mb">
                        {group.columns.map((field) => (
                          <div className="column" key={field.name}>
                            <div className="field">
                              <label className="label">{field.label}</label>
                              <div className="control">
                                {field.type === "select" ? (
                                  <div
                                    className={`select ${
                                      submitted
                                        ? errors[field.name]
                                          ? "is-false"
                                          : "is-true"
                                        : ""
                                    }`}
                                  >
                                    <select
                                      name={field.name}
                                      value={formData[field.name] || ""}
                                      onChange={handleChange}
                                    >
                                      <option value="">
                                        Seleccione una opción
                                      </option>
                                      {field.optionsSource
                                        ? optionsMap[field.optionsSource]?.map(
                                            (opt) => (
                                              <option
                                                key={opt.id}
                                                value={opt.name}
                                              >
                                                {opt.name}
                                              </option>
                                            )
                                          )
                                        : field.options?.map((opt) => (
                                            <option key={opt} value={opt}>
                                              {opt}
                                            </option>
                                          ))}
                                    </select>
                                  </div>
                                ) : (
                                  <>
                                    <input
                                      className={`input ${
                                        submitted
                                          ? errors[field.name]
                                            ? "is-false"
                                            : "is-true"
                                          : ""
                                      }`}
                                      type="text"
                                      name={field.name}
                                      value={formData[field.name] || ""}
                                      onChange={handleChange}
                                      placeholder={`Ingrese ${field.label.toLowerCase()}`}
                                    />
                                  </>
                                )}
                              </div>
                              {submitted && errors[field.name] && (
                                <p className="input-error">
                                  {errors[field.name]}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </section>
          <footer className="modal-card-foot is-flex is-justify-content-center">
            <div className="buttons container-button">
              <button className="button" onClick={onClose}>
                Cancelar
              </button>
              <button
                className="button color-hover"
                onClick={handleSaveClick}
                disabled={!formData.devices_id}
              >
                Guardar
              </button>
            </div>
          </footer>
        </div>
      </div>
      {showConfirm && (
        <Confirm_iot
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

export default Form_device;
