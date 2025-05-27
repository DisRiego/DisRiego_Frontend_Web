import { useEffect, useState } from "react";
import axios from "axios";
import {
  validateDescriptionReject,
  validatePhone,
  validateText,
} from "../../../../hooks/useValidations";
import Confirm_modal from "../../reusable/Confirm_modal";
import { FaSearch } from "react-icons/fa";
import { IoMdWarning } from "react-icons/io";

const Form_concept = ({
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
  const [showForm, setShowForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [dataProperty, setDataProperty] = useState([]);
  const [newData, setNewData] = useState();
  const [propertyValidate, setPropertyValidate] = useState("");
  const [dataLot, setDataLot] = useState([]);
  const [disabled, setDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [submittedProperty, setSubmittedProperty] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [confirMessage, setConfirMessage] = useState();
  const [method, setMethod] = useState();
  const [uriPost, setUriPost] = useState("");
  const [typeForm, setTypeForm] = useState("");
  const [dataType, setDataType] = useState([]);
  const [dataScope, setDataScope] = useState([]);

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    valor: "",
    tipo_id: "",
    scope_id: "",
    predio_id: "",
    lote_id: "",
  });

  const [errors, setErrors] = useState({
    nombre: "",
    descripcion: "",
    valor: "",
    tipo_id: "",
    scope_id: "",
    predio_id: "",
    lote_id: "",
  });

  const feedbackMessages = {
    create: {
      successTitle: "Concepto creado exitosamente",
      successMessage: "El concepto ha sido creado correctamente.",
      errorTitle: "Error al crear el concepto",
      errorMessage:
        "No se pudo crear el concepto. Por favor, inténtelo de nuevo.",
    },
    edit: {
      successTitle: "Modificación exitosa",
      successMessage: "El concepto ha sido modificado correctamente.",
      errorTitle: "Modificación fallida",
      errorMessage:
        "No se pudo modificar el concepto. Por favor, inténtelo de nuevo.",
    },
  };

  useEffect(() => {
    getType();
    getScope();
    if (id != null) {
      getConcept();
    }
  }, []);

  const getType = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND_FACTURACTION +
          import.meta.env.VITE_ROUTE_BACKEND_GET_TPYE_CONCEPT
      );
      const sortedData = response.data.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setDataType(sortedData);
    } catch (error) {
      console.error("Error al obtener los tipos:", error);
    }
  };

  const getScope = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND_FACTURACTION +
          import.meta.env.VITE_ROUTE_BACKEND_GET_SCOPE_CONCEPT
      );
      const sortedData = response.data.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setDataScope(sortedData);
    } catch (error) {
      console.error("Error al obtener los alcances:", error);
    }
  };

  const getConcept = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND_FACTURACTION +
          import.meta.env.VITE_ROUTE_BACKEND_CONCEPT +
          id
      );
      const sortedData = response.data.data;
      setFormData({
        nombre: sortedData.nombre,
        descripcion: sortedData.descripcion,
        valor: sanitizeValor(sortedData.valor),
        tipo_id: sortedData.tipo_id,
        scope_id: sortedData.scope_id,
        predio_id: sortedData.predio_id,
      });

      if (
        (sortedData.scope_id === "2" || sortedData.scope_id === 2) &&
        sortedData.predio_id
      ) {
        await getPropertyByID(sortedData.predio_id);
        setFormData((prev) => ({ ...prev, lote_id: sortedData.lote_id }));
      }
      // setDataType(sortedData);
    } catch (error) {
      console.error("Error al obtener el concepto:", error);
    }
  };

  const getPropertyByID = async (property_id) => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND +
          import.meta.env.VITE_ROUTE_BACKEND_PROPERTY +
          property_id
      );
      const sortedData = response.data.data;
      await getLot(property_id);
      setPropertyValidate("");
      setDataProperty(sortedData);
      setShowForm(true);
      setSubmittedProperty(true);
      setDisabled(false);
      setIsLoading(false);
      setFormData((prev) => ({ ...prev, predio_id: property_id }));
      setErrors((prev) => ({ ...prev, lote_id: "" }));
    } catch (error) {
      console.error("Error al obtener los predios:", error);

      if (error.status === 404) {
        setPropertyValidate(
          "El predio no se encuentra registrado en la plataforma"
        );

        if (property_id === 0 || property_id === "") {
          setFormData((prev) => ({ ...prev, predio_id: "", lote_id: "" }));
        } else {
          setFormData((prev) => ({ ...prev, lote_id: "" }));
        }
        setErrors((prev) => ({ ...prev, predio_id: "" }));

        setShowForm(false);
      }
    }
  };

  const getLot = async (property_id) => {
    try {
      setFormData((prev) => ({ ...prev, lote_id: "" }));
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND +
          import.meta.env.VITE_ROUTE_BACKEND_PROPERTY +
          property_id +
          import.meta.env.VITE_ROUTE_BACKEND_LOTS
      );
      const sortedData = response.data.data.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setDataLot(sortedData);
    } catch (error) {
      console.error("Error al obtener los lotes:", error);
      setDataLot([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleValidate = async () => {
    const isPropertyValid = validatePhone(formData.predio_id);

    if (!isPropertyValid) {
      setShowForm(false);
      setDataProperty([]);
      setDataLot([]);
      setPropertyValidate("Debe ingresar un ID de predio válido.");
      setErrors((prev) => ({ ...prev, predio_id: "" }));
    }

    if (isPropertyValid) {
      getPropertyByID(formData.predio_id);
    }
    setSubmittedProperty(true);
  };

  const handleSaveClick = () => {
    setSubmitted(true);
    const isNameValid = validateText(formData.nombre);
    const isDescriptionValid = validateDescriptionReject(formData.descripcion);
    const isValueValid = validatePhone(formData.valor);
    const isTypeValid = validatePhone(formData.tipo_id);
    const isScopeValid = validatePhone(formData.scope_id);
    const isPropertyValid = validatePhone(formData.predio_id);
    const isLotValid = validatePhone(formData.lote_id);

    setErrors({
      nombre: isNameValid ? "" : "false" && "Nombre inválido",
      descripcion: isDescriptionValid ? "" : "false" && "Descripción inválida",
      valor: isValueValid ? "" : "false" && "Valor inválido",
      tipo_id: isTypeValid ? "" : "false" && "Debe seleccionar una opción",
      scope_id: isScopeValid ? "" : "false" && "Debe seleccionar una opción",
      predio_id: isPropertyValid ? "" : "false" && "Predio inválido",
      lote_id: isLotValid ? "" : "false" && "Debe seleccionar una opción",
    });

    setPropertyValidate("");

    if (
      isNameValid &&
      isDescriptionValid &&
      isValueValid &&
      isTypeValid &&
      isScopeValid
    ) {
      if (formData.scope_id === "2" || formData.scope_id === 2) {
        if (isPropertyValid && isLotValid) {
          console.log("Entro al if");
          setNewData({
            nombre: formData.nombre,
            descripcion: formData.descripcion,
            valor: parseInt(formData.valor),
            tipo_id: parseInt(formData.tipo_id),
            scope_id: parseInt(formData.scope_id),
            predio_id: parseInt(formData.predio_id),
            lote_id: parseInt(formData.lote_id),
          });

          viewModal();
        } else {
          setErrors((prev) => ({
            ...prev,
            predio_id: isPropertyValid ? "" : "Predio inválido",
            lote_id: isLotValid ? "" : "Debe seleccionar una opción",
          }));
        }
      } else {
        console.log("Entro al else");
        setNewData({
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          valor: parseInt(formData.valor),
          tipo_id: parseInt(formData.tipo_id),
          scope_id: parseInt(formData.scope_id),
          predio_id: null,
          lote_id: null,
        });
        viewModal();
      }
    }
  };

  const viewModal = () => {
    if (id != null) {
      setConfirMessage(`¿Desea actualizar el concepto con ID "${id}"?`);
      setMethod("put");
      setUriPost(
        import.meta.env.VITE_URI_BACKEND_FACTURACTION +
          import.meta.env.VITE_ROUTE_BACKEND_CONCEPT +
          id
      );
      setTypeForm("edit");
    } else {
      setConfirMessage(
        `¿Desea crear el concepto "${toTitleCase(formData.nombre)}"?`
      );
      setMethod("post");
      setUriPost(
        import.meta.env.VITE_URI_BACKEND_FACTURACTION +
          import.meta.env.VITE_ROUTE_BACKEND_CONCEPT
      );
      setTypeForm("create");
    }

    setShowConfirm(true);
  };

  const toTitleCase = (str) => {
    if (typeof str !== "string") return str; // Evita errores con números u otros tipos
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const sanitizeValor = (valor) => {
    if (typeof valor === "string") {
      // Reemplaza ',' por '.' si es separador decimal, luego parsea
      const numeric = parseFloat(valor.replace(",", "."));
      return isNaN(numeric) ? "" : Math.floor(numeric); // Devuelve solo la parte entera
    }
    return valor;
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
            <div className="container-input">
              <div className="columns">
                <div className="column">
                  <div className="field">
                    <label className="label">Nombre</label>
                    <div className="control">
                      <input
                        className={`input ${
                          submitted ? (errors.nombre ? "is-false" : "") : ""
                        }`}
                        type="text"
                        name="nombre"
                        placeholder="Ingrese el nombre del concepto"
                        value={formData.nombre}
                        onChange={handleChange}
                        //   disabled={isLoading}
                      />
                    </div>
                    {submitted && errors.nombre && (
                      <p className="input-error">{errors.nombre}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="container-input">
              <div className="columns">
                <div className="column">
                  <div className="field">
                    <label className="label">Descripción</label>
                    <div className="control">
                      <textarea
                        className={`textarea ${
                          submitted
                            ? errors.descripcion
                              ? "is-false"
                              : ""
                            : ""
                        }`}
                        name="descripcion"
                        placeholder="Ingrese la descripción del concepto"
                        value={formData.descripcion}
                        onChange={handleChange}
                        //   disabled={isLoading}
                      />
                    </div>
                    {submitted && errors.descripcion && (
                      <p className="input-error">{errors.descripcion}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="container-input">
              <div className="columns">
                <div className="column">
                  <div className="field">
                    <label className="label">Valor</label>
                    <div className="control">
                      <input
                        className={`input ${
                          submitted ? (errors.valor ? "is-false" : "") : ""
                        }`}
                        type="number"
                        name="valor"
                        placeholder="Ingrese el valor"
                        value={formData.valor}
                        onChange={handleChange}
                        //   disabled={isLoading}
                      />
                    </div>
                    {submitted && errors.valor && (
                      <p className="input-error">{errors.valor}</p>
                    )}
                  </div>
                </div>
                <div className="column">
                  <div className="field">
                    <label className="label">Tipo</label>
                    <div className="control">
                      <div
                        class={`select ${
                          submitted ? (errors.tipo_id ? "is-false" : "") : ""
                        }`}
                      >
                        <select
                          name="tipo_id"
                          value={formData.tipo_id}
                          onChange={handleChange}
                          disabled={dataType.length === 0}
                        >
                          <option value="" disabled>
                            Seleccione una opción
                          </option>
                          {dataType.map((type) => (
                            <option key={type.id} value={type.id}>
                              {type.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      {submitted && errors.tipo_id && (
                        <p className="input-error">{errors.tipo_id}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="container-input">
              <div className="columns">
                <div className="column">
                  <div className="field">
                    <label className="label">Alcance</label>
                    <div className="control">
                      <div
                        class={`select ${
                          submitted ? (errors.scope_id ? "is-false" : "") : ""
                        }`}
                      >
                        <select
                          name="scope_id"
                          value={formData.scope_id}
                          onChange={handleChange}
                          disabled={dataScope.length === 0}
                        >
                          <option value="" disabled>
                            Seleccione una opción
                          </option>
                          {dataScope.map((scope) => (
                            <option key={scope.id} value={scope.id}>
                              {scope.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      {submitted && errors.scope_id && (
                        <p className="input-error">{errors.scope_id}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {(formData.scope_id === "2" || formData.scope_id === 2) && (
              <>
                <div className="container-input">
                  <div className="columns">
                    <div className="column">
                      <label className="label">ID del predio</label>
                      <div className="field has-addons mb-0">
                        <div className="control is-expanded">
                          <input
                            className={`input ${
                              submitted
                                ? errors.predio_id
                                  ? "is-false"
                                  : ""
                                : ""
                            }`}
                            name="predio_id"
                            type="number"
                            placeholder="Ingrese el ID del predio"
                            value={formData.predio_id}
                            onChange={handleChange}
                            // disabled={isLoading}
                          />
                        </div>
                        <div className="control">
                          <button
                            className={`button button-search ${
                              submitted
                                ? errors.predio_id
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
                      {submitted && errors.predio_id && (
                        <p className="input-error">{errors.predio_id}</p>
                      )}
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
                    <div className="container-input">
                      <div className="columns">
                        <div className="column">
                          <div className="field">
                            <label className="label">Nombre del predio</label>
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
                            <label className="label">Lote</label>
                            <div className="control">
                              <div
                                className={`select ${
                                  submitted && errors.lote_id ? "is-false" : ""
                                }`}
                              >
                                <select
                                  name="lote_id"
                                  value={formData.lote_id}
                                  onChange={handleChange}
                                  disabled={
                                    isLoading ||
                                    !formData.predio_id ||
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
                              {submitted && errors.lote_id && (
                                <p className="input-error">{errors.lote_id}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
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
          formData={newData}
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

export default Form_concept;
