import { useState, useEffect } from "react";
import useUserPermissions from "../../hooks/useUserPermissions";
import Head from "./reusable/Head";
import Search from "./reusable/Search";
import Filter from "./reusable/Filter";
import Table from "./reusable/Table";
import Pagination from "./reusable/Pagination";
import Form_property from "./forms/adds/Form_property";
import Filter_property from "./filters/Filter_property";
import Change_status_property from "./Status/Change_status_property";
import Message from "../Message";
import axios from "axios";
import RobotoNormalFont from "../../assets/fonts/Roboto-Regular.ttf";
import RobotoBoldFont from "../../assets/fonts/Roboto-Bold.ttf";
import Icon from "../../assets/icons/Disriego_title.png";
import { jsPDF } from "jspdf"; // Importa jsPDF
import { autoTable } from "jspdf-autotable"; // componentes de Chart.js usados en el componente
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Property = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showEdit, setShowEdit] = useState();
  const [showChangeStatus, setShowChangeStatus] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [loading, setLoading] = useState("");
  const [loadingReport, setLoadingReport] = useState("");
  const [loadingTable, setLoadingTable] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [titleMessage, setTitleMessage] = useState(false);
  const [message, setMessage] = useState(false);
  const [status, setStatus] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [id, setId] = useState(null);
  const [title, setTitle] = useState();
  const [confirMessage, setConfirMessage] = useState();
  const [typeForm, setTypeForm] = useState();
  const [filteredData, setFilteredData] = useState([]);
  const [backupData, setBackupData] = useState([]);
  const [filters, setFilters] = useState({ estados: {} });
  const [statusFilter, setStatusFilter] = useState(false);

  const {
    permissions: permissionsUser,
    token,
    decodedToken,
  } = useUserPermissions();
  const hasPermission = (permission) => permissionsUser.includes(permission);

  const api_key = import.meta.env.VITE_API_KEY;

  const handleButtonClick = async (buttonText) => {
    if (buttonText === "Añadir predio") {
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
          userData
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

  const handleFilterClick = () => {
    setShowFilter(true);
  };

  const head_data = {
    title: "Gestión de predios",
    description:
      "En esta sección puedes gestionar predios, registrar nuevos lotes y visualizar sus detalles.",
    buttons: {
      ...(hasPermission("Añadir predio") && {
        button1: {
          icon: "FaPlus",
          class: "color-hover",
          text: "Añadir predio",
        },
      }),
      ...(hasPermission("Descargar reportes de todos los predios") && {
        button2: {
          icon: "LuDownload",
          class: "",
          text: "Descargar reporte",
        },
      }),
    },
  };

  const columns = [
    "ID",
    "ID del predio",
    "Nombre",
    "Número de documento del dueño",
    "Folio de matricula inmobiliaria",
    "Extensión (m²)",
    "Latitud",
    "Longitud",
    "Estado",
    "Opciones",
  ];

  useEffect(() => {
    if (token && hasPermission("Ver todos los predios")) {
      fetchProperties();
    }
  }, [token, permissionsUser]);

  const fetchProperties = async () => {
    try {
      setLoadingTable(true);
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND +
          import.meta.env.VITE_ROUTE_BACKEND_PROPERTY
      );
      // setData(response.data.data);

      const sortedData = response.data.data.sort((a, b) => b.id - a.id);
      // const sortedData = response.data.data.sort((a, b) =>
      //   a.name.localeCompare(b.name)
      // );
      // const sortedData = response.data.data.sort((a, b) => a.name - b.name);

      setData(sortedData);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    } finally {
      setButtonDisabled(false);
      setLoadingTable(false);
    }
  };

  const updateData = async () => {
    setButtonDisabled(true);
    fetchProperties();
  };

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showMessage]);

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
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
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
          "ID del predio": info.id,
          Nombre: toTitleCase(info.name),
          "Número de documento del dueño": info.owner_document_number,
          "Folio de matricula inmobiliaria":
            info.real_estate_registration_number,
          "Extensión (m²)": info.extension,
          Latitud: info.latitude,
          Longitud: info.longitude,
          Estado: info.state_name,
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

  const options = [
    hasPermission("Ver detalles de un predio") && {
      icon: "BiShow",
      name: "Ver detalles",
    },
    hasPermission("Editar predio") && {
      icon: "BiEditAlt",
      name: "Editar",
    },
    hasPermission("Habilitar predio") && {
      icon: "MdOutlineCheckCircle",
      name: "Habilitar",
    },
    hasPermission("Inhabilitar predio") && {
      icon: "VscError",
      name: "Inhabilitar",
    },
  ].filter(Boolean);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <>
      <Head
        head_data={head_data}
        onButtonClick={handleButtonClick}
        loading={loadingReport}
        buttonDisabled={buttonDisabled}
      />
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
        setTitle={setTitle}
        setShowEdit={setShowEdit}
        setShowChangeStatus={setShowChangeStatus}
        setConfirMessage={setConfirMessage}
        setTypeForm={setTypeForm}
      />
      <Pagination
        totalItems={filteredData.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
      {showForm && (
        <>
          <Form_property
            title="Añadir predio"
            onClose={() => setShowForm(false)}
            setShowMessage={setShowMessage}
            setTitleMessage={setTitleMessage}
            setMessage={setMessage}
            setStatus={setStatus}
            updateData={updateData}
            // id={id}
            loading={loading}
            setLoading={setLoading}
          />
        </>
      )}
      {showEdit && (
        <>
          <Form_property
            title="Editar predio"
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
      {showChangeStatus && (
        <Change_status_property
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
      {showFilter && (
        <>
          <Filter_property
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

export default Property;

const generateReport = (
  filteredData,
  toTitleCase,
  onFinish,
  companyData,
  locationNames,
  userData
) => {
  const sortedById = [...filteredData].sort((a, b) => a.ID - b.ID);
  // Aqui va el codigo de generar reporte
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
  doc.text("CONSOLIDADO DE PREDIOS", 12, 18);
  doc.setFontSize(11);
  doc.text(`Fecha de generación:`, 12, 27);
  doc.text(`Generado por:`, 12, 39);
  doc.text("Predios actuales en el sistema", 12, 63);

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
  doc.text(`Cantidad de predios: ${filteredData.length}`, 12, 68);

  // Agregar tabla con autoTable
  autoTable(doc, {
    startY: 80,
    margin: { left: 12 },
    head: [
      [
        "ID del predio",
        "Nombre",
        "Número de documento del dueño",
        "Folio de matricula inmobiliaria",
        "Extensión",
        "Latitud",
        "Longitud",
        "Estado",
      ],
    ],
    body: sortedById.map((property) => [
      property.ID,
      property.Nombre,
      property["Número de documento del dueño"],
      property["Folio de matricula inmobiliaria"],
      property["Extensión (m²)"],
      property.Latitud,
      property.Longitud,
      property.Estado,
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
