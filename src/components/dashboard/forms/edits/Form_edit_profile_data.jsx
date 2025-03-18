import { useEffect, useState } from "react";
import axios from "axios";
import {
  validateAddress,
  validatePhone,
  validateText,
} from "../../../../hooks/useValidations";

const Form_edit_profile_data = ({ title, onClose }) => {
  const api_key = import.meta.env.VITE_API_KEY;
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    country: "",
    state: "",
    city_id: "",
    address: "",
    phone_code: "",
    phone: "",
  });

  const [errors, setErrors] = useState({
    country: "",
    state: "",
    city_id: "",
    address: "",
    phone_code: "",
    phone: "",
  });

  useEffect(() => {
    axios
      .get("https://api.countrystatecity.in/v1/countries", {
        headers: { "X-CSCAPI-KEY": api_key },
      })
      .then((response) => {
        setCountries(response.data);
      })
      .catch((error) => console.error("Error al obtener los países:", error));
  }, []);

  useEffect(() => {
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
  }, [formData.country]);

  useEffect(() => {
    if (formData.country && formData.state) {
      axios
        .get(
          `https://api.countrystatecity.in/v1/countries/${formData.country}/states/${formData.state}/cities`,
          {
            headers: { "X-CSCAPI-KEY": api_key },
          }
        )
        .then((response) => {
          const sortedCities = response.data.sort((a, b) =>
            a.name.localeCompare(b.name)
          );
          setCities(sortedCities);
        })
        .catch((error) =>
          console.error("Error al obtener las ciudades:", error)
        );
    } else {
      setCities([]);
    }
  }, [formData.country, formData.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    if (name === "country") {
      const selectedCountry = countries.find((c) => c.iso2 === value);
      setFormData((prevData) => ({
        ...prevData,
        country: value,
        state: "",
        city_id: "",
        phone_code: selectedCountry ? selectedCountry.phonecode : "",
      }));
    } else if (name === "state") {
      setFormData((prevData) => ({ ...prevData, state: value, city_id: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      country: !formData.country ? "Debe seleccionar un país" : "",
      state: !formData.state ? "Debe seleccionar un departamento" : "",
      city_id: !formData.city_id ? "Debe seleccionar una ciudad" : "",
      address: !validateAddress(formData.address) ? "Dirección inválida" : "",
      phone_code: !validatePhone(formData.phone_code) ? "Sin extensión" : "",
      phone: !validatePhone(formData.phone) ? "Número de celular inválido" : "",
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleSubmit = () => {
    setHasSubmitted(true);
    if (validateForm()) {
      console.log("Formulario válido, enviando datos...");
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
                  <label className="label">País</label>
                  <div className="control">
                    <div
                      className={`select ${
                        hasSubmitted
                          ? errors.city_id
                            ? "is-false"
                            : "is-true"
                          : ""
                      }`}
                    >
                      <select
                        name="country"
                        className={`select`}
                        value={formData.country}
                        onChange={handleChange}
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
                          ? errors.city_id
                            ? "is-false"
                            : "is-true"
                          : ""
                      }`}
                    >
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        disabled={!formData.country}
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
                  {hasSubmitted && errors.state && (
                    <p className="input-error">{errors.state}</p>
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
                        hasSubmitted
                          ? errors.city_id
                            ? "is-false"
                            : "is-true"
                          : ""
                      }`}
                    >
                      <select
                        name="city_id"
                        value={formData.city_id}
                        onChange={handleChange}
                        disabled={!formData.state}
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
                  {hasSubmitted && errors.city_id && (
                    <p className="input-error">{errors.city_id}</p>
                  )}
                </div>
              </div>
              <div className="column">
                <div className="field">
                  <label className="label">Dirección de correspondencia</label>
                  <div className="control">
                    <input
                      className={`input ${
                        hasSubmitted
                          ? errors.address
                            ? "is-false"
                            : "is-true"
                          : ""
                      }`}
                      type="text"
                      name="address"
                      placeholder="Ingresa tu dirección de residencia"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                  {hasSubmitted && errors.address && (
                    <p className="input-error">{errors.address}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="columns">
              <div className="column is-one-fifth">
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
              </div>
              <div className="column">
                <div className="field">
                  <label className="label">Número de celular</label>
                  <div className="control">
                    <input
                      className={`input ${
                        hasSubmitted
                          ? errors.phone
                            ? "is-false"
                            : "is-true"
                          : ""
                      }`}
                      type="number"
                      name="phone"
                      placeholder="Ingresa tu número de celular"
                      value={formData.phone}
                      onChange={handleChange}
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
              <button className="button is-danger" onClick={onClose}>
                Cancelar
              </button>
              <button className="button color-hover" onClick={handleSubmit}>
                Guardar
              </button>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Form_edit_profile_data;
