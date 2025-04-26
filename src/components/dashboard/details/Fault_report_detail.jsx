import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Head from "../reusable/Head";
import { format } from "date-fns";
import { TbPointFilled } from "react-icons/tb";

const Fault_report_detail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dots, setDots] = useState("");

  useEffect(() => {
    getFaultReport();
  }, []);

  const getFaultReport = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND_MAINTENANCE +
          import.meta.env.VITE_ROUTE_BACKEND_REPORT +
          id +
          import.meta.env.VITE_ROUTE_BACKEND_REPORT_DETAIL
      );
      setData(response.data.data);
    } catch (error) {
      console.log("Error al obtener el reporte de fallo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const head_data = {
    title: "Detalles del Reporte de Fallo #" + id,
    description:
      "En esta sección, puedes visualizar la información del report de fallo seleccionado.",
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return format(date, "yyyy-MM-dd, hh:mm a").toLowerCase();
  };

  const toTitleCase = (str) => {
    if (typeof str !== "string") return str;
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
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
        <>
          <div className="rol-detail">
            <div className="is-flex is-justify-content-space-between is-align-items-center">
              <h3 className="title is-6 mb-0">Estado actual</h3>
              <span
                className={`button detail-status status-${data?.status_id}`}
              >
                <TbPointFilled />
                {data?.status}
              </span>
            </div>
            <div className="columns mt-0">
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
          <div className="rol-detail mt-4">
            <div className="columns">
              <div className="column">
                <h3 className="title is-6 mb-2">Fecha de revisión</h3>
                <p>{formatDateTime(data?.report_date)}</p>
              </div>
              <div className="column">
                <h3 className="title is-6 mb-2">Fecha de finalización</h3>
                <p>
                  {formatDateTime(data?.finalization_date) || "[Sin finalizar]"}
                </p>
              </div>
            </div>
          </div>
          <div className="property-detail mt-4">
            <div className="columns is-multiline">
              <div className="column rol-detail">
                <div className="level">
                  <h3 className="title is-6 margin-bottom">
                    Información por parte del Usuario
                  </h3>
                </div>
                <div className="columns is-multiline is-mobile">
                  <div className="column is-half column-p0">
                    <strong>Nombre</strong>
                  </div>
                  <div className="column is-half column-p0">
                    {toTitleCase(data?.owner_name) || "[]"}
                  </div>
                </div>
                <div className="columns is-multiline is-mobile">
                  <div className="column is-half column-p0">
                    <strong>Número de documento</strong>
                  </div>
                  <div className="column is-half column-p0">
                    {data?.owner_document || "[]"}
                  </div>
                </div>
                <div className="columns is-multiline is-mobile">
                  <div className="column is-half column-p0">
                    <strong>Fecha del reporte</strong>
                  </div>
                  <div className="column is-half column-p0">
                    {formatDateTime(data?.report_date) || "[]"}
                  </div>
                </div>
                <div className="columns is-multiline is-mobile">
                  <div className="column is-half column-p0">
                    <strong>Posible fallo</strong>
                  </div>
                  <div className="column is-half column-p0">
                    {data?.failure_type || "[]"}
                  </div>
                </div>
                <div className="columns is-multiline is-mobile">
                  <div className="column is-half column-p0">
                    <strong>Observaciones</strong>
                  </div>
                  <div className="column is-half">
                    {data?.description_failure || "[]"}
                  </div>
                </div>
              </div>
              <div className="mr-2 ml-2"></div>
              <div className="column rol-detail">
                <div className="level">
                  <h3 className="title is-6 margin-bottom">
                    Información por parte del Técnico
                  </h3>
                </div>
                <div className="columns is-multiline is-mobile">
                  <div className="column is-half column-p0">
                    <strong>Nombre</strong>
                  </div>
                  <div className="column is-half column-p0">
                    {toTitleCase(data?.technician_name) || "[Sin finalizar]"}
                  </div>
                </div>
                <div className="columns is-multiline is-mobile">
                  <div className="column is-half column-p0">
                    <strong>Número de documento</strong>
                  </div>
                  <div className="column is-half column-p0">
                    {data?.technician_document || "[Sin finalizar]"}
                  </div>
                </div>
                <div className="columns is-multiline is-mobile">
                  <div className="column is-half column-p0">
                    <strong>Tipo de mantenimiento</strong>
                  </div>
                  <div className="column is-half column-p0">
                    {data?.type_maintenance || "[Sin finalizar]"}
                  </div>
                </div>
                <div className="columns is-multiline is-mobile">
                  <div className="column is-half column-p0">
                    <strong>Fallo detectado</strong>
                  </div>
                  <div className="column is-half column-p0">
                    {data?.fault_remarks || "[Sin finalizar]"}
                  </div>
                </div>
                <div className="columns is-multiline is-mobile">
                  <div className="column is-half column-p0">
                    <strong>Observaciones del fallo</strong>
                  </div>
                  <div className="column is-half column-p0">
                    {data?.fault_remarks || "[Sin finalizar]"}
                  </div>
                </div>
                <div className="columns is-multiline is-mobile">
                  <div className="column is-half column-p0">
                    <strong>Evidencia del fallo</strong>
                  </div>
                  <div className="column is-half column-p0">
                    {data?.evidence_failure_url || "[Sin finalizar]"}
                  </div>
                </div>
                <div className="columns is-multiline is-mobile">
                  <div className="column is-half column-p0">
                    <strong>Solución</strong>
                  </div>
                  <div className="column is-half column-p0">
                    {data?.solution_name || "[Sin finalizar]"}
                  </div>
                </div>
                <div className="columns is-multiline is-mobile">
                  <div className="column is-half column-p0">
                    <strong>Descripción de la solución</strong>
                  </div>
                  <div className="column is-half column-p0">
                    {data?.solution_remarks || "[Sin finalizar]"}
                  </div>
                </div>
                <div className="columns is-multiline is-mobile">
                  <div className="column is-half column-p0">
                    <strong>Evidencia de la solución</strong>
                  </div>
                  <div className="column is-half">
                    {data?.evidence_solution_url || "[Sin finalizar]"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Fault_report_detail;
