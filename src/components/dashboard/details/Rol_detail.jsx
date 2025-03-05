import { useParams } from "react-router-dom";
import Head from "../Head";

const Rol_detail = ({ role }) => {
  const { id } = useParams();

  const head_data = {
    title: "Ver Detalles del Rol #" + id,
    description:
      "En esta sección, puedes viosualizar la información del rol seleccionado.",
  };

  const roleData = {
    id: 101,
    name: "Administrador",
    description: "Tiene acceso total a la plataforma.",
    status: "Operativo",
    permisos: [
      {
        nombre: "gestión de usuarios",
        permisos: ["Crear usuario", "Editar usuario", "Eliminar usuario"],
      },
      {
        nombre: "gestión de roles",
        permisos: ["Crear rol", "Editar rol", "Asignar permisos"],
      },
    ],
  };

  const rolInfo = role || roleData;

  return (
    <div className="">
      <Head className="mb-3" head_data={head_data} />

      {/* Información del rol */}
      <div className="rol-detail ">
        <div className="is-flex is-justify-content-space-between is-align-items-center">
          <h3 className="title is-6">Estado actual</h3>
          <span
            className={`tag ${
              rolInfo.status === "Operativo" ? "is-success" : "is-danger"
            }`}
          >
            {rolInfo.status}
          </span>
        </div>
        <h3 className="title is-6">Nombre del rol</h3>
        <p>{rolInfo.name}</p>
        <h3 className="title is-6 mt-3">Descripción</h3>
        <p>{rolInfo.description}</p>
      </div>

      {/* Permisos */}
      {rolInfo.permisos && rolInfo.permisos.length > 0 ? (
        rolInfo.permisos.map((modulo, index) => (
          <div key={index} className="rol-detail ">
            <h3 className="title is-6">
              Permisos{" "}
              <span className="has-text-grey-light">
                (Módulo {modulo.nombre})
              </span>
            </h3>
            <ul>
              {modulo.permisos.map((permiso, idx) => (
                <li key={idx}> - {permiso}</li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>No hay permisos asignados.</p>
      )}
    </div>
  );
};

export default Rol_detail;
