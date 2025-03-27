import { useEffect, useState } from "react";
import Form_edit_company_picture from "../forms/edits/Form_edit_company_picture";
import Form_edit_company_data from "../forms/edits/Form_edit_company_data";
import Form_edit_company_contact from "../forms/edits/Form_edit_company_contact";
import Form_edit_company_location from "../forms/edits/Form_edit_company_location";
// import Form_edit_palette from "../forms/edits/Form_edit_palette";
import Head from "../Head";
import axios from "axios";
import Tab_company from "./Tab_company";
import { FaEdit } from "react-icons/fa";
import Message from "../../Message";

const Company_data = ({}) => {
  const [showModalPicture, setShowModalPicture] = useState(false);
  const [showModalData, setShowModalData] = useState(false);
  const [showModalContact, setShowModalContact] = useState(false);
  const [showModalLocation, setShowModalLocation] = useState(false);
  const [mostrarModalPaleta, setMostrarModalPaleta] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState();
  const [dots, setDots] = useState("");
  const [formData, setFormData] = useState({});
  const api_key = import.meta.env.VITE_API_KEY;
  const [locationNames, setLocationNames] = useState({
    country: "",
    state: "",
    city: "",
  });
  const [showMessage, setShowMessage] = useState(false);
  const [titleMessage, setTitleMessage] = useState(false);
  const [message, setMessage] = useState(false);
  const [status, setStatus] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND +
          import.meta.env.VITE_ROUTE_BACKEND_COMPANY
      );
      setFormData(response.data.data);

      fetchLocationNames(
        response.data.data.country,
        response.data.data.state,
        response.data.data.city
      );
    } catch (error) {
      console.error("Error al obtener los datos de la empresa:", error);
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
        state: stateRes.data.name,
        city: cityName,
      });
    } catch (error) {
      console.error("Error al obtener nombres de ubicación:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateData = async () => {
    setIsLoading(true);
    fetchCompany();
  };

  const headData = {
    title: "Gestión de empresa",
    description:
      "En esta sección podrás gestionar y visualizar la información de la empresa.",
  };

  console.log(formData);

  return (
    <>
      <Head head_data={headData} />
      <Tab_company />
      {isLoading ? (
        <div className="rol-detail">
          <div className="loader-cell">
            <div className="loader cont-loader"></div>
            <p className="loader-text">Cargando información{dots}</p>
          </div>
        </div>
      ) : (
        <>
          <div className="rol-detail mb-4">
            <div className="media is-align-items-center">
              <div className="media-left">
                <figure
                  className="image is-64x64 profile-image icon-company"
                  onClick={() => setShowModalPicture(true)}
                >
                  <img
                    src={
                      formData.logo ||
                      "https://cdn-icons-png.flaticon.com/512/3135/3135768.png"
                    }
                    alt="Perfil"
                    className="is-rounded"
                  />
                </figure>
              </div>
              <div className="media-content">
                <div className="content">
                  <h2 className="title is-5 margin-bottom mt-1">
                    <strong>{formData.name}</strong>
                  </h2>
                  <p className="is-5 margin-bottom mt-2">
                    <strong>Nit:</strong> {formData.nit}
                  </p>
                  <p className="is-5 margin-bottom">
                    <strong>Certificado: </strong>
                    {"#"}
                    {formData.certificate.serial_number}
                  </p>
                </div>
              </div>
              <div className="level">
                <button
                  className="button"
                  onClick={() => setShowModalData(true)}
                >
                  <FaEdit className="mr-2" /> Editar
                </button>
              </div>
            </div>
          </div>
          <section className="rol-detail mb-4">
            <div className="level">
              <h3 className="title is-5 margin-bottom">
                Información de contacto
              </h3>
              <button
                className="button"
                onClick={() => setShowModalContact(true)}
              >
                <FaEdit className="mr-2" /> Editar
              </button>
            </div>
            <div className="columns">
              <div className="column">
                <strong>Correo electrónico</strong>
                <p>{formData.email}</p>
              </div>
              <div className="column">
                <strong>Teléfono</strong>
                <p>{formData.phone}</p>
              </div>
            </div>
          </section>
          <section className="rol-detail">
            <div className="level">
              <h3 className="title is-5 margin-bottom">Ubicación</h3>
              <button
                className="button"
                onClick={() => setShowModalLocation(true)}
              >
                <FaEdit className="mr-2" /> Editar
              </button>
            </div>
            <div className="columns">
              <div className="column">
                <strong>País</strong>
                <p>{locationNames.country || formData.country}</p>
              </div>
              <div className="column">
                <strong>Departamento</strong>
                <p>{locationNames.state || formData.state}</p>
              </div>
            </div>
            <div className="columns">
              <div className="column">
                <strong>Ciudad</strong>
                <p>{locationNames.city || formData.city}</p>
              </div>
              <div className="column">
                <strong>Dirección de la empresa</strong>
                <p>{formData.address}</p>
              </div>
            </div>
          </section>

          {/* <section className="rol-detail">
        <div className="level">
          <h3 className="title is-5 margin-bottom">Paleta de color</h3>
          <button
            className="button"
            onClick={() => setMostrarModalPaleta(true)}
          >
            <FaPlus className="mr-2" /> Añadir
          </button>
        </div>
        <div className="columns">
          <div className="column">
            <div className="rol-detail">
              <div className="level mb-2">
                <h3 className="is-5 margin-bottom">
                  [Nombre de la paleta de color]
                </h3>
                <button
                  className="button"
                  onClick={() => setMostrarModalPaleta(true)}
                >
                  <FaEdit className="mr-2" /> Editar
                </button>
              </div>
              <span
                className="tag"
                style={{ backgroundColor: "#6AA84F" }}
              ></span>
              <span
                className="tag"
                style={{ backgroundColor: "#B6D7A8" }}
              ></span>
              <span
                className="tag"
                style={{ backgroundColor: "#E0E5DA" }}
              ></span>
              <span
                className="tag"
                style={{ backgroundColor: "#6E6E6E" }}
              ></span>
              <span
                className="tag"
                style={{ backgroundColor: "#1D1D1D" }}
              ></span>
            </div>
          </div>
          <div className="column"></div>
        </div>
      </section> */}
        </>
      )}
      {/* Modales */}
      {showModalPicture && (
        <Form_edit_company_picture
          title="Editar logo de la empresa"
          onClose={() => setShowModalPicture(false)}
          data={formData}
          setShowMessage={setShowMessage}
          setTitleMessage={setTitleMessage}
          setMessage={setMessage}
          setStatus={setStatus}
          loading={loading}
          setLoading={setLoading}
          updateData={updateData}
        />
      )}
      {showModalData && (
        <Form_edit_company_data
          title="Editar información básica"
          onClose={() => setShowModalData(false)}
          data={formData}
          setShowMessage={setShowMessage}
          setTitleMessage={setTitleMessage}
          setMessage={setMessage}
          setStatus={setStatus}
          loading={loading}
          setLoading={setLoading}
          updateData={updateData}
        />
      )}
      {showModalContact && (
        <Form_edit_company_contact
          title="Editar información de contacto"
          onClose={() => setShowModalContact(false)}
          data={formData}
          setShowMessage={setShowMessage}
          setTitleMessage={setTitleMessage}
          setMessage={setMessage}
          setStatus={setStatus}
          loading={loading}
          setLoading={setLoading}
          updateData={updateData}
        />
      )}
      {showModalLocation && (
        <Form_edit_company_location
          title="Editar ubicación"
          onClose={() => setShowModalLocation(false)}
          data={formData}
          setShowMessage={setShowMessage}
          setTitleMessage={setTitleMessage}
          setMessage={setMessage}
          setStatus={setStatus}
          loading={loading}
          setLoading={setLoading}
          updateData={updateData}
        />
      )}
      {/* {mostrarModalPaleta && (
        <Form_edit_palette cerrarModal={() => setMostrarModalPaleta(false)} />
      )} */}
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

export default Company_data;
