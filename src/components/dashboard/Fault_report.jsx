import { useState, useEffect } from "react";
import axios from "axios";
import useUserPermissions from "../../hooks/useUserPermissions";
import Head from "./reusable/Head";
import Tab from "./reusable/Tab";
import Search from "./reusable/Search";
import Filter from "./reusable/Filter";
import Table from "./reusable/Table";
import Pagination from "./reusable/Pagination";
import Form_report from "./forms/adds/Form_report";
import Form_assign_maintenance from "./forms/adds/Form_assign_maintenance";
import Form_finalize_maintenance from "./forms/adds/Form_finalize_maintenance";
import Filter_maintenance from "./filters/Filter_maintenance";
import Message from "../Message";
import { format, set } from "date-fns";
import { jsPDF } from "jspdf";
import Icon from "../../assets/icons/Disriego_title.png";
import { autoTable } from "jspdf-autotable";
import RobotoNormalFont from "../../assets/fonts/Roboto-Regular.ttf";
import RobotoBoldFont from "../../assets/fonts/Roboto-Bold.ttf";

const Fault_report = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState("");
  const [loadingTable, setLoadingTable] = useState(false);
  const [loadingReport, setLoadingReport] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const itemsPerPage = 5;

  const {
    permissions: permissionsUser,
    token,
    decodedToken,
  } = useUserPermissions();
  const hasPermission = (permission) => permissionsUser.includes(permission);

  const [filteredData, setFilteredData] = useState([]);
  const [backupData, setBackupData] = useState([]);
  const [statusFilter, setStatusFilter] = useState(false);
  const [filters, setFilters] = useState({
    typeFailure: {},
    nameTechnician: {},
    startDate: "",
    endDate: "",
    status: {},
  });

  const api_key = import.meta.env.VITE_API_KEY;
  const [title, setTitle] = useState();
  const [id, setId] = useState(null);
  const [idTechnician, setIdTechnician] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const [showFinalize, setShowFinalize] = useState(false);
  const [showEditFinalize, setShowEditFinalize] = useState(false);
  const [statusName, setStatusName] = useState(false);
  const [confirMessage, setConfirMessage] = useState();
  const [typeForm, setTypeForm] = useState();
  const [typeAction, setTypeAction] = useState("");
  const parentComponent = "report";

  const [showMessage, setShowMessage] = useState(false);
  const [titleMessage, setTitleMessage] = useState(false);
  const [message, setMessage] = useState(false);
  const [status, setStatus] = useState(false);
  const [isTechnician, setIsTechnician] = useState(false);

  const handleButtonClick = async (buttonText) => {
    if (buttonText === "Reportar fallo") {
      setTitle("Generar reporte de fallo");
      setShowForm(true);
    }

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
          filteredData,
          toTitleCase,
          () => setLoadingReport(""),
          companyData,
          locationData,
          userData,
          isTechnician
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

  const head_data = {
    title: "Gestión de mantenimiento",
    description:
      "En esta sección puedes visualizar y generar reportes de fallos.",
    buttons: {
      ...((hasPermission("Crear un reporte de fallo") ||
        hasPermission("Crear un reporte de fallo por un usuario")) && {
        button1: {
          icon: "FaPlus",
          class: "color-hover",
          text: "Reportar fallo",
        },
      }),
      ...(hasPermission("Descargar informe de todos los reportes de fallo") && {
        button2: {
          icon: "LuDownload",
          class: "",
          text: "Descargar reporte",
        },
      }),
    },
  };

  const tabs = [
    {
      key: "system",
      label: "Fallos autogenerados",
      path: "/dashboard/system",
    },
    {
      key: "report",
      label: "Reporte de fallos",
      path: "/dashboard/report",
    },
  ];

  let columns = [];
  if (hasPermission("Ver todos los reportes de fallo")) {
    columns = [
      "ID",
      "ID del reporte",
      "ID del predio",
      "ID del lote",
      "Número de documento",
      "Tipo de fallo",
      "Técnico responsable",
      "Fecha de generación del reporte",
      "Estado",
      "Opciones",
    ];
  } else if (
    hasPermission("Ver todos los reportes de fallos asignados a un técnico")
  ) {
    columns = [
      "ID",
      "ID del reporte",
      "ID del predio",
      "ID del lote",
      "Número de documento",
      "Tipo de fallo",
      "Fecha de generación del reporte",
      "Estado",
      "Opciones",
    ];
  } else if (
    hasPermission("Ver todos los reportes de fallos para un usuario")
  ) {
    columns = [
      "ID",
      "ID del reporte",
      "Nombre del predio",
      "Nombre del lote",
      "Posible fallo",
      "Fecha de generación del reporte",
      "Estado",
      "Opciones",
    ];
  }

  useEffect(() => {
    if (token && hasPermission("Ver todos los reportes de fallo")) {
      fetchFaultReport();
    } else {
      if (
        token &&
        hasPermission("Ver todos los reportes de fallos asignados a un técnico")
      ) {
        fetchFaultTechnician();
      } else {
        if (
          token &&
          hasPermission("Ver todos los reportes de fallos para un usuario")
        ) {
          fetchFaultUser();
        }
      }
    }
  }, [token, permissionsUser]);

  const fetchFaultReport = async () => {
    try {
      setLoadingTable(true);
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND_MAINTENANCE +
          import.meta.env.VITE_ROUTE_BACKEND_REPORT
      );
      const sortedData = response.data.data.sort((a, b) => b.id - a.id);

      setData(sortedData);
    } catch (error) {
      console.error("Error al obtener los reportes de fallos:", error);
    } finally {
      setButtonDisabled(false);
      setLoadingTable(false);
    }
  };

  const fetchFaultTechnician = async () => {
    try {
      setLoadingTable(true);
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND_MAINTENANCE +
          import.meta.env.VITE_ROUTE_BACKEND_REPORT_TECHNICIAN +
          decodedToken.id +
          import.meta.env.VITE_ROUTE_BACKEND_REPORT_BY_USERS
      );
      const sortedData = response.data.data.sort((a, b) => b.id - a.id);

      setData(sortedData);
      setIsTechnician(true);
    } catch (error) {
      console.error(
        "Error al obtener los reportes de fallos de un usuario:",
        error
      );
    } finally {
      setButtonDisabled(false);
      setLoadingTable(false);
    }
  };

  const fetchFaultUser = async () => {
    try {
      setLoadingTable(true);
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND_MAINTENANCE +
          import.meta.env.VITE_ROUTE_BACKEND_REPORT_USER +
          decodedToken.id +
          import.meta.env.VITE_ROUTE_BACKEND_REPORT_BY_USERS
      );
      const sortedData = response.data.data.sort((a, b) => b.id - a.id);

      setData(sortedData);
    } catch (error) {
      console.error(
        "Error al obtener los reportes de fallos de un usuario:",
        error
      );
    } finally {
      setButtonDisabled(false);
      setLoadingTable(false);
    }
  };

  const updateData = async () => {
    fetchFaultReport();
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return format(date, "yyyy-MM-dd, hh:mm a").toLowerCase();
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

  const toTitleCase = (str) => {
    if (typeof str !== "string") return str;
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
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
        .map((info) => {
          if (hasPermission("Ver todos los reportes de fallo")) {
            return {
              ID: info.id,
              "ID del reporte": info.id,
              "ID del predio": info.property_id,
              "ID del lote": info.lot_id,
              "Número de documento": info.owner_document,
              "Tipo de fallo": info.failure_type,
              "Técnico responsable": toTitleCase(info.technician_name),
              "ID del responsable": info.technician_id,
              "Fecha de generación del reporte": formatDateTime(info.date),
              Estado: info.status,
            };
          } else if (
            hasPermission(
              "Ver todos los reportes de fallos asignados a un técnico"
            )
          ) {
            return {
              ID: info.report_id,
              "ID del reporte": info.report_id,
              "ID del predio": info.property_id,
              "ID del lote": info.lot_id,
              "Número de documento": info.owner_document,
              "Tipo de fallo": info.failure_type,
              "Fecha de generación del reporte": formatDateTime(
                info.report_date
              ),
              Estado: info.status,
            };
          } else {
            return {
              ID: info.report_id,
              "ID del reporte": info.report_id,
              "Nombre del predio": info.property_name,
              "Nombre del lote": info.lot_name,
              "Posible fallo": info.failure_type,
              "Fecha de generación del reporte": formatDateTime(
                info.report_date
              ),
              Estado: info.status,
            };
          }
        });
      setFilteredData(filtered);
      setBackupData(filtered);
    } else {
      const selectedStates = Object.keys(filters.status).filter(
        (key) => filters.status[key]
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
  }, [data, searchTerm, filters.status]);

  const handleFilterClick = () => {
    setShowFilter(true);
  };

  const options = [
    (hasPermission("Ver detalles de un reporte de fallo") ||
      hasPermission("Ver detalles de un reporte de fallo para un usuario")) && {
      icon: "BiShow",
      name: "Ver detalles",
    },
    hasPermission("Editar reporte") && {
      icon: "LuUserSearch",
      name: "Editar reporte",
    },
    hasPermission("Asignar responsable") && {
      icon: "TbUserPlus",
      name: "Asignar responsable",
    },
    hasPermission("Editar asignación") && {
      icon: "LuUserSearch",
      name: "Editar responsable",
    },
    hasPermission("Finalizar mantenimiento") && {
      icon: "BiEditAlt",
      name: "Finalizar mantenimiento",
    },
    hasPermission("Editar mantenimiento") && {
      icon: "BiEditAlt",
      name: "Editar mantenimiento",
    },
  ].filter(Boolean);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  return (
    <>
      <Head
        head_data={head_data}
        onButtonClick={handleButtonClick}
        loading={loadingReport}
        buttonDisabled={buttonDisabled}
      />
      <Tab tabs={tabs} useLinks={true}></Tab>
      <div className="container-search">
        <Search onSearch={setSearchTerm} buttonDisabled={buttonDisabled} />
        <Filter
          onFilterClick={handleFilterClick}
          buttonDisabled={buttonDisabled}
        />
      </div>
      <Table
        columns={columns}
        data={paginatedData}
        options={options}
        loadingTable={loadingTable}
        setId={setId}
        setIdTechnician={setIdTechnician}
        setStatusName={setStatusName}
        setTitle={setTitle}
        setShowEdit={setShowEdit}
        setShowAssign={setShowAssign}
        setShowFinalize={setShowFinalize}
        setShowEditFinalize={setShowEditFinalize}
        setConfirMessage={setConfirMessage}
        setTypeForm={setTypeForm}
        setTypeAction={setTypeAction}
      />
      <Pagination
        totalItems={filteredData.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
      {showForm && (
        <>
          <Form_report
            title={title}
            onClose={() => setShowForm(false)}
            setShowMessage={setShowMessage}
            setTitleMessage={setTitleMessage}
            setMessage={setMessage}
            setStatus={setStatus}
            updateData={updateData}
            loading={loading}
            setLoading={setLoading}
          />
        </>
      )}
      {showEdit && (
        <>
          <Form_report
            title={title}
            onClose={() => setShowEdit(false)}
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
      {showAssign && (
        <>
          <Form_assign_maintenance
            title={title}
            onClose={() => setShowAssign(false)}
            setShowMessage={setShowMessage}
            setTitleMessage={setTitleMessage}
            setMessage={setMessage}
            setStatus={setStatus}
            updateData={updateData}
            id={id}
            loading={loading}
            setLoading={setLoading}
            typeAction={typeAction}
            parentComponent={parentComponent}
          />
        </>
      )}
      {showFinalize && (
        <>
          <Form_finalize_maintenance
            title={title}
            onClose={() => setShowFinalize(false)}
            setShowMessage={setShowMessage}
            setTitleMessage={setTitleMessage}
            setMessage={setMessage}
            setStatus={setStatus}
            updateData={updateData}
            id={id}
            idTechnician={idTechnician}
            statusName={statusName}
            loading={loading}
            setLoading={setLoading}
            typeAction={typeAction}
            parentComponent={parentComponent}
          />
        </>
      )}
      {showEditFinalize && (
        <>
          <Form_finalize_maintenance
            title={title}
            onClose={() => setShowEditFinalize(false)}
            setShowMessage={setShowMessage}
            setTitleMessage={setTitleMessage}
            setMessage={setMessage}
            setStatus={setStatus}
            updateData={updateData}
            id={id}
            idTechnician={idTechnician}
            statusName={statusName}
            loading={loading}
            setLoading={setLoading}
            typeAction={typeAction}
            parentComponent={parentComponent}
          />
        </>
      )}
      {showFilter && (
        <>
          <Filter_maintenance
            onClose={() => setShowFilter(false)}
            data={data}
            filteredData={filteredData}
            setFilteredData={setFilteredData}
            setStatusFilter={setStatusFilter}
            filters={filters}
            setFilters={setFilters}
            backupData={backupData}
            hasPermission={hasPermission}
            isTechnician={isTechnician}
          />
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

export default Fault_report;

const generateReport = (
  filteredData,
  toTitleCase,
  onFinish,
  companyData,
  locationNames,
  userData,
  isTechnician
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
  doc.text("CONSOLIDADO DE REPORTES DE FALLO", 12, 18);
  doc.setFontSize(11);
  doc.text(`Fecha de generación:`, 12, 27);
  doc.text(`Generado por:`, 12, 39);
  /*doc.setTextColor(94, 100, 112);*/
  doc.text("Roles actuales en el sistema", 12, 63);

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
  doc.text(`Cantidad de roles: ${filteredData.length}`, 12, 68);

  // Agregar tabla con autoTable
  autoTable(doc, {
    startY: 80,
    margin: { left: 12 },
    head: [
      isTechnician
        ? [
            "ID",
            "ID del predio",
            "ID del lote",
            "Número de documento",
            "Tipo de fallo",
            "Fecha de generación del reporte",
            "Estado",
          ]
        : [
            "ID",
            "ID del predio",
            "ID del lote",
            "Número de documento",
            "Tipo de fallo",
            "Técnico responsable",
            "Fecha de generación del reporte",
            "Estado",
          ],
    ],
    body: filteredData.map((report) =>
      isTechnician
        ? [
            report["ID"],
            report["ID del predio"],
            report["ID del lote"],
            report["Número de documento"],
            report["Tipo de fallo"],
            report["Fecha de generación del reporte"],
            toTitleCase(report["Estado"]),
          ]
        : [
            report["ID"],
            report["ID del predio"],
            report["ID del lote"],
            report["Número de documento"],
            report["Tipo de fallo"],
            toTitleCase(report["Técnico responsable"]),
            report["Fecha de generación del reporte"],
            toTitleCase(report["Estado"]),
          ]
    ),

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
