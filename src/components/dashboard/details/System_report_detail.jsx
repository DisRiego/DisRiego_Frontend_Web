import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import useUserPermissions from "../../../hooks/useUserPermissions";
import Head from "../reusable/Head";
import Message from "../../Message";
import { format } from "date-fns";
import { TbPointFilled } from "react-icons/tb";
import { jsPDF } from "jspdf";
import Icon from "../../../assets/icons/Disriego_title.png";
import { autoTable } from "jspdf-autotable";
import RobotoNormalFont from "../../../assets/fonts/Roboto-Regular.ttf";
import RobotoBoldFont from "../../../assets/fonts/Roboto-Bold.ttf";

const System_report_detail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dots, setDots] = useState("");
  const [loadingReport, setLoadingReport] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const {
    permissions: permissionsUser,
    token,
    decodedToken,
  } = useUserPermissions();
  const hasPermission = (permission) => permissionsUser.includes(permission);

  const api_key = import.meta.env.VITE_API_KEY;
  const [showMessage, setShowMessage] = useState(false);
  const [titleMessage, setTitleMessage] = useState(false);
  const [message, setMessage] = useState(false);
  const [status, setStatus] = useState(false);

  const handleButtonClick = async (buttonText) => {
    if (buttonText === "Descargar reporte") {
      try {
        setLoadingReport("is-loading");

        // 1. Obtener datos de empresa y ubicación
        const response = await axios.get(
          import.meta.env.VITE_URI_BACKEND +
            import.meta.env.VITE_ROUTE_BACKEND_COMPANY
        );
        const companyData = response.data.data;

        const locationData = await fetchLocationNames(
          companyData.country,
          companyData.state,
          companyData.city
        );

        const response_2 = await axios.get(
          import.meta.env.VITE_URI_BACKEND +
            import.meta.env.VITE_ROUTE_BACKEND_USERS +
            decodedToken.id
        );
        const userData = response_2.data.data[0];

        // 3. Generar reporte con los datos obtenidos
        generateReport(
          data,
          toTitleCase,
          () => setLoadingReport(""),
          companyData,
          locationData,
          userData,
          id
        );
      } catch (error) {
        setTitleMessage?.("Error al generar el reporte");
        setMessage?.(
          `No se pudo generar el reporte debido a un problema con el servidor.
          \n Por favor, Inténtelo de nuevo más tarde.`
        );
        setStatus?.("is-false");
        setShowMessage?.(true);
        setLoadingReport("");
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    getFaultReport();
  }, []);

  const getFaultReport = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND_MAINTENANCE +
          import.meta.env.VITE_ROUTE_BACKEND_SYSTEM_FAULT +
          id +
          import.meta.env.VITE_ROUTE_BACKEND_SYSTEM_DETAIL
      );
      setData(response.data.data);
    } catch (error) {
      console.log("Error al obtener el fallo autogenerado:", error);
    } finally {
      setIsLoading(false);
      setButtonDisabled(false);
    }
  };

  const head_data = {
    title: "Detalles del Fallo Autogenerado #" + id,
    description:
      "En esta sección, puedes visualizar la información del report de fallo seleccionado.",
    buttons: {
      ...(hasPermission("Descargar informe de un fallo autogenerado") && {
        button1: {
          icon: "LuDownload",
          class: "",
          text: "Descargar reporte",
        },
      }),
    },
  };

  const fetchLocationNames = async (countryCode, stateCode, cityId) => {
    try {
      const BASE_URL = "https://api.countrystatecity.in/v1";

      const [countryRes, stateRes, cityRes] = await Promise.all([
        axios.get(`${BASE_URL}/countries/${countryCode}`, {
          headers: { "X-CSCAPI-KEY": api_key },
        }),
        axios.get(`${BASE_URL}/countries/${countryCode}/states/${stateCode}`, {
          headers: { "X-CSCAPI-KEY": api_key },
        }),
        axios.get(
          `${BASE_URL}/countries/${countryCode}/states/${stateCode}/cities`,
          {
            headers: { "X-CSCAPI-KEY": api_key },
          }
        ),
      ]);

      const cityName =
        cityRes.data.find((city) => city.id === parseInt(cityId))?.name ||
        "Desconocido";

      return {
        country: countryRes.data.name,
        state: stateRes.data.name,
        city: cityName,
      };
    } catch (error) {
      console.error("Error al obtener nombres de ubicación:", error);
      return {
        country: "Desconocido",
        state: "Desconocido",
        city: "Desconocido",
      };
    }
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
      <Head
        head_data={head_data}
        onButtonClick={handleButtonClick}
        loading={loadingReport}
        buttonDisabled={buttonDisabled}
      />
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

export default System_report_detail;

const generateReport = (
  data,
  toTitleCase,
  onFinish,
  companyData,
  locationNames,
  userData,
  id
) => {
  const doc = new jsPDF();

  // Add Roboto font to the document
  doc.addFont(RobotoNormalFont, "Roboto", "normal");
  doc.addFont(RobotoBoldFont, "Roboto", "bold");

  //colorear fondo
  doc.setFillColor(243, 242, 247);
  doc.rect(0, 0, 210, 53, "F"); // colorear una parte de la pagina
  // agregar logo (usando base 64 directamente sobre la importacion)

  doc.addImage(Icon, "PNG", 156, 10, 39, 11);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(17);
  doc.setFont("Roboto", "bold");
  doc.text(`REPORTE DE FALLO #${id}`, 12, 18);
  doc.setFontSize(11);
  doc.text(`Fecha de generación:`, 12, 27);
  doc.text(`Generado por:`, 12, 39);
  /*doc.setTextColor(94, 100, 112);*/

  doc.setTextColor(94, 100, 112);
  doc.setFont("Roboto", "normal");
  doc.setFontSize(10);
  doc.text(`${new Date().toLocaleString()}`, 12, 32);
  doc.text(
    [userData?.name, userData?.first_last_name, userData?.second_last_name]
      .filter(Boolean) // Elimina null, undefined y strings vacíos
      .join(" "),
    12,
    44
  );
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont("Roboto", "bold");
  doc.text(`Dirección de la empresa:`, 194, 27, { align: "right" });
  doc.text(`Correo electrónico de la empresa:`, 194, 39, { align: "right" });

  doc.setTextColor(94, 100, 112);
  doc.setFont("Roboto", "normal");
  doc.setFontSize(10);
  doc.text(
    `${companyData.address}. ${locationNames.state}, ${locationNames.city}`,
    194,
    32,
    { align: "right" }
  );

  doc.text(`${companyData.email}`, 194, 44, { align: "right" });

  doc.addImage(Icon, "PNG", 12, 280, 32, 9);

  // Agregar numeración de páginas en el pie de página
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);

    doc.setFont("Roboto", "normal"); // Set Roboto font for page numbers
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.text(`Página ${i}/${pageCount}`, pageWidth - 10, pageHeight - 10, {
      align: "right",
    });
  }

  // Convertir el PDF a un Blob
  const pdfBlob = doc.output("blob");

  // Crear una URL del Blob
  const pdfUrl = URL.createObjectURL(pdfBlob);

  // Abrir el PDF en una nueva pestaña
  setTimeout(() => {
    window.open(pdfUrl, "_blank");
    onFinish();
  }, 500);
};
