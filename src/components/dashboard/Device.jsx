import { useEffect, useState } from "react";
import axios from "axios";
import useUserPermissions from "../../hooks/useUserPermissions";
import Head from "./reusable/Head";
import Search from "./reusable/Search";
import Filter from "./reusable/Filter";
import Tab from "./reusable/Tab";
import Table from "./reusable/Table";
import Pagination from "./reusable/Pagination";
import Form_device from "./forms/adds/Form_device";
import Filter_iot from "./filters/Filter_iot";
import Change_status_iot from "./Status/Change_status_iot";
import Form_assign_device from "./forms/adds/Form_assign_device";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import Icon from "../../assets/icons/Disriego_title.png";
import RobotoNormalFont from "../../assets/fonts/Roboto-Regular.ttf";
import RobotoBoldFont from "../../assets/fonts/Roboto-Bold.ttf";
import Message from "../Message";

const Device = () => {
  const [data, setData] = useState([]);
  const [loadingTable, setLoadingTable] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const [showChangeStatus, setShowChangeStatus] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [confirMessage, setConfirMessage] = useState();
  const [loading, setLoading] = useState("");
  const [loadingReport, setLoadingReport] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [titleMessage, setTitleMessage] = useState(false);
  const [message, setMessage] = useState(false);
  const [status, setStatus] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [id, setId] = useState(null);
  const [title, setTitle] = useState();
  const [typeForm, setTypeForm] = useState();
  const {
    permissions: permissionsUser,
    token,
    decodedToken,
  } = useUserPermissions();
  const hasPermission = (permission) => permissionsUser.includes(permission);

  const [typeAction, setTypeAction] = useState("");
  const [activeTab, setActiveTab] = useState("todos");

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [filteredData, setFilteredData] = useState([]);
  const [backupData, setBackupData] = useState([]);
  const [statusFilter, setStatusFilter] = useState(false);
  const [filters, setFilters] = useState({
    type_devices: {},
    estados: {},
    installation_date: {
      from: "",
      to: "",
    },
  });
  const api_key = import.meta.env.VITE_API_KEY;

  const head_data = {
    title: "Gestión de dispositivos",
    description:
      "En esta sección puedes gestionar todos los dispositivos y visualizar su estado actual.",
    buttons: {
      ...(hasPermission("Añadir dispositivo") && {
        button1: {
          icon: "FaPlus",
          class: "color-hover",
          text: "Añadir dispositivo",
        },
      }),
      ...(hasPermission("Descargar reportes de los dispositivos") && {
        button2: {
          icon: "LuDownload",
          class: "",
          text: "Descargar reporte",
        },
      }),
    },
  };

  const toTitleCase = (str) => {
    if (typeof str !== "string") return str; // Evita errores con números u otros tipos
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const handleButtonClick = async (buttonText) => {
    if (buttonText === "Añadir dispositivo") {
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

  const columns = [
    "ID",
    "ID Dispositivo",
    "ID Lote",
    "Número de documento",
    "Tipo de dispositivo",
    "Modelo",
    "Fecha de instalación",
    "Fecha estimada de mantenimiento",
    "Estado",
    "Opciones",
  ];

  const handleFilterClick = () => {
    setShowFilter(true);
  };

  useEffect(() => {
    if (token && hasPermission("Ver todos los dispositivos")) {
      fetchDevices();
    }
  }, [token, permissionsUser]);

  console.log(permissionsUser);

  const fetchDevices = async () => {
    try {
      setLoadingTable(true);
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND_IOT +
          import.meta.env.VITE_ROUTE_BACKEND_DEVICES
      );

      console.log(response.data.data);

      const sortedData = response.data.data.sort((a, b) => a.id - b.id);
      // const sortedData = response.data.data.sort((a, b) => b.id - a.id);

      setData(sortedData);

      setButtonDisabled(false);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    } finally {
      setLoadingTable(false);
    }
  };

  const fetchDevicesIot = async () => {
    try {
      setLoadingTable(true);
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND_IOT +
          import.meta.env.VITE_ROUTE_BACKEND_DEVICES_BY_CATEGORY +
          1
      );

      console.log(response.data.data);

      const sortedData = response.data.data.sort((a, b) => a.id - b.id);
      // const sortedData = response.data.data.sort((a, b) => b.id - a.id);

      setData(sortedData);

      setButtonDisabled(false);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    } finally {
      setLoadingTable(false);
    }
  };

  const fetchDevicesEnergy = async () => {
    try {
      setLoadingTable(true);
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND_IOT +
          import.meta.env.VITE_ROUTE_BACKEND_DEVICES_BY_CATEGORY +
          2
      );

      console.log(response.data.data);

      const sortedData = response.data.data.sort((a, b) => a.id - b.id);
      // const sortedData = response.data.data.sort((a, b) => b.id - a.id);

      setData(sortedData);

      setButtonDisabled(false);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    } finally {
      setLoadingTable(false);
    }
  };

  const fetchDevicesConnectivity = async () => {
    try {
      setLoadingTable(true);
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND_IOT +
          import.meta.env.VITE_ROUTE_BACKEND_DEVICES_BY_CATEGORY +
          3
      );

      console.log(response.data.data);

      const sortedData = response.data.data.sort((a, b) => a.id - b.id);
      // const sortedData = response.data.data.sort((a, b) => b.id - a.id);

      setData(sortedData);

      setButtonDisabled(false);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    } finally {
      setLoadingTable(false);
    }
  };

  const updateData = async () => {
    setButtonDisabled(true);
    fetchDevices();
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
          "ID Dispositivo": info.id,
          "ID Predio": info.property_id,
          "ID Lote": info.lot_id,
          "Número de documento": info.owner_document_number,
          "Tipo de dispositivo": info.device_type_name,
          Modelo: info.model,
          "Fecha de instalación": info.installation_date?.slice(0, 10),
          "Fecha estimada de mantenimiento":
            info.estimated_maintenance_date?.slice(0, 10),
          Estado: info.device_status_name,
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

  const tabs = [
    {
      key: "todos",
      label: "Todos los dispositivos",
      onClick: fetchDevices,
    },
    {
      key: "iot",
      label: "Dispositivos IoT",
      onClick: fetchDevicesIot,
    },
    {
      key: "energy",
      label: "Fuentes de energía",
      onClick: fetchDevicesEnergy,
    },
    {
      key: "connectivity",
      label: "Conectividad",
      onClick: fetchDevicesConnectivity,
    },
  ];

  const options = [
    hasPermission("Ver detalles de un dispositivo") && {
      icon: "BiShow",
      name: "Ver detalles",
    },
    hasPermission("Asignar dispositivo a un lote") && {
      icon: "TbMap2",
      name: "Asignar",
    },
    hasPermission("Reasignar dispositivo a un lote") && {
      icon: "TbMap2",
      name: "Reasignar",
    },
    hasPermission("Editar dispositivo") && {
      icon: "BiEditAlt",
      name: "Editar",
    },
    hasPermission("Habilitar dispositivo") && {
      icon: "MdOutlineCheckCircle",
      name: "Habilitar",
    },
    hasPermission("Inhabilitar dispositivo") && {
      icon: "VscError",
      name: "Inhabilitar",
    },
    hasPermission("Ver detalles de un lote") && {
      icon: "TbMapSearch",
      name: "Redirigir al lote",
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
      <Tab tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
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
        setShowAssign={setShowAssign}
        setShowChangeStatus={setShowChangeStatus}
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
      {showForm && hasPermission("Añadir dispositivo") && (
        <>
          <Form_device
            title="Añadir dispositivo"
            onClose={() => setShowForm(false)}
            setShowMessage={setShowMessage}
            setTitleMessage={setTitleMessage}
            setMessage={setMessage}
            setStatus={setStatus}
            updateData={updateData}
            token={token}
            loading={loading}
            setLoading={setLoading}
            typeForm={typeForm}
            setTypeForm={setTypeForm}
          />
        </>
      )}
      {showEdit && hasPermission("Editar dispositivo") && (
        <>
          <Form_device
            title={title}
            onClose={() => setShowEdit(false)}
            id={id}
            setShowMessage={setShowMessage}
            setTitleMessage={setTitleMessage}
            setMessage={setMessage}
            setStatus={setStatus}
            updateData={updateData}
            token={token}
            loading={loading}
            setLoading={setLoading}
            typeForm={typeForm}
            setTypeForm={setTypeForm}
          />
        </>
      )}
      {showAssign && (
        <>
          <Form_assign_device
            title={title}
            onClose={() => setShowAssign(false)}
            id={id}
            setShowMessage={setShowMessage}
            setTitleMessage={setTitleMessage}
            setMessage={setMessage}
            setStatus={setStatus}
            updateData={updateData}
            token={token}
            loading={loading}
            setLoading={setLoading}
            typeForm={typeForm}
            setTypeForm={setTypeForm}
            typeAction={typeAction}
          />
        </>
      )}
      {showChangeStatus && (
        <Change_status_iot
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
        <Filter_iot
          onClose={() => setShowFilter(false)}
          data={data}
          filteredData={filteredData}
          setFilteredData={setFilteredData}
          setStatusFilter={setStatusFilter}
          filters={filters}
          setFilters={setFilters}
          backupData={backupData}
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

export default Device;

const generateReport = (
  filteredData,
  toTitleCase,
  onFinish,
  companyData,
  locationNames,
  userData
) => {
  const doc = new jsPDF("landscape");

  // Añadir fuentes Roboto al documento
  doc.addFont(RobotoNormalFont, "Roboto", "normal");
  doc.addFont(RobotoBoldFont, "Roboto", "bold");

  // Colorear fondo
  doc.setFillColor(243, 242, 247);
  doc.rect(0, 0, 300, 53, "F"); // Colorear una parte de la página

  // Agregar logo
  doc.addImage(Icon, "PNG", 246, 10, 39, 11);

  // Configurar título y encabezados
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(17);
  doc.setFont("Roboto", "bold");
  doc.text("CONSOLIDADO DE DISPOSITIVOS", 12, 18);
  doc.setFontSize(11);
  doc.text(`Fecha de generación:`, 12, 27);
  doc.text(`Generado por:`, 12, 39);
  doc.text("Dispositivos registrados actualmente", 12, 63);

  // Configurar información adicional
  doc.setTextColor(94, 100, 112);
  doc.setFont("Roboto", "normal");
  doc.setFontSize(10);
  doc.text(`${new Date().toLocaleString()}`, 12, 32);

  doc.text(
    [
      toTitleCase(userData?.name),
      toTitleCase(userData?.first_last_name),
      toTitleCase(userData?.second_last_name),
    ]
      .filter(Boolean) // Elimina null, undefined y strings vacíos
      .join(" "),
    12,
    44
  );

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont("Roboto", "bold");
  doc.text(`Dirección de la empresa:`, 285, 27, { align: "right" });
  doc.text(`Correo electrónico de la empresa:`, 285, 39, { align: "right" });

  doc.setTextColor(94, 100, 112);
  doc.setFont("Roboto", "normal");
  doc.setFontSize(10);
  doc.text(
    `${companyData.address}. ${locationNames.state}, ${locationNames.city}`,
    285,
    32,
    { align: "right" }
  );

  doc.text(`${companyData.email}`, 285, 44, { align: "right" });
  doc.text(`Cantidad de dispositivos: ${filteredData.length}`, 12, 68);

  // Agregar tabla con autoTable
  autoTable(doc, {
    startY: 80,
    margin: { left: 12 },
    head: [
      [
        "ID dispositivo",
        "ID Lote",
        "Número de documento",
        "Tipo de dispositivo",
        "Modelo",
        "Fecha de instalación",
        "Fecha estimada de mantenimiento",
        "Estado",
      ],
    ],
    body: filteredData.map((device) => [
      device["ID Dispositivo"],
      device["ID Lote"] || "-",
      device["Número de documento"],
      device["Tipo de dispositivo"],
      device["Modelo"],
      device["Fecha de instalación"]?.slice(0, 10),
      device["Fecha estimada de mantenimiento"]?.slice(0, 10),
      device["Estado"],
    ]),
    theme: "grid",
    headStyles: {
      fillColor: [252, 252, 253],
      textColor: [0, 0, 0],
      fontStyle: "bold",
      lineColor: [234, 236, 240],
      lineWidth: 0.5,
      font: "Roboto", // Añadir fuente Roboto a los encabezados de tabla
    },
    bodyStyles: {
      textColor: [89, 89, 89],
      font: "Roboto", // Añadir fuente Roboto al cuerpo de la tabla
    },
    styles: {
      fontSize: 10,
      cellPadding: 3,
      lineColor: [234, 236, 240],
    },
  });

  // Agregar pie de página
  doc.addImage(Icon, "PNG", 12, 190, 32, 9);

  // Agregar numeración de páginas en el pie de página
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setFont("Roboto", "normal");
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
