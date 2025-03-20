import { useEffect, useState } from "react";
import axios from "axios";
import Confirm_company from "../../confirm_view/Confirm_company";
import {
  validateAddress,
  validatePhone,
  validateText,
} from "../../../../hooks/useValidations";

const Form_edit_company_location = ({
  title,
  onClose,
  data,
  setShowMessage,
  setTitleMessage,
  setMessage,
  setStatus,
  loading,
  setLoading,
  updateData,
}) => {
  const api_key = import.meta.env.VITE_API_KEY;
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirMessage, setConfirMessage] = useState();
  const [method, setMethod] = useState();
  const [uriPost, setUriPost] = useState("");
  const [typeForm, setTypeForm] = useState("");
  const [newData, setNewData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    country: "",
    state: "",
    city: "",
    address: "",
  });

  const [errors, setErrors] = useState({
    country: "",
    state: "",
    city: "",
    address: "",
  });

  useEffect(() => {
    setIsLoading(true);
    if (data) {
      setFormData({
        country: data.country || "",
        state: data.state || "",
        city: data.city || "",
        address: data.address || "",
      });
    }
  }, [data]);

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
        )
        .finally(() => setIsLoading(false));
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
        city: "",
        phone_code: selectedCountry ? selectedCountry.phonecode : "",
      }));
    } else if (name === "state") {
      setFormData((prevData) => ({ ...prevData, state: value, city: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      country: !formData.country ? "Debe seleccionar un país" : "",
      state: !formData.state ? "Debe seleccionar un departamento" : "",
      city: !formData.city ? "Debe seleccionar una ciudad" : "",
      address: !validateAddress(formData.address) ? "Dirección inválida" : "",
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleSubmit = () => {
    setHasSubmitted(true);
    console.log(formData);
    if (!validateForm()) {
      return;
    }
    const formDataToSend = new FormData();
    formDataToSend.append("country", formData.country);
    formDataToSend.append("state", formData.state);
    formDataToSend.append("city", formData.city);
    formDataToSend.append("address", formData.address);

    setNewData(formDataToSend);
    setConfirMessage('¿Desea actualizar el logo de "' + data.name + '"?');
    setMethod("patch");
    setUriPost(
      import.meta.env.VITE_URI_BACKEND +
        import.meta.env.VITE_ROUTE_BACKEND_COMPANY_EDIT_LOCATION
    );
    setTypeForm("update_location_profile");
    setShowConfirm(true);
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
                        hasSubmitted
                          ? errors.country
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
                        disabled={isLoading}
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
                          ? errors.state
                            ? "is-false"
                            : "is-true"
                          : ""
                      }`}
                    >
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        disabled={isLoading}
                      >
                        <option value="" disabled>
                          Seleccione un departamento
                        </option>
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
                          ? errors.city
                            ? "is-false"
                            : "is-true"
                          : ""
                      }`}
                    >
                      <select
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        disabled={isLoading}
                      >
                        <option value="" disabled>
                          Seleccione una ciudad
                        </option>
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
                      disabled={isLoading}
                    />
                  </div>
                  {hasSubmitted && errors.address && (
                    <p className="input-error">{errors.address}</p>
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
        <Confirm_company
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

export default Form_edit_company_location;
