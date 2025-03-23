import { useEffect, useState } from "react";
import Head from "./Head";
import { FaEdit } from "react-icons/fa";
import Form_edit_profile_picture from "./forms/edits/Form_edit_profile_picture.jsx";
import Form_edit_profile_data from "./forms/edits/Form_edit_profile_data.jsx";
import Form_edit_profile_password from "./forms/edits/Form_edit_profile_password.jsx";
import Message from "../Message.jsx";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const Profile = () => {
  const [showFormPicture, setShowFormPicture] = useState(false);
  const [showFormData, setShowFormData] = useState(false);
  const [showFormPassword, setShowFormPassword] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [titleMessage, setTitleMessage] = useState(false);
  const [message, setMessage] = useState(false);
  const [status, setStatus] = useState(false);
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const id = decoded.id;
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [dots, setDots] = useState("");
  const [loading, setLoading] = useState("");

  const api_key = import.meta.env.VITE_API_KEY;
  const [locationNames, setLocationNames] = useState({
    country: "",
    state: "",
    city: "",
  });

  const head_data = {
    title: "Mi perfil",
    description:
      "En esta sección podrás visualizar y editar tu información personal",
  };

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND +
          import.meta.env.VITE_ROUTE_BACKEND_USERS +
          id
      );
      setFormData(response.data.data[0]);
      fetchLocationNames(
        response.data.data[0].country,
        response.data.data[0].department,
        response.data.data[0].city
      );
    } catch (error) {
      console.error("Error al obtener los permisos:", error);
    }
  };

  const updateData = async () => {
    setIsLoading(true);
    getUser();
  };

  const fetchLocationNames = async (countryCode, stateCode, cityId) => {
    try {
      const BASE_URL = "https://api.countrystatecity.in/v1";

      const countryRes = await axios.get(
        `${BASE_URL}/countries/${countryCode}`,
        {
          headers: { "X-CSCAPI-KEY": api_key },
        }
      );

      const stateRes = await axios.get(
        `${BASE_URL}/countries/${countryCode}/states/${stateCode}`,
        {
          headers: { "X-CSCAPI-KEY": api_key },
        }
      );

      const cityRes = await axios.get(
        `${BASE_URL}/countries/${countryCode}/states/${stateCode}/cities`,
        {
          headers: { "X-CSCAPI-KEY": api_key },
        }
      );

      const cityName =
        cityRes.data.find((city) => city.id === parseInt(cityId))?.name ||
        "Desconocido";

      setLocationNames({
        country: countryRes.data.name,
        state: stateRes.data.name,
        city: cityName,
      });

      setIsLoading(false);
    } catch (error) {
      console.error("Error al obtener nombres de ubicación:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toTitleCase = (str) => {
    if (typeof str !== "string") return str; // Evita errores con números u otros tipos
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  return (
    <>
      <Head head_data={head_data} />
      {isLoading ? (
        <div className="rol-detail">
          <div className="loader-cell">
            <div className="loader cont-loader"></div>
            <p className="loader-text">Cargando información{dots}</p>
          </div>
        </div>
      ) : (
        <div className="">
          {/* Sección del perfil */}
          <div className="rol-detail">
            <div className="media is-align-items-center">
              <div className="media-left">
                <figure className="image is-64x64 profile-image">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/3135/3135768.png"
                    alt="Perfil"
                    className="is-rounded"
                  />
                </figure>
              </div>
              <div className="media-content">
                <div className="content">
                  <h2 className="title is-5 margin-bottom">
                    <strong>
                      {formData.name} {formData.first_last_name}{" "}
                      {formData.second_last_name || ""}
                    </strong>
                  </h2>
                </div>
              </div>
              <div className="level">
                <button
                  className="button"
                  onClick={() => setShowFormPicture(true)}
                >
                  <FaEdit className="mr-2" /> Editar
                </button>
              </div>
            </div>
          </div>

          {/* Información Personal */}
          <div className="rol-detail">
            <div className="level">
              <h3 className="title is-5 margin-bottom">Información personal</h3>
              <button className="button" onClick={() => setShowFormData(true)}>
                <FaEdit className="mr-2" /> Editar
              </button>
            </div>
            <div className="columns">
              <div className="column">
                <strong>Tipo de documento</strong>
                <br />
                {formData.type_document_name}
              </div>
              <div className="column">
                <strong>Número de documento</strong>
                <br />
                {formData.document_number}
              </div>
            </div>
            <div className="columns">
              <div className="column">
                <strong>Fecha de nacimiento</strong>
                <br />
                []
              </div>
              <div className="column">
                <strong>Fecha de expedición</strong>
                <br />
                []
              </div>
            </div>
            <div className="columns">
              <div className="column">
                <strong>Genero</strong>
                <br />
                {formData.gender_name}
              </div>
              <div className="column">
                <strong>Teléfono</strong>
                <br />
                {formData.phone}
              </div>
            </div>
            <div className="columns">
              <div className="column">
                <strong>País, Departamento, Ciudad</strong>
                <br />
                {locationNames.country || formData.country},{" "}
                {locationNames.state || formData.department},{" "}
                {locationNames.city || formData.city}
              </div>
              <div className="column">
                <strong>Dirección de correspondencia</strong>
                <br />
                {toTitleCase(formData.address)}
              </div>
            </div>
          </div>

          {/* Cuenta y Seguridad */}
          <div className="rol-detail">
            <div className="level">
              <h3 className="title is-5 margin-bottom">Cuenta y contraseña</h3>
              <button
                className="button"
                onClick={() => setShowFormPassword(true)}
              >
                <FaEdit className="mr-2" /> Editar
              </button>
            </div>
            <div className="columns">
              <div className="column">
                <h3>Correo Electrónico</h3>
                <span>{formData.email}</span>
              </div>
              <div className="column">
                <strong>Contraseña</strong>
                <p>************</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {showFormPicture && (
        <>
          <Form_edit_profile_picture
            title="Editar foto de perfil"
            onClose={() => setShowFormPicture(false)}
            setShowMessage={setShowMessage}
            setTitleMessage={setTitleMessage}
            setMessage={setMessage}
            setStatus={setStatus}
            updateData={updateData}
            id={id}
            loading={loading}
            setLoading={setLoading}
            token={token}
          />
        </>
      )}
      {showFormData && (
        <>
          <Form_edit_profile_data
            title="Editar mi información personal"
            onClose={() => setShowFormData(false)}
            data={formData}
            setShowMessage={setShowMessage}
            setTitleMessage={setTitleMessage}
            setMessage={setMessage}
            setStatus={setStatus}
            pdateData={updateData}
            id={id}
            loading={loading}
            setLoading={setLoading}
            token={token}
          />
        </>
      )}
      {showFormPassword && (
        <>
          <Form_edit_profile_password
            title="Editar mi contraseña"
            onClose={() => setShowFormPassword(false)}
            setShowMessage={setShowMessage}
            setTitleMessage={setTitleMessage}
            setMessage={setMessage}
            setStatus={setStatus}
            updateData={updateData}
            id={formData.id}
            loading={loading}
            setLoading={setLoading}
          />
        </>
      )}
      {showMessage && (
        <Message
          titleMessage={titleMessage}
          message={message}
          status={status}
          onClose={() => setShowMessage(false)}
        />
      )}
    </>
  );
};

export default Profile;
