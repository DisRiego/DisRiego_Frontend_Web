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
                <h3 className="title is-6 mb-3">Información del predio</h3>
                <p>
                  <strong>ID del Predio: </strong>
                  {data?.property_id}
                </p>
                <p>
                  <strong>Nombre del Predio: </strong>
                  {data?.property_name}
                </p>
                <p>
                  <strong>Ubicación (latitud, longitud): </strong>
                  {data?.property_latitude}, {data?.property_longitude}
                </p>
              </div>
              <div className="column">
                <h3 className="title is-6 mb-3">Información del lote</h3>
                <p>
                  <strong>ID del lote: </strong>
                  {data?.lot_id}
                </p>
                <p>
                  <strong>Nombre del lote: </strong>
                  {data?.lot_name}
                </p>
                <p>
                  <strong>Ubicación (latitud, longitud): </strong>
                  {data?.lot_latitude}, {data?.lot_longitude}
                </p>
              </div>
            </div>
          </div>
          <div className="rol-detail mt-4">
            <div className="level">
              <h3 className="title is-6 margin-bottom">
                Información del dueño
              </h3>
            </div>
            <div className="columns">
              <div className="column column-p0">
                <h3 className="title is-6 mb-1">Nombres</h3>
                <p>{toTitleCase(data?.owner_name) || "[]"}</p>
              </div>
              <div className="column column-p0">
                <h3 className="title is-6 mb-1">Número de documento</h3>
                <p>{data?.owner_document || "[]"}</p>
              </div>
            </div>
            <div className="columns">
              <div className="column">
                <h3 className="title is-6 mb-1">Correo Eléctronico</h3>
                <p>{data?.owner_email || "[]"}</p>
              </div>
              <div className="column">
                <h3 className="title is-6 mb-1">Número de celular</h3>
                <p>{data?.owner_phone || "[]"}</p>
              </div>
            </div>
          </div>
          <div className="rol-detail mt-4">
            <div className="level">
              <h3 className="title is-6 margin-bottom">
                Información del fallo reportado
              </h3>
            </div>

            <div className="columns">
              <div className="column column-p0">
                <strong>Posible de fallo</strong>
                <p>{data?.failure_type_report || "[]"}</p>
              </div>
              <div className="column column-p0">
                <strong>Fecha de generación del reporte</strong>
                <p> {formatDateTime(data?.report_date) || "[]"}</p>
              </div>
            </div>
            <div className="columns">
              <div className="column column-p0">
                <strong>Observaciones</strong>
                <p>{data?.description_failure || "[]"}</p>
              </div>
            </div>
            {data?.assignment_date && (
              <div className="columns">
                <div className="column">
                  <h3 className="title is-6 mb-1">
                    Fecha programada de revisión
                  </h3>
                  <p className="mb-0">
                    {formatDateTime(data?.assignment_date) ||
                      "[Sin fecha programada de revisión]"}
                  </p>
                </div>
                {data?.technician_name && (
                  <div className="column">
                    <strong>Nombre del técnico</strong>
                    <p>{toTitleCase(data?.technician_name) || "[]"}</p>
                  </div>
                )}
              </div>
            )}
          </div>
          {data?.fault_remarks && (
            <div className="rol-detail mt-4">
              <div className="level">
                <h3 className="title is-6 margin-bottom">
                  Información del fallo encontrado por el técnico
                </h3>
              </div>

              <div className="columns">
                <div className="column column-p0">
                  <strong>Tipo de fallo</strong>
                  <p>{data?.failure_type_detail || "[]"}</p>
                </div>
                {data?.evidence_failure_url && (
                  <div className="column column-p0">
                    <h3 className="title is-6 mb-1">Evidencia del fallo</h3>
                    <a
                      href={data?.evidence_failure_url}
                      target="_blank"
                      className="mb-0"
                    >
                      img_fallo_1
                    </a>
                  </div>
                )}
              </div>
              <div className="columns">
                <div className="column column-p0">
                  <strong>Observaciones</strong>
                  <p>{data?.fault_remarks || "[]"}</p>
                </div>
              </div>
            </div>
          )}
          {data?.fault_remarks && (
            <div className="rol-detail mt-4">
              <div className="level">
                <h3 className="title is-6 margin-bottom">
                  Información de la solución realizada por el técnico
                </h3>
              </div>
              <div className="columns">
                <div className="column column-p0">
                  <strong>Tipo de mantenimiento</strong>
                  <p>{data?.type_maintenance_name || "[]"}</p>
                </div>
                <div className="column column-p0">
                  <strong>Tipo de solución</strong>
                  <p>{data?.solution_name || "[]"}</p>
                </div>
              </div>
              <div className="columns">
                <div className="column column-p0">
                  <h3 className="title is-6 mb-1">Evidencia de la solución</h3>
                  <a
                    href={data?.evidence_solution_url}
                    target="_blank"
                    className="mb-0"
                  >
                    img_solución_1
                  </a>
                </div>
                <div className="column column-p0">
                  <h3 className="title is-6 mb-1">Fecha de finalización</h3>
                  <p className="mb-0">
                    {formatDateTime(data?.finalization_date) ||
                      "[Sin fecha de finalización]"}
                  </p>
                </div>
              </div>
              <div className="columns">
                <div className="column">
                  <strong>Observaciones</strong>
                  <p>{data?.solution_remarks || "[]"}</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Fault_report_detail;
