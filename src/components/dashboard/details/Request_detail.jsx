import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Head from "../Head";
import { TbPointFilled } from "react-icons/tb";
import { format } from "date-fns";

const Request_detail = () => {
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
        import.meta.env.VITE_URI_BACKEND_IOT +
          import.meta.env.VITE_ROUTE_BACKEND_REQUEST +
          id
      );
      setData(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.log("Error al obtener rol:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const head_data = {
    title: "Ver Detalles de la Solicitud #" + id,
    description:
      "En esta sección, puedes consultar la información de la solicitud.",
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return format(date, "yyyy-MM-dd, hh:mm a").toLowerCase();
  };

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
                {data?.status_name ?? ""}
              </span>
            </div>
            <div className="columns">
              <div className="column">
                <h3 className="title is-6 mb-2">Información del predio</h3>
                <p>
                  <strong>ID del Predio: </strong>
                  {data?.property_id}
                </p>
                <p>
                  <strong>Nombre del Predio: </strong>
                  {data?.property_name}
                </p>
              </div>
              <div className="column">
                <h3 className="title is-6 mb-2">Información del lote</h3>
                <p>
                  <strong>ID del lote: </strong>
                  {data?.lot_id}
                </p>
                <p>
                  <strong>Nombre del lote: </strong>
                  {data?.lot_name}
                </p>
              </div>
            </div>
          </div>

          <div className="rol-detail">
            <div className="columns">
              <div className="column">
                <h3 className="title is-6 mb-2">ID de la válvula</h3>
                <p>{data?.device_iot_id ?? ""}</p>
              </div>
              <div className="column">
                <h3 className="title is-6 mb-2">Tipo de apertura</h3>
                <p>{data?.request_type_name ?? ""}</p>
              </div>
            </div>
            <div className="columns">
              <div className="column">
                <h3 className="title is-6 mb-2">Fecha de apertura</h3>
                <p>{formatDateTime(data?.open_date)}</p>
              </div>
              <div className="column">
                <h3 className="title is-6 mb-2">Fecha de cierre</h3>
                <p>{formatDateTime(data?.close_date)}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Request_detail;
