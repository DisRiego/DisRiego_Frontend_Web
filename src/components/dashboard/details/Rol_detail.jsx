import { useParams } from "react-router-dom";
import Head from "../Head";
import { TbPointFilled } from "react-icons/tb";

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
            className={`button detail-status ${
              rolInfo.status === "Operativo" ? "is-success" : "is-danger"
            }`}
          >
            <TbPointFilled />
            {rolInfo.status}
          </span>
        </div>
        <div className="columns">
          <div className="column">
            <h3 className="title is-6 mb-2">Nombre del rol</h3>
            <p>{rolInfo.name}</p>
          </div>
          <div className="column">
            <h3 className="title is-6 mb-2">Descripción</h3>
            <p>{rolInfo.description}</p>
          </div>
        </div>
      </div>

      {/* Permisos */}
      {rolInfo.permisos && rolInfo.permisos.length > 0 ? (
        rolInfo.permisos.map((modulo, index) => {
          // Crear un array de tres columnas vacías
          const columnas = [[], [], []];

          // Distribuir los permisos en las tres columnas de manera intercalada
          modulo.permisos.forEach((permiso, i) => {
            columnas[i % 3].push(permiso);
          });

          return (
            <div key={index} className="rol-detail">
              <h3 className="title is-6">
                Permisos{" "}
                <span className="has-text-grey-light">
                  (Módulo {modulo.nombre})
                </span>
              </h3>
              <div className="columns">
                {columnas.map((columna, colIndex) => (
                  <div className="column pt-0" key={colIndex}>
                    <ul>
                      {columna.map((permiso, idx) => (
                        <li key={idx}>*{permiso}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      ) : (
        <p>No hay permisos asignados.</p>
      )}
    </div>
  );
};

export default Rol_detail;
