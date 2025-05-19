import { useState, useEffect } from "react";
import useUserPermissions from "../../hooks/useUserPermissions";
import Head from "./reusable/Head";
import Search from "./reusable/Search";
import Filter from "./reusable/Filter";
import Table from "./reusable/Table";
import Pagination from "./reusable/Pagination";
import Form_user from "./forms/adds/Form_user";
import Filter_user from "./filters/Filter_user";
import { autoTable } from "jspdf-autotable";
import { jsPDF } from "jspdf";
import Icon from "../../assets/icons/Disriego_title.png";
import RobotoNormalFont from "../../assets/fonts/Roboto-Regular.ttf";
import RobotoBoldFont from "../../assets/fonts/Roboto-Bold.ttf";
import axios from "axios";
import Message from "../Message";
import Change_status_user from "./Status/Change_status_user";

const User = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showEdit, setShowEdit] = useState();
  const [showChangeStatus, setShowChangeStatus] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [confirMessage, setConfirMessage] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [loading, setLoading] = useState("");
  const [loadingReport, setLoadingReport] = useState("");
  const [loadingTable, setLoadingTable] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [titleMessage, setTitleMessage] = useState(false);
  const [message, setMessage] = useState(false);
  const [status, setStatus] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [backupData, setBackupData] = useState([]);
  const [statusFilter, setStatusFilter] = useState(false);
  const [filters, setFilters] = useState({
    estados: {},
    roles: {},
    tiposDocumento: {},
  });

  const [id, setId] = useState(null);
  const [title, setTitle] = useState();
  const [typeForm, setTypeForm] = useState();

  const {
    permissions: permissionsUser,
    token,
    decodedToken,
  } = useUserPermissions();
  const hasPermission = (permission) => permissionsUser.includes(permission);

  const api_key = import.meta.env.VITE_API_KEY;

  const handleButtonClick = async (buttonText) => {
    if (buttonText === "Añadir usuario") {
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
          userDat
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

  const toTitleCase = (str) => {
    if (typeof str !== "string") return str; // Evita errores con números u otros tipos
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const handleFilterClick = () => {
    setShowFilter(true);
  };

  const head_data = {
    title: "Gestión de usuarios",
    description:
      "En esta sección puedes gestionar usuarios, asignar roles y editar su información.",
    buttons: {
      ...(hasPermission("Añadir usuario") && {
        button1: {
          icon: "FaPlus",
          class: "color-hover",
          text: "Añadir usuario",
        },
      }),
      ...(hasPermission("Descargar reportes de todos los usuarios") && {
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
    "Nombres",
    "Apellidos",
    "Tipo de documento",
    "Numero de documento",
    "Correo Electronico",
    "Numero de telefono",
    "Rol",
    "Estado",
    "Opciones",
  ];

  useEffect(() => {
    if (token && hasPermission("Ver detalles de un usuario")) {
      fetchUsers();
    }
  }, [token, permissionsUser]);

  const fetchUsers = async () => {
    try {
      setLoadingTable(true);
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND +
          import.meta.env.VITE_ROUTE_BACKEND_USERS
      );
      const sortedData = response.data.data.sort((a, b) =>
        a.name.localeCompare(b.name)
      );

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
    fetchUsers();
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
          Nombres: toTitleCase(info.name),
          Apellidos:
            (info.first_last_name ? toTitleCase(info.first_last_name) : "") +
            (info.second_last_name
              ? " " + toTitleCase(info.second_last_name)
              : ""),
          "Tipo de documento": info.type_document_name,
          "Numero de documento": info.document_number,
          "Correo Electronico": info.email,
          "Numero de telefono": info.phone,
          Rol: info.roles.map((p) => toTitleCase(p.name)).join(", "),
          Estado: toTitleCase(info.status_name),
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

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  const options = [
    hasPermission("Ver detalles de un usuario") && {
      icon: "BiShow",
      name: "Ver detalles",
    },
    hasPermission("Editar usuario") && {
      icon: "BiEditAlt",
      name: "Editar",
    },
    hasPermission("Habilitar usuario") && {
      icon: "MdOutlineCheckCircle",
      name: "Habilitar",
    },
    hasPermission("Inhabilitar usuario") && {
      icon: "VscError",
      name: "Inhabilitar",
    },
  ].filter(Boolean);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  console.log(filteredData);

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
          <Form_user
            title="Añadir Usuario"
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
      {showEdit && (
        <Form_user
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
          token={token}
          typeForm={typeForm}
          setTypeForm={setTypeForm}
        />
      )}
      {showChangeStatus && (
        <Change_status_user
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
          <Filter_user
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

export default User;

const generateReport = (
  filteredData,
  toTitleCase,
  onFinish,
  companyData,
  locationNames,
  userData
) => {
  const doc = new jsPDF("landscape");

  // Add Roboto font to the document
  doc.addFont(RobotoNormalFont, "Roboto", "normal");
  doc.addFont(RobotoBoldFont, "Roboto", "bold");

  //colorear fondo
  doc.setFillColor(243, 242, 247); // Azul claro
  doc.rect(0, 0, 300, 53, "F"); // colorear una parte de la pagina

  // agregar logo (usando base 64 directamente sobre la importacion)
  doc.addImage(Icon, "PNG", 246, 10, 39, 11);

  doc.setFontSize(17);
  doc.setFont("Roboto", "bold");
  doc.text("REPORTE DE USUARIOS", 12, 18);
  doc.setFontSize(11);
  doc.text(`Fecha de generación:`, 12, 27);
  doc.text(`Generado por:`, 12, 39);
  doc.text("Usuarios registrados actualmente", 12, 63);
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
  doc.text(`Cantidad de usuarios: ${filteredData.length}`, 12, 68);

  // Agregar tabla con autoTable
  autoTable(doc, {
    startY: 80,
    margin: { left: 12 },
    head: [
      [
        "Nombre",
        "Tipo de documento",
        "Numero de documento",
        "Correo electrónico",
        "Número de Telefono",
        "Rol",
        "Estado",
      ],
    ],
    body: filteredData.map((user) => [
      toTitleCase(user["Nombres"]) + " " + toTitleCase(user["Apellidos"]),
      user["Tipo de documento"],
      user["Numero de documento"],
      user["Correo Electronico"],
      user["Numero de telefono"],
      user["Rol"],
      toTitleCase(user["Estado"]),
    ]),
    theme: "grid",
    headStyles: {
      fillColor: [252, 252, 253],
      textColor: [0, 0, 0],
      fontStyle: "bold",
      font: "Roboto",
      lineColor: [234, 236, 240],
      lineWidth: 0.5,
    },
    bodyStyles: { textColor: [89, 89, 89], font: "Roboto" },
    styles: {
      fontSize: 10,
      cellPadding: 3,
      lineColor: [234, 236, 240],
      font: "Roboto",
    },
    columnStyles: {
      0: { cellWidth: "auto" },
      1: { cellWidth: "auto" },
      2: { cellWidth: "auto" },
      3: { cellWidth: "auto" },
      4: { cellWidth: "auto" },
      5: { cellWidth: "auto" },
      6: { cellWidth: "auto" },
    },
  });
  doc.addImage(Icon, "PNG", 12, 190, 32, 9);
  // Agregar numeración de páginas en el pie de página
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
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
