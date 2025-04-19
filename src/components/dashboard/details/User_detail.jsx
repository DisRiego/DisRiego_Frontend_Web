import { useEffect, useState } from "react";
import { data, useParams } from "react-router-dom";
import axios from "axios";
import Head from "../reusable/Head";
import { TbPointFilled } from "react-icons/tb";

const User_detail = ({ user }) => {
  const { id } = useParams();
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [dots, setDots] = useState("");
  const [loading, setLoading] = useState("");

  const api_key = import.meta.env.VITE_API_KEY;
  const [locationNames, setLocationNames] = useState({
    country: "",
    department: "",
    city: "",
  });

  const head_data = {
    title: `Ver Detalles del Usuario #${id}`,
    description:
      "En esta sección, puedes visualizar la información del usuario seleccionado.",
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const getUser = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND +
          import.meta.env.VITE_ROUTE_BACKEND_USERS +
          id
      );
      console.log(response.data.data[0]);
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
        department: stateRes.data.name,
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

  console.log(formData);

  return (
    <>
      <Head className="mb-3" head_data={head_data} />
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
                    src={
                      formData.profile_picture ||
                      "https://cdn-icons-png.flaticon.com/512/3135/3135768.png"
                    }
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
                  className={
                    "button status-" + formData.status_name.toLowerCase()
                  }
                  onClick={() => setShowFormPicture(true)}
                >
                  <TbPointFilled className="mr-1" />
                  <p className="mr-1">{formData.status_name || ""}</p>
                </button>
              </div>
            </div>
          </div>

          {/* Información Personal */}
          <div className="rol-detail">
            <div className="level">
              <h3 className="title is-5 margin-bottom">Información personal</h3>
            </div>
            <div className="columns">
              <div className="column">
                <strong>Tipo de documento</strong>
                <br />
                {formData.type_document_name || "[]"}
              </div>
              <div className="column">
                <strong>Número de documento</strong>
                <br />
                {formData.document_number || "[]"}
              </div>
            </div>
            <div className="columns">
              <div className="column">
                <strong>Fecha de nacimiento</strong>
                <br />
                {formData.birthday ? formData.birthday.slice(0, 10) : "[]"}
              </div>
              <div className="column">
                <strong>Fecha de expedición</strong>
                <br />
                {formData.date_issuance_document
                  ? formData.date_issuance_document.slice(0, 10)
                  : "[]"}
              </div>
            </div>
            <div className="columns">
              <div className="column">
                <strong>Genero</strong>
                <br />
                {formData.gender_name || "[]"}
              </div>
              <div className="column">
                <strong>Teléfono</strong>
                <br />
                {formData.phone || "[]"}
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
                {toTitleCase(formData.address || "[]")}
              </div>
            </div>
            <div className="columns">
              <div className="column">
                <strong>Correo Electrónico</strong>
                <br />
                {formData.email || "[]"}
              </div>
              <div className="column">
                <strong>Rol(es)</strong>
                <br />
                {formData.roles.map((p) => toTitleCase(p.name)).join(", ") ||
                  "[]"}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default User_detail;
