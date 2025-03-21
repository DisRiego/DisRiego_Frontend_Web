import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  validateImage,
  validateAddress,
  validatePhone,
  validateText,
} from "../hooks/useValidations";
import { FaUpload } from "react-icons/fa6";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Confirm_update_info from "./Confirm_update_info";

const Form_update_info = ({
  title,
  onClose,
  setShowMessage,
  setTitleMessage,
  setMessage,
  setStatus,
  loading,
  setLoading,
}) => {
  const navigate = useNavigate();
  const api_key = import.meta.env.VITE_API_KEY;
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showConfirm, setShowConfirm] = useState();
  const [confirMessage, setConfirMessage] = useState();
  const [method, setMethod] = useState();
  const [uriPost, setUriPost] = useState();

  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const id = decoded.id;

  const [formData, setFormData] = useState({
    user_id: id,
    country: "",
    department: "",
    city: "",
    address: "",
    // phone_code: "",
    phone: "",
    profile_picture: null,
  });

  console.log(formData);

  const [errors, setErrors] = useState({
    user_id: "",
    country: "",
    department: "",
    city: "",
    address: "",
    // phone_code: "",
    phone: "",
    profile_picture: null,
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
    if (formData.country && formData.department) {
      axios
        .get(
          `https://api.countrystatecity.in/v1/countries/${formData.country}/states/${formData.department}/cities`,
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
  }, [formData.country, formData.department]);

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
    } else if (name === "state") {
      setFormData((prevData) => ({ ...prevData, department: value, city: "" }));
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      return;
    }

    const validation = validateImage(selectedFile);

    if (!validation.isValid) {
      setErrors((prev) => ({ ...prev, profile_picture: validation.error }));
      resetFileInput();
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setErrors((prev) => ({ ...prev, profile_picture: "" }));

    setFormData((prevData) => ({ ...prevData, profile_picture: selectedFile }));
  };

  const resetFileInput = () => {
    setFile(null);
    setFileName("");
    setFormData((prevData) => ({ ...prevData, profile_picture: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
      profile_picture: !file ? "Debe subir una foto de perfil" : "",
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleSubmit = async () => {
    setHasSubmitted(true);
    if (validateForm()) {
      setConfirMessage(`¿Desea actualizar su información?`);
      setMethod("post");
      setUriPost(
        import.meta.env.VITE_URI_BACKEND +
          import.meta.env.VITE_ROUTE_BACKEND_UPDATE_INFO
      );
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
                            : "is-true"
                          : ""
                      }`}
                    >
                      <select
                        name="department"
                        value={formData.department}
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
                        disabled={!formData.department}
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
            <div className="field">
              <label className="label">Foto de perfil</label>
              <div
                className={`file has-name is-fullwidth ${
                  errors.profile_picture ? "is-danger" : ""
                } error-file`}
              >
                <label className="file-label">
                  <input
                    ref={fileInputRef}
                    className="file-input"
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/gif"
                    onChange={handleFileChange}
                  />

                  <span className="file-cta">
                    <span className="file-icon">
                      <FaUpload />
                    </span>
                    <span className="file-label"> Subir foto… </span>
                  </span>
                  <span className="file-name">
                    {fileName || "Ningún archivo seleccionado"}
                  </span>
                </label>
              </div>
              {hasSubmitted && errors.profile_picture && (
                <p className="has-text-danger is-6">{errors.profile_picture}</p>
              )}
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
        <Confirm_update_info
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
          uriPost={uriPost}
          loading={loading}
          setLoading={setLoading}
        />
      )}
    </>
  );
};

export default Form_update_info;
