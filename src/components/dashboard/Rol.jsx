import { useState, useEffect } from "react";
import Head from "./Head";
import Search from "./Search";
import Filter from "./Filter";
import Table from "./Table";
import Pagination from "./Pagination";
import Form_add_rol from "./forms/adds/Form_add_rol";
import Filter_rol from "./filters/Filter_rol";
import { jsPDF } from "jspdf";
import Icon from "../../assets/icons/Disriego_title.png";
import { autoTable } from "jspdf-autotable";
import axios from "axios";
import RobotoNormalFont from "../../assets/fonts/Roboto-Regular.ttf";
import RobotoBoldFont from "../../assets/fonts/Roboto-Bold.ttf";
import Message from "../Message";

const Rol = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [loading, setLoading] = useState("");
  const [loadingTable, setLoadingTable] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState(false);
  const [status, setStatus] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const handleButtonClick = (buttonText) => {
    if (buttonText === "Añadir rol") {
      setShowForm(true);
    }

    if (buttonText === "Descargar reporte") {
      setLoading("is-loading");
      generateReport();
    }
  };

  const generateReport = () => {
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
    doc.text("REPORTE DE ROLES", 12, 18);
    doc.setFontSize(11);
    doc.text(`Fecha de generación:`, 12, 27);
    doc.text(`Generado por:`, 12, 39);
    /*doc.setTextColor(94, 100, 112);*/
    doc.text("Roles actuales en el sistema", 12, 63);

    doc.setTextColor(94, 100, 112);
    doc.setFont("Roboto", "normal");
    doc.setFontSize(10);
    doc.text(`${new Date().toLocaleString()}`, 12, 32);
    doc.text(`[Nombre del usuario]`, 12, 44);
    doc.setFontSize(11);
    doc.text(`[Dirección de la empresa]`, 194, 27, { align: "right" });
    doc.text(`[Ciudad, Dept. País]`, 194, 33, { align: "right" });
    doc.text(`[Teléfono]`, 194, 39, { align: "right" });
    doc.text(`Cantidad de roles: ${data.length}`, 12, 68);

    // Agregar tabla con autoTable
    autoTable(doc, {
      startY: 80,
      margin: { left: 12 },
      head: [
        [
          "Nombre del rol",
          "Descripción",
          "Cantidad de usuarios",
          "Permisos",
          "Estado",
        ],
      ],
      body: data.map((rol) => [
        toTitleCase(rol.role_name),
        toTitleCase(rol.role_description),
        rol.quantity_users,
        toTitleCase(rol.permissions.map((p) => p.name).join(", ")),
        toTitleCase(rol.status_name),
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
      setLoading("");
    }, 500);
  };

  const toTitleCase = (str) => {
    if (typeof str !== "string") return str; // Evita errores con números u otros tipos
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const handleFilterClick = () => {
    setShowFilter(true);
  };

  const head_data = {
    title: "Gestión de roles",
    description: "En esta sección puedes administrar los roles del sistema.",
    buttons: {
      button1: {
        icon: "FaPlus",
        class: "color-hover",
        text: "Añadir rol",
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
    "Nombre del rol",
    "Descripción",
    "Cantidad de usuarios",
    "Permisos",
    "Estado",
    "Opciones",
  ];

  const fetchRoles = async () => {
    try {
      setLoadingTable(true);
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND +
          import.meta.env.VITE_ROUTE_BACKEND_ROL
      );
      setData(response.data.data);
      setButtonDisabled(false);
    } catch (error) {
      console.error("Error al obtener los roles:", error);
    } finally {
      setLoadingTable(false);
    }
  };

  const updateData = async () => {
    fetchRoles();
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  const filteredData = data
    .filter((info) =>
      Object.values(info)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .map((info) => ({
      ID: info.role_id,
      "Nombre del rol": toTitleCase(info.role_name),
      Descripción: toTitleCase(info.role_description),
      "Cantidad de usuarios": info.quantity_users,
      Permisos: info.permissions.map((p) => toTitleCase(p.name)).join(", "),
      Estado: toTitleCase(info.status_name),
    }));

  const options = [
    { icon: "BiShow", name: "Ver detalles" },
    { icon: "BiEditAlt", name: "Editar" },
    { icon: "LuDownload", name: "Inhabilitar" },
  ];

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
        loading={loading}
        buttonDisabled={buttonDisabled}
      />
      <div className="container-search">
        <Search onSearch={setSearchTerm} />
        <Filter onFilterClick={handleFilterClick} data={data} />
      </div>
      <Table
        columns={columns}
        data={paginatedData}
        options={options}
        loadingTable={loadingTable}
      />
      <Pagination
        totalItems={filteredData.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
      {showForm && (
        <>
          <Form_add_rol
            title="Añadir Rol"
            onClose={() => setShowForm(false)}
            setShowMessage={setShowMessage}
            setMessage={setMessage}
            setStatus={setStatus}
            updateData={updateData}
          />
        </>
      )}
      {showFilter && (
        <>
          <Filter_rol
            title="Filtros de rol"
            onClose={() => setShowFilter(false)}
          />
        </>
      )}
      {showMessage && (
        <Message
          message={message}
          status={status}
          onClose={() => setShowMessage(false)}
        />
      )}
    </>
  );
};

export default Rol;
