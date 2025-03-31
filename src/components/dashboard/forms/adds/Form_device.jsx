import { useEffect, useState } from "react";
import axios from "axios";

const Form_device = ({
  title,
  onClose,
  setShowMessage,
  setTitleMessag,
  setMessage,
  setStatus,
  // updateData,
  token,
  loading,
  setLoading,
  typeForm,
  setTypeForm,
}) => {
  const [typeDevice, setTypeDevice] = useState([]);
  const [typeCurrent, setTypeCurrent] = useState([]);
  const [typePanel, setTypePanel] = useState([]);
  const [quantity, setQuantity] = useState([]);
  const [typeRelay, setTypeRelay] = useState([]);

  const [formData, setFormData] = useState({
    device_type: "",
    serial_number: "",
    model: "",
  });

  const quantitySelected = parseInt(formData.quantity || 0);
  const deviceTypeId = parseInt(formData.device_type || 0);

  const [errors, setErrors] = useState({
    device_type: "",
    serial_number: "",
    model: "",
  });

  useEffect(() => {
    fetchTypePanel();
    fetchTypeCurrent();
    fetchQuantity();
    fetchTypeRelay();
    fetchTypeDevice();
  }, []);

  const fetchTypeDevice = async () => {
    try {
      const response = [
        {
          id: 1,
          name: "Válvula",
          device_category_id: 1,
        },
        {
          id: 2,
          name: "Medidor",
          device_category_id: 1,
        },
        {
          id: 3,
          name: "Controlador",
          device_category_id: 1,
        },
        {
          id: 14,
          name: "Relé",
          device_category_id: 1,
        },
        {
          id: 5,
          name: "Inversor",
          device_category_id: 2,
        },
        {
          id: 6,
          name: "Batería",
          device_category_id: 2,
        },
        {
          id: 7,
          name: "Panel",
          device_category_id: 2,
        },
        {
          id: 9,
          name: "Breaker",
          device_category_id: 2,
        },
        {
          id: 10,
          name: "DPS",
          device_category_id: 2,
        },
        {
          id: 11,
          name: "Portafusible",
          device_category_id: 2,
        },
        {
          id: 12,
          name: "Fusible",
          device_category_id: 2,
        },
        {
          id: 13,
          name: "Fuente de poder",
          device_category_id: 2,
        },
        {
          id: 4,
          name: "Adaptador",
          device_category_id: 3,
        },
        {
          id: 8,
          name: "Antena",
          device_category_id: 3,
        },
      ];

      //   const response = await axios.get(
      //     import.meta.env.VITE_URI_BACKEND +
      //       import.meta.env.VITE_ROUTE_BACKEND_COMPANY_PAYMENT_INTERVAL
      //   );
      const sortedData = response.sort((a, b) => a.name.localeCompare(b.name));

      setTypeDevice(sortedData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error al obtener los tipos de dispositivos", error);
    }
  };

  const fetchTypeCurrent = async () => {
    try {
      const response = [
        {
          id: 1,
          name: "AV",
        },
        {
          id: 2,
          name: "DC",
        },
      ];

      //   const response = await axios.get(
      //     import.meta.env.VITE_URI_BACKEND +
      //       import.meta.env.VITE_ROUTE_BACKEND_COMPANY_PAYMENT_INTERVAL
      //   );
      const sortedData = response.sort((a, b) => a.name.localeCompare(b.name));

      setTypeCurrent(sortedData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error al obtener los tipos de corriente", error);
    }
  };

  const fetchQuantity = async () => {
    try {
      const response = [
        {
          id: 1,
          name: "1",
        },
        {
          id: 2,
          name: "2",
        },
        {
          id: 3,
          name: "3",
        },
        {
          id: 4,
          name: "4",
        },
      ];

      //   const response = await axios.get(
      //     import.meta.env.VITE_URI_BACKEND +
      //       import.meta.env.VITE_ROUTE_BACKEND_COMPANY_PAYMENT_INTERVAL
      //   );
      const sortedData = response.sort((a, b) => a.id - b.id);

      setQuantity(sortedData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error al obtener la cantidad de polos:", error);
    }
  };

  const fetchTypePanel = async () => {
    try {
      const response = [
        {
          id: 1,
          name: "Monocristalino",
        },
        {
          id: 2,
          name: "Policristalino",
        },
      ];

      //   const response = await axios.get(
      //     import.meta.env.VITE_URI_BACKEND +
      //       import.meta.env.VITE_ROUTE_BACKEND_COMPANY_PAYMENT_INTERVAL
      //   );
      const sortedData = response.sort((a, b) => a.name.localeCompare(b.name));

      setTypePanel(sortedData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error al obtener los tipos de paneles:", error);
    }
  };

  const fetchTypeRelay = async () => {
    try {
      const response = [
        {
          id: 1,
          name: "EMR",
        },
        {
          id: 2,
          name: "SSR",
        },
      ];

      //   const response = await axios.get(
      //     import.meta.env.VITE_URI_BACKEND +
      //       import.meta.env.VITE_ROUTE_BACKEND_COMPANY_PAYMENT_INTERVAL
      //   );
      const sortedData = response.sort((a, b) => a.name.localeCompare(b.name));

      setTypeRelay(sortedData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error al obtener los tipos de relay:", error);
    }
  };

  console.log(formData);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const commonFields = {
    basic: [
      {
        columns: [
          { name: "serial_number", label: "Número de serie" },
          { name: "model", label: "Modelo" },
        ],
      },
    ],
    sharedGroup1: [
      {
        columns: [],
      },
    ],
    controllerFields: [
      {
        columns: [
          { name: "firmware_version", label: "Versión de firmware" },
          { name: "mac_address", label: "Dirección MAC" },
        ],
      },
    ],
    gatewayFields: [
      {
        columns: [{ name: "mac_address", label: "Dirección MAC" }],
      },
    ],
    baterryFields: [
      {
        columns: [
          { name: "voltage", label: "Voltaje (V)" },
          { name: "capacity", label: "Capacidad (Ah)" },
        ],
      },
    ],
    panelFields: [
      {
        columns: [
          {
            name: "type_panel",
            label: "Tipo de panel",
            type: "select",
            optionsSource: "typePanel",
          },
          {
            name: "power",
            label: "Potencia (W)",
          },
        ],
      },
    ],
    protectionFields: [
      {
        columns: [
          {
            name: "current_type",
            label: "Tipo de corriente",
            type: "select",
            optionsSource: "typeCurrent",
          },
          {
            name: "quantity",
            label: "Cantidad de polos",
            type: "select",
            optionsSource: "quantity",
          },
        ],
      },
    ],
    fuseFields: [
      {
        columns: [
          { name: "current_type", label: "Tipo de corriente" },
          { name: "voltage", label: "Voltaje máximo (V)" },
        ],
      },
    ],
    powerSupplyFields: [
      {
        columns: [
          { name: "electric_power", label: "Potencia eléctrica (W)" },
          { name: "amperage", label: "Amperaje (A)" },
        ],
      },
    ],
    relayFields: [
      {
        columns: [
          {
            name: "realy_type",
            label: "Tipo de relé",
            type: "select",
            optionsSource: "typeRelay",
          },
          {
            name: "amperage",
            label: "Amperaje (A)",
          },
        ],
      },
      {
        columns: [
          {
            name: "voltage",
            label: "Voltaje (V)",
          },
        ],
      },
    ],
  };

  const fieldMapByDeviceId = {
    1: ["sharedGroup1"], // Válvula
    2: ["sharedGroup1"], // Medidor
    5: ["sharedGroup1"], // Inversor
    8: ["sharedGroup1"], // Antena
    3: ["controllerFields"], // Controlador
    4: ["gatewayFields"], // Adaptador de red
    6: ["baterryFields"], // Bateria
    7: ["panelFields"], // Panel solar
    9: ["protectionFields"], // Breaker
    10: ["protectionFields"], // DPS
    11: ["fuseFields"], // Portafusible
    12: ["fuseFields"], // Fusible
    13: ["powerSupplyFields"], // Fuente de poder}
    14: ["relayFields"], // Fuente de poder
  };

  const optionsMap = {
    typeCurrent,
    typePanel,
    quantity,
    typeRelay,
  };

  const getExtraFields = (deviceTypeId) => {
    const groups = fieldMapByDeviceId[deviceTypeId] || [];
    const fields = groups.flatMap((group) => commonFields[group] || []);
    return fields;
  };

  const poloInputs = Array.from({ length: quantitySelected }, (_, i) => ({
    name: `polo_${i + 1}`,
    label: `Polo ${i + 1}`,
  }));

  const chunkArray = (arr, size) => {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
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
                  <label className="label">Tipo de dispositivo</label>
                  <div className="control">
                    <div className={`select`}>
                      <select
                        name="device_type"
                        value={formData.device_type}
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
                  </div>
                </div>
              </div>
            </div>
            {formData.device_type && (
              <>
                {/* Inputs básicos */}
                {commonFields.basic.map((group, index) => (
                  <div className="columns columns-mb" key={`basic-${index}`}>
                    {group.columns.map((field) => (
                      <div className="column" key={field.name}>
                        <div className="field">
                          <label className="label">{field.label}</label>
                          <div className="control">
                            <input
                              className="input"
                              type="text"
                              name={field.name}
                              placeholder={`Ingrese ${field.label.toLowerCase()}`}
                              value={formData[field.name] || ""}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}

                {/* Inputs adicionales según tipo de dispositivo */}
                {getExtraFields(parseInt(formData.device_type)).map(
                  (group, index) => (
                    <div className="columns columns-mb" key={`extra-${index}`}>
                      {group.columns.map((field) => (
                        <div className="column" key={field.name}>
                          <div className="field">
                            <label className="label">{field.label}</label>
                            <div className="control">
                              {field.type === "select" ? (
                                <div className="select is-fullwidth">
                                  <select
                                    name={field.name}
                                    value={formData[field.name] || ""}
                                    onChange={handleChange}
                                  >
                                    <option value="">
                                      Seleccione una opción
                                    </option>
                                    {optionsMap[field.optionsSource]?.map(
                                      (option) => (
                                        <option
                                          key={option.id}
                                          value={option.name}
                                        >
                                          {option.name}
                                        </option>
                                      )
                                    )}
                                  </select>
                                </div>
                              ) : (
                                <input
                                  className="input"
                                  type="text"
                                  name={field.name}
                                  placeholder={`Ingrese ${field.label.toLowerCase()}`}
                                  value={formData[field.name] || ""}
                                  onChange={handleChange}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                )}

                {(deviceTypeId === 9 || deviceTypeId === 10) &&
                  quantitySelected > 0 && (
                    <>
                      <div className="mb-1">
                        <label className="label">Tensión máxima por polo</label>
                      </div>
                      {chunkArray(poloInputs, 2).map((group, idx) => (
                        <div
                          className="columns columns-mb is-mobile"
                          key={`polo-row-${idx}`}
                        >
                          {group.map((field) => (
                            <div className="column" key={field.name}>
                              <div className="field">
                                <label className="label">{field.label}</label>
                                <div className="control">
                                  <input
                                    className="input"
                                    type="text"
                                    name={field.name}
                                    placeholder={`Tensión del ${field.label.toLowerCase()}`}
                                    value={formData[field.name] || ""}
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </>
                  )}
              </>
            )}
          </section>
          <footer className="modal-card-foot is-flex is-justify-content-center">
            <div className="buttons">
              <button className="button" onClick={onClose}>
                Cancelar
              </button>
              <button
                className="button color-hover"
                /*onClick={handleSaveClick}*/
              >
                Guardar
              </button>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Form_device;
