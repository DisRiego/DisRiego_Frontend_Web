import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Head from "../Head";
import { TbPointFilled } from "react-icons/tb";

const Iot_detail = () => {
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
    getDevice();
  }, []);

  const getDevice = async () => {
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
    title: "Detalles del Dispositivo #" + id,
    description: `En esta sección, puedes consultar la información del "" seleccionado.`,
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
                <h3 className="title is-6 mb-2">Información del predio</h3>
                <p>{data?.name}</p>
              </div>
              <div className="column">
                <h3 className="title is-6 mb-2">Información del lote</h3>
                <p>{data?.description}</p>
              </div>
            </div>
          </div>
          <div className="rol-detail">
            <div className="columns">
              <div className="column">
                <h3 className="title is-6 mb-2">Número de serie</h3>
                <p>{data?.name}</p>
              </div>
              <div className="column">
                <h3 className="title is-6 mb-2">Modelo</h3>
                <p>{data?.description}</p>
              </div>
            </div>
            <div className="columns">
              <div className="column">
                <h3 className="title is-6 mb-2">Fecha de instalación</h3>
                <p>{data?.name}</p>
              </div>
              <div className="column">
                <h3 className="title is-6 mb-2">
                  Fecha estimada de mantenimiento
                </h3>
                <p>{data?.description}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Iot_detail;
