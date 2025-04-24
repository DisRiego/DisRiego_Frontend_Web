import { useEffect, useState } from "react";
import axios from "axios";
import useUserPermissions from "../../hooks/useUserPermissions";
import Head from "./reusable/Head";
import Tab from "./reusable/Tab";
import Search from "./reusable/Search";
import Filter from "./reusable/Filter";
import Table from "./reusable/Table";
import Pagination from "./reusable/Pagination";
import Filter_request from "./filters/Filter_request";
import Form_request_reject from "./forms/adds/Form_request_reject";
import Change_status_request from "./Status/Change_status_request";
import Message from "../Message";
import { format } from "date-fns";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import Icon from "../../assets/icons/Disriego_title.png";
import RobotoNormalFont from "../../assets/fonts/Roboto-Regular.ttf";
import RobotoBoldFont from "../../assets/fonts/Roboto-Bold.ttf";

const Request = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [loadingTable, setLoadingTable] = useState(false);
  const [id, setId] = useState(null);

  const {
    permissions: permissionsUser,
    token,
    decodedToken,
  } = useUserPermissions();
  const hasPermission = (permission) => permissionsUser.includes(permission);

  const [showFilter, setShowFilter] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [backupData, setBackupData] = useState([]);
  const [statusFilter, setStatusFilter] = useState(false);
  const [filters, setFilters] = useState({
    estados: {},
    tiposApertura: {},
  });

  const [title, setTitle] = useState();
  const [typeForm, setTypeForm] = useState();
  const [showChangeStatus, setShowChangeStatus] = useState(false);
  const [showFormReject, setShowFormReject] = useState(false);
  const [confirMessage, setConfirMessage] = useState();
  const [loading, setLoading] = useState("");
  const [loadingReport, setLoadingReport] = useState("");

  const [showMessage, setShowMessage] = useState(false);
  const [titleMessage, setTitleMessage] = useState(false);
  const [message, setMessage] = useState(false);
  const [status, setStatus] = useState(false);

  const head_data_request = {
    title: "Solicitudes",
    description:
      "En esta sección puedes gestionar las solicitudes generadas por la plataforma.",
    buttons: {
      ...(hasPermission("Descargar reportes de todas las solicitudes") && {
        button1: {
          icon: "LuDownload",
          class: "",
          text: "Descargar reporte",
        },
      }),
    },
  };

  const handleButtonClick = (buttonText) => {
    if (buttonText === "Descargar reporte") {
      setLoadingReport("is-loading");
      generateReport(filteredData, formatDateTime, () => setLoadingReport(""));
    }
  };

  const tabs = [
    hasPermission("Ver notificaciones") && {
      key: "notification",
      label: "Notificaciones",
      path: "/dashboard/notification",
    },
    (hasPermission("Ver todas las solicitudes") ||
      hasPermission("Ver todas las solicitudes de un usuario")) && {
      key: "request",
      label: "Solicitudes",
      path: "/dashboard/request",
    },
  ].filter(Boolean);

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  useEffect(() => {
    if (token && hasPermission("Ver todas las solicitudes")) {
      getRequest();
    } else {
      if (token && hasPermission("Ver todas las solicitudes de un usuario")) {
        getRequestUser();
      }
    }
  }, [token, permissionsUser]);

  const getRequest = async () => {
    try {
      setLoadingTable(true);
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND_IOT +
          import.meta.env.VITE_ROUTE_BACKEND_REQUEST
      );

      const sortedData = response.data.data.sort(
        (a, b) => new Date(b.request_date) - new Date(a.request_date)
      );

      setData(sortedData);

      // setButtonDisabled(false);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    } finally {
      setLoadingTable(false);
    }
  };

  const getRequestUser = async () => {
    try {
      setLoadingTable(true);
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND_IOT +
          import.meta.env.VITE_ROUTE_BACKEND_REQUEST_BY_USER +
          decodedToken.id
      );

      const sortedData = response.data.data.sort(
        (a, b) => new Date(b.request_date) - new Date(a.request_date)
      );

      setData(sortedData);

      // setButtonDisabled(false);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    } finally {
      setLoadingTable(false);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return format(date, "yyyy-MM-dd, hh:mm a").toLowerCase();
  };

  useEffect(() => {
    if (!statusFilter) {
      const filtered = data
        .filter((info) =>
          Object.values(info)
            .join(" ")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
        .map((info) => ({
          ID: info.id,
          "ID de la solicitud": info.id,
          "ID del lote": info.lot_id,
          "ID de la válvula": info.device_iot_id,
          "Número de documento": info.owner_document_number,
          "Tipo de solicitud": info.request_type_name,
          "Fecha de apertura": formatDateTime(info.open_date),
          "Fecha de cierre": formatDateTime(info.close_date),
          "Fecha de creación de la solicitud": formatDateTime(
            info.request_date
          ),

          Estado: info.status_name,
        }));
      setFilteredData(filtered);
      setBackupData(filtered);
    } else {
      const selectedStates = Object.keys(filters.estados).filter(
        (key) => filters.estados[key]
      );

      if (selectedStates.length > 0) {
        const filteredByState = backupData.filter((info) =>
          selectedStates.includes(info.Estado)
        );
        setFilteredData(filteredByState);
      } else {
        setFilteredData(backupData);
      }

      setStatusFilter(false);
    }
  }, [data, searchTerm, filters.estados]);

  const updateData = async () => {
    getRequest();
  };

  const handleFilterClick = () => {
    setShowFilter(true);
  };

  const columns = [
    "ID de la solicitud",
    "ID del lote",
    "ID de la válvula",
    "Número de documento",
    "Tipo de solicitud",
    "Fecha de apertura",
    "Fecha de cierre",
    "Fecha de creación de la solicitud",
    "Estado",
    "Opciones",
  ];

  const options = [
    hasPermission("Ver detalles de una solicitud") && {
      icon: "BiShow",
      name: "Ver detalles",
    },
    hasPermission("Aprobar solicitud") && {
      icon: "MdDownloadDone",
      name: "Aprobar",
    },
    hasPermission("Denegar solicitud") && {
      icon: "VscError",
      name: "Denegar",
    },
  ].filter(Boolean);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const toTitleCase = (str) => {
    if (typeof str !== "string") return str; // Evita errores con números u otros tipos
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  return (
    <>
      <Head
        head_data={head_data_request}
        loading={loadingReport}
        onButtonClick={handleButtonClick}
      />
      <Tab tabs={tabs} useLinks={true}></Tab>
      <div className="container-search">
        <Search
          onSearch={setSearchTerm}
          // buttonDisabled={buttonDisabled}
        />
        <Filter
          onFilterClick={handleFilterClick}
          data={data}
          // buttonDisabled={buttonDisabled}
        />
      </div>
      <Table
        columns={columns}
        data={paginatedData}
        options={options}
        loadingTable={loadingTable}
        setId={setId}
        setTitle={setTitle}
        setShowChangeStatus={setShowChangeStatus}
        setShowFormReject={setShowFormReject}
        setConfirMessage={setConfirMessage}
        setTypeForm={setTypeForm}
      ></Table>
      <Pagination
        totalItems={filteredData.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
      {showFilter && (
        <>
          <Filter_request
            onClose={() => setShowFilter(false)}
            data={data}
            filteredData={filteredData}
            setFilteredData={setFilteredData}
            setStatusFilter={setStatusFilter}
            filters={filters}
            setFilters={setFilters}
            backupData={backupData}
          />
        </>
      )}
      {showFormReject && (
        <>
          <Form_request_reject
            title={title}
            onClose={() => setShowFormReject(false)}
            setShowMessage={setShowMessage}
            setTitleMessage={setTitleMessage}
            setMessage={setMessage}
            setStatus={setStatus}
            updateData={updateData}
            id={id}
            loading={loading}
            setLoading={setLoading}
          />
        </>
      )}
      {showChangeStatus && (
        <Change_status_request
          onClose={() => setShowChangeStatus(false)}
          onSuccess={() => setShowChangeStatus(false)}
          id={id}
          confirMessage={confirMessage}
          setShowMessage={setShowMessage}
          setTitleMessage={setTitleMessage}
          setMessage={setMessage}
          setStatus={setStatus}
          updateData={updateData}
          typeForm={typeForm}
          loading={loading}
          setLoading={setLoading}
        />
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

export default Request;

const generateReport = (filteredData, formatDateTime, onFinish) => {
  const doc = new jsPDF("landscape");
  const sortedById = [...filteredData].sort((a, b) => a.ID - b.ID);

  // Add Roboto font to the document
  doc.addFont(RobotoNormalFont, "Roboto", "normal");
  doc.addFont(RobotoBoldFont, "Roboto", "bold");

  //colorear fondo
  doc.setFillColor(243, 242, 247);
  doc.rect(0, 0, 300, 53, "F"); // Colorear una parte de la página
  // agregar logo (usando base 64 directamente sobre la importacion)

  doc.addImage(Icon, "PNG", 246, 10, 39, 11);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(17);
  doc.setFont("Roboto", "bold");
  doc.text("REPORTE DE SOLICITUDES", 12, 18);
  doc.setFontSize(11);
  doc.text(`Fecha de generación:`, 12, 27);
  doc.text(`Generado por:`, 12, 39);
  /*doc.setTextColor(94, 100, 112);*/
  doc.text("Solicitudes actuales en el sistema", 12, 63);

  doc.setTextColor(94, 100, 112);
  doc.setFont("Roboto", "normal");
  doc.setFontSize(10);
  doc.text(`${new Date().toLocaleString()}`, 12, 32);
  doc.text(`[Nombre del usuario]`, 12, 44);
  doc.setFontSize(11);
  doc.text(`[Dirección de la empresa]`, 285, 27, { align: "right" });
  doc.text(`[Ciudad, Dept. País]`, 285, 33, { align: "right" });
  doc.text(`[Teléfono]`, 285, 39, { align: "right" });
  doc.text(`Cantidad de dispositivos: ${filteredData.length}`, 12, 68);

  console.log(filteredData);

  // Agregar tabla con autoTable
  autoTable(doc, {
    startY: 80,
    margin: { left: 12 },
    head: [
      [
        "ID de la solicitud",
        "ID del lote",
        "ID de la válvula",
        "Número de documento",
        "Tipo de solicitud",
        "Fecha de apertura",
        "Fecha de cierre",
        "Fecha de creación de la solicitud",
        "Estado",
      ],
    ],
    body: sortedById.map((resquest) => [
      resquest["ID de la solicitud"],
      resquest["ID del lote"],
      resquest["ID de la válvula"],
      resquest["Número de documento"],
      resquest["Tipo de solicitud"],
      resquest["Fecha de apertura"],
      resquest["Fecha de cierre"],
      resquest["Fecha de creación de la solicitud"],
      resquest["Estado"],
    ]),

    theme: "grid",
    headStyles: {
      fillColor: [252, 252, 253],
      textColor: [0, 0, 0],
      fontStyle: "bold",
      lineColor: [234, 236, 240],
      lineWidth: 0.5,
      font: "Roboto", // Add Roboto font to table headers
    },
    bodyStyles: {
      textColor: [89, 89, 89],
      font: "Roboto", // Add Roboto font to table body
    },
    styles: {
      fontSize: 10,
      cellPadding: 3,
      lineColor: [234, 236, 240],
    },
  });

  doc.addImage(Icon, "PNG", 12, 190, 32, 9);

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
