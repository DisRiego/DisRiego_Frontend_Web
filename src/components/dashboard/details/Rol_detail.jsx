import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Head from "../reusable/Head";
import { TbPointFilled } from "react-icons/tb";

const Rol_detail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    getRol();
  }, []);

  const getRol = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND +
          import.meta.env.VITE_ROUTE_BACKEND_ROL +
          id
      );
      setData(response.data.data[0]);
    } catch (error) {
      console.log("Error al obtener rol:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const head_data = {
    title: "Ver Detalles del Rol #" + id,
    description:
      "En esta sección, puedes visualizar la información del rol seleccionado.",
  };

  // Agrupar permisos por categoría
  const permisosPorCategoria = data?.permissions?.reduce((acc, permiso) => {
    if (!acc[permiso.category]) {
      acc[permiso.category] = [];
    }
    acc[permiso.category].push(permiso.name);
    return acc;
  }, {});

  return (
    <div>
      <Head className="mb-3" head_data={head_data} />

      {isLoading ? (
        <div className="rol-detail">
          <div className="loader-cell">
            <div className="loader cont-loader"></div>
            <p className="loader-text">Cargando información{dots}</p>
          </div>
        </div>
      ) : (
        <>
          {/* Información del rol */}
          <div className="rol-detail">
            <div className="is-flex is-justify-content-space-between is-align-items-center">
              <h3 className="title is-6">Estado actual</h3>
              <span className={`button detail-status status-${data.status}`}>
                <TbPointFilled />
                {data?.status === 1 ? "Operativo" : "Inactivo"}
              </span>
            </div>
            <div className="columns">
              <div className="column">
                <h3 className="title is-6 mb-2">Nombre del rol</h3>
                <p>{data?.name}</p>
              </div>
              <div className="column">
                <h3 className="title is-6 mb-2">Descripción</h3>
                <p>{data?.description}</p>
              </div>
            </div>
          </div>

          {/* Permisos */}
          {permisosPorCategoria &&
          Object.keys(permisosPorCategoria).length > 0 ? (
            Object.entries(permisosPorCategoria).map(
              ([categoria, permisos], index) => (
                <div key={index} className="rol-detail">
                  <h3 className="title is-6">
                    Permisos del Módulo de {categoria}
                  </h3>
                  <div className="columns is-multiline">
                    {permisos.map((permiso, idx) => (
                      <div
                        className="column is-one-quarter-desktop is-half-tablet is-full-mobile pt-0"
                        key={idx}
                      >
                        <ul>
                          <li>- {permiso}</li>
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )
          ) : (
            <p>No hay permisos asignados.</p>
          )}
        </>
      )}
    </div>
  );
};

export default Rol_detail;
