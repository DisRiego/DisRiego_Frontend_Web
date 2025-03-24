import { useState, useEffect } from "react";
import Head from "./Head";
import Search from "./Search";
import Filter from "./Filter";
import Table from "./Table";
import Pagination from "./Pagination";
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
  const token = localStorage.getItem("token");

  const handleButtonClick = (buttonText) => {
    if (buttonText === "Añadir usuario") {
      setShowForm(true);
    }

    //Aqui es donde se debe implementar la funcionalidad del reporte
    if (buttonText === "Descargar reporte") {
      setLoading("is-loading");
      generateUserReport();
    }
  };

  const generateUserReport = () => {
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
    doc.text(`[Nombre del usuario]`, 12, 44);
    doc.setFontSize(11);
    doc.text(`[Dirección de la empresa]`, 285, 27, { align: "right" });
    doc.text(`[Ciudad, Dept. País]`, 285, 33, { align: "right" });
    doc.text(`[Teléfono]`, 285, 39, { align: "right" });
    doc.text(`Cantidad de usuarios: ${data.length}`, 12, 68);

    // Agregar tabla con autoTable
    autoTable(doc, {
      startY: 80,
      margin: { left: 12 },
      head: [
        [
          "Nombre",
          "Tipo de documento",
          "Numero de documento",
          "Correo Electronico",
          "Número de Telefono",
          "Rol",
          "Estado",
        ],
      ],
      body: data.map((user) => [
        toTitleCase(user.name) +
          " " +
          toTitleCase(user.first_last_name) +
          "" +
          toTitleCase(user.second_last_name),
        toTitleCase(user.type_document_name),
        user.document_number,
        user.email,
        user.phone,
        user.roles.map((p) => toTitleCase(p.name)).join(", "),
        toTitleCase(user.status_name),
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
        fontSize: 9,
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
      setLoading("");
    }, 500);
  };

  const toTitleCase = (str) => {
    if (typeof str !== "string") return str; // Evita errores con números u otros tipos
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const handleFilterClick = () => {
    setShowFilter(true);
    console.log("Filtros...");
  };

  const head_data = {
    title: "Gestión de usuarios",
    description:
      "En esta sección puedes gestionar usuarios, asignar roles y editar su información.",
    buttons: {
      button1: {
        icon: "FaPlus",
        class: "color-hover",
        text: "Añadir usuario",
      },
      button2: {
        icon: "LuDownload",
        class: "",
        text: "Descargar reporte",
      },
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
    fetchUsers();
  }, []);

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
    fetchUsers();
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
    { icon: "BiShow", name: "Ver detalles" },
    { icon: "BiEditAlt", name: "Editar" },
    { icon: "MdOutlineCheckCircle", name: "Habilitar" },
    { icon: "VscError", name: "Inhabilitar" },
  ];

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
        loading={loading}
        // buttonDisabled={buttonDisabled}
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
