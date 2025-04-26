import { useEffect, useState } from "react";
import axios from "axios";
import Confirm_modal from "../../reusable/Confirm_modal";
import {
  validateAddress,
  validatePhone,
} from "../../../../hooks/useValidations";

const Form_edit_profile_data = ({
  title,
  onClose,
  data,
  id,
  setShowMessage,
  setTitleMessage,
  setMessage,
  setStatus,
  loading,
  setLoading,
  updateData,
  token,
}) => {
  const api_key = import.meta.env.VITE_API_KEY;
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirMessage, setConfirMessage] = useState();
  const [method, setMethod] = useState();
  const [uriPost, setUriPost] = useState("");
  const [typeForm, setTypeForm] = useState("");

  const feedbackMessages = {
    update_data: {
      successTitle: "Actualización exitosa",
      successMessage:
        "La información de su usuario ha sido actualizada correctamente.",
      errorTitle: "Error al actualizar",
      errorMessage: `No se pudo actualizar la información de su usuario.
      \n Por favor, inténtelo de nuevo.`,
    },
  };

  const [formData, setFormData] = useState({
    country: "",
    department: "",
    city: "",
    address: "",
    // phone_code: "",
    phone: "",
  });

  const [errors, setErrors] = useState({
    country: "",
    department: "",
    city: "",
    address: "",
    // phone_code: "",
    phone: "",
  });

  useEffect(() => {
    console.log(data);
    if (data) {
      setFormData({
        country: data.country || "",
        department: data.department || "",
        city: data.city || "",
        address: data.address || "",
        phone: data.phone || "",
      });
    }
  }, [data]);

  useEffect(() => {
    getCountry();
  }, []);

  useEffect(() => {
    getState();
  }, [formData.country]);

  useEffect(() => {
    getCity();
  }, [formData.department]);

  const getCountry = async () => {
    axios
      .get("https://api.countrystatecity.in/v1/countries", {
        headers: { "X-CSCAPI-KEY": api_key },
      })
      .then((response) => {
        setCountries(response.data);
      })
      .catch((error) => console.error("Error al obtener los países:", error));
  };

  const getState = async () => {
    if (formData.country) {
      axios
        .get(
          `https://api.countrystatecity.in/v1/countries/${formData.country}/states`,
          {
            headers: { "X-CSCAPI-KEY": api_key },
          }
        )
        .then((response) => {
          const sortedStates = response.data.sort((a, b) =>
            a.name.localeCompare(b.name)
          );
          setStates(sortedStates);
        })
        .catch((error) =>
          console.error("Error al obtener los departamentos:", error)
        );
    } else {
      setStates([]);
    }
  };

  const getCity = async () => {
    if (formData.country && formData.department) {
      setDisabled(true); // Deshabilitar los inputs mientras se carga
      try {
        const response = await axios.get(
          `https://api.countrystatecity.in/v1/countries/${formData.country}/states/${formData.department}/cities`,
          { headers: { "X-CSCAPI-KEY": api_key } }
        );
        const sortedCities = response.data.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setCities(sortedCities);
      } catch (error) {
        console.error("Error al obtener las ciudades:", error);
      } finally {
        setDisabled(false); // Habilitar solo si los datos han cargado
      }
    } else {
      setCities([]);
      setDisabled(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    if (name === "country") {
      const selectedCountry = countries.find((c) => c.iso2 === value);
      setFormData((prevData) => ({
        ...prevData,
        country: value,
        department: "",
        city: "",
        // phone_code: selectedCountry ? selectedCountry.phonecode : "",
      }));
    } else if (name === "department") {
      setFormData((prevData) => ({ ...prevData, department: value, city: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      country: !formData.country ? "Debe seleccionar un país" : "",
      department: !formData.department
        ? "Debe seleccionar un departamento"
        : "",
      city: !formData.city ? "Debe seleccionar una ciudad" : "",
      address: !validateAddress(formData.address) ? "Dirección inválida" : "",
      // phone_code: !validatePhone(formData.phone_code) ? "Sin extensión" : "",
      phone: !validatePhone(formData.phone) ? "Número de celular inválido" : "",
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleSubmit = () => {
    setHasSubmitted(true);
    if (validateForm()) {
      setConfirMessage("¿Desea actualizar la información de su usuario?");
      setMethod("put");
      setUriPost(
        import.meta.env.VITE_URI_BACKEND +
          import.meta.env.VITE_ROUTE_BACKEND_USERS_EDIT +
          id
      );
      setTypeForm("update_data");
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
            <div className="columns">
              <div className="column">
                <div className="field">
                  <label className="label">País</label>
                  <div className="control">
                    <div
                      className={`select ${
                        hasSubmitted ? (errors.country ? "is-false" : "") : ""
                      }`}
                    >
                      <select
                        name="country"
                        className={`select`}
                        value={formData.country}
                        onChange={handleChange}
                        disabled={disabled || countries.length === 0}
                      >
                        <option value="" disabled>
                          Seleccione un país
                        </option>
                        {countries.map((country) => (
                          <option key={country.iso2} value={country.iso2}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {hasSubmitted && errors.country && (
                    <p className="input-error">{errors.country}</p>
                  )}
                </div>
              </div>
              <div className="column">
                <div className="field">
                  <label className="label">Departamento</label>
                  <div className="control">
                    <div
                      className={`select ${
                        hasSubmitted
                          ? errors.department
                            ? "is-false"
                            : ""
                          : ""
                      }`}
                    >
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        disabled={disabled || states.length === 0}
                      >
                        <option value="">Seleccione un departamento</option>
                        {states.map((state) => (
                          <option key={state.iso2} value={state.iso2}>
                            {state.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {hasSubmitted && errors.department && (
                    <p className="input-error">{errors.department}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="columns">
              <div className="column">
                <div className="field">
                  <label className="label">Ciudad</label>
                  <div className="control">
                    <div
                      className={`select ${
                        hasSubmitted ? (errors.city ? "is-false" : "") : ""
                      }`}
                    >
                      <select
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        disabled={disabled}
                      >
                        <option value="">Seleccione una ciudad</option>
                        {cities.map((city) => (
                          <option key={city.id} value={city.id}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {hasSubmitted && errors.city && (
                    <p className="input-error">{errors.city}</p>
                  )}
                </div>
              </div>
              <div className="column">
                <div className="field">
                  <label className="label">Dirección de correspondencia</label>
                  <div className="control">
                    <input
                      className={`input ${
                        hasSubmitted ? (errors.address ? "is-false" : "") : ""
                      }`}
                      type="text"
                      name="address"
                      placeholder="Ingresa tu dirección de residencia"
                      value={formData.address}
                      onChange={handleChange}
                      disabled={disabled}
                    />
                  </div>
                  {hasSubmitted && errors.address && (
                    <p className="input-error">{errors.address}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="columns">
              {/* <div className="column is-one-fifth">
                <div className="field">
                  <label className="label">Extensión</label>
                  <div className="control">
                    <input
                      className={`input has-text-centered ${
                        hasSubmitted
                          ? errors.country
                            ? "is-false"
                            : "is-true"
                          : ""
                      }`}
                      type="text"
                      name="number_phone"
                      placeholder=""
                      value={
                        formData.phone_code ? `+${formData.phone_code}` : ""
                      }
                      disabled
                    />
                  </div>
                  {hasSubmitted && errors.phone_code && (
                    <p className="input-error">{errors.phone_code}</p>
                  )}
                </div>
              </div> */}
              <div className="column">
                <div className="field">
                  <label className="label">Número de celular</label>
                  <div className="control">
                    <input
                      className={`input ${
                        hasSubmitted ? (errors.phone ? "is-false" : "") : ""
                      }`}
                      type="number"
                      name="phone"
                      placeholder="Ingresa tu número de celular"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={disabled}
                    />
                  </div>
                  {hasSubmitted && errors.phone && (
                    <p className="input-error">{errors.phone}</p>
                  )}
                </div>
              </div>
            </div>
          </section>
          <footer className="modal-card-foot is-flex is-justify-content-center">
            <div className="buttons">
              <button className="button" onClick={onClose}>
                Cancelar
              </button>
              <button className="button color-hover" onClick={handleSubmit}>
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
          formData={formData}
          setShowMessage={setShowMessage}
          setTitleMessage={setTitleMessage}
          setMessage={setMessage}
          setStatus={setStatus}
          updateData={updateData}
          uriPost={uriPost}
          typeForm={typeForm}
          loading={loading}
          setLoading={setLoading}
          token={token}
          feedbackMessages={feedbackMessages}
        />
      )}
    </>
  );
};

export default Form_edit_profile_data;
