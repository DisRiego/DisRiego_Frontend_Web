import { useParams } from "react-router-dom";
import Head from "../Head";

const User_detail = ({ user }) => {
  const { id } = useParams();

  const head_data = {
    title: `Ver Detalles del Usuario #${id}`,
    description:
      "En esta sección, puedes visualizar la información del usuario seleccionado.",
  };

  const userData = {
    id: 101,
    name: "Juan Pérez",
    documentNumber: "123456789",
    email: "juan.perez@example.com",
    address: "Calle 123, Ciudad",
    roles: "Administrador",
    gender: "Masculino",
    documentIssueDate: "2022-05-10",
    phone: "+57 300 123 4567",
    birthDate: "1990-08-15",
    status: "Operativo",
  };

  const userInfo = user || userData;

  return (
    <div>
      <Head className="mb-3" head_data={head_data} />

      {/* Información del usuario */}
      <div className="rol-detail">
        <div className="is-flex is-justify-content-space-between is-align-items-center">
          <h3 className="title is-6">Estado actual</h3>
          <span
            className={`button detail-status ${
              userInfo.status === "Operativo" ? "is-success" : "is-danger"
            }`}
          >
            {userInfo.status}
          </span>
        </div>

        {/* Sección de datos del usuario */}
        <div className="columns">
          <div className="column">
            <h3 className="title is-6 mb-2">Nombre del usuario</h3>
            <p>{userInfo.name}</p>

            <h3 className="title is-6 mt-5 mb-2">Número de documento</h3>
            <p>{userInfo.documentNumber}</p>

            <h3 className="title is-6 mt-5 mb-2">Correo Electrónico</h3>
            <p>{userInfo.email}</p>

            <h3 className="title is-6 mt-5 mb-2">
              Dirección de correspondencia
            </h3>
            <p>{userInfo.address}</p>

            <h3 className="title is-6 mt-5 mb-2">Roles</h3>
            <p>{userInfo.roles}</p>
          </div>

          <div className="column">
            <h3 className="title is-6 mb-2">Género</h3>
            <p>{userInfo.gender}</p>

            <h3 className="title is-6 mt-5 mb-2">
              Fecha de expedición del documento
            </h3>
            <p>{userInfo.documentIssueDate}</p>

            <h3 className="title is-6 mt-5 mb-2">Teléfono</h3>
            <p>{userInfo.phone}</p>

            <h3 className="title is-6 mt-5 mb-2">Fecha de nacimiento</h3>
            <p>{userInfo.birthDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User_detail;
