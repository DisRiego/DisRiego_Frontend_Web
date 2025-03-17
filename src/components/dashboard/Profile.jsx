import { useEffect, useState } from "react";
import Head from "./Head";
import { FaCamera, FaEdit } from "react-icons/fa";
import {
  validatePhone,
  validatePassword,
  validateAddress,
} from "../../hooks/useValidations.jsx";
import Form_edit_profile_data from "./forms/edits/Form_edit_profile_data.jsx";
import Form_edit_profile_password from "./forms/edits/Form_edit_profile_password.jsx";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { FaRoad } from "react-icons/fa6";

const Profile = () => {
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

  const head_data = {
    title: "Mi perfil",
    description:
      "En esta sección podrás visualizar y editar tu información personal",
  };

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
    } catch (error) {
      console.error("Error al obtener los permisos:", error);
    }
  };

  console.log(formData);

  const updateData = async () => {
    fetchProfile();
  };

  const toTitleCase = (str) => {
    if (typeof str !== "string") return str; // Evita errores con números u otros tipos
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  return (
    <>
      <Head head_data={head_data} />
      <div className="">
        {/* Sección del perfil */}
        <div className=" profile-box rol-detail">
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
              <strong>Género</strong>
              <br />
              {formData.gender_name}
            </div>
            <div className="column">
              <strong>Fecha de nacimiento</strong>
              <br />
              []
            </div>
          </div>
          <div className="columns">
            <div className="column">
              <strong>Teléfono</strong>
              <br />
              {formData.phone}
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
            <h3 className="title is-5 margin-bottom">Cuenta y Seguridad</h3>
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
      {showFormData && (
        <>
          <Form_edit_profile_data
            title="Editar mi información"
            onClose={() => setShowFormData(false)}
            setShowMessage={setShowMessage}
            setTitleMessage={setTitleMessage}
            setMessage={setMessage}
            setStatus={setStatus}
            updateData={updateData}
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
            id={id}
          />
        </>
      )}
    </>
  );
};

export default Profile;
