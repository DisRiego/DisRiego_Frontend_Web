import { useState, useEffect } from "react";
import Head from "./Head";
import Search from "./Search";
import Filter from "./Filter";
import Table from "./Table";
import Pagination from "./Pagination";
import Form_add_user from "./forms/adds/Form_add_user";
import Filter_user from "./filters/Filter_user";
import { autoTable } from "jspdf-autotable";
import { jsPDF } from "jspdf";
import Icon from "../../assets/icons/Disriego_title.png";
import RobotoNormalFont from "../../assets/fonts/Roboto-Regular.ttf";
import RobotoBoldFont from "../../assets/fonts/Roboto-Bold.ttf";
import axios from "axios";

const User = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [loading, setLoading] = useState("");
  const [loadingTable, setLoadingTable] = useState(false);

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
    const doc = new jsPDF();

    // Add Roboto font to the document
    doc.addFont(RobotoNormalFont, "Roboto", "normal");
    doc.addFont(RobotoBoldFont, "Roboto", "bold");

    //colorear fondo
    doc.setFillColor(243, 242, 247); // Azul claro
    doc.rect(0, 0, 210, 53, "F"); // colorear una parte de la pagina
    // agregar logo (usando base 64 directamente sobre la importacion)
    doc.addImage(Icon, "PNG", 156, 10, 39, 11);

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
    doc.text(`[Dirección de la empresa]`, 194, 27, { align: "right" });
    doc.text(`[Ciudad, Dept. País]`, 194, 33, { align: "right" });
    doc.text(`[Teléfono]`, 194, 39, { align: "right" });
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
          "Direccion",
          "Roles",
          "Estado",
        ],
      ],
      body: data.map((user) => [
        user.nombres + " " + user.apellidos,
        user.tipo_documento,
        user.num_documento,
        "-",
        "-",
        "-",
        user.roles,
        user.estado,
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
        7: { cellWidth: "auto" },
      },
    });
    doc.addImage(Icon, "PNG", 12, 280, 32, 9);
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
    "Dirección",
    "Rol",
    "Estado",
    "Opciones",
  ];

  const fetchUsers = async () => {
    try {
      setLoadingTable(true);
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND + "/users"
      );
      setData(response.data.users);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    } finally {
      setLoadingTable(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredData = data
    .filter((info) =>
      Object.values(info)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .map((info) => ({
      ID: info.id,
      Nombres: info.name,
      Apellidos: info.first_last_name + info.second_last_name,
      "Tipo de documento": info.type_document_id,
      "Numero de documento": info.document_number,
      "Correo Electronico": info.email,
      "Numero de telefono": info.phone,
      Dirección: info.address,
      Rol: info.roles,
      Estado: info.estado,
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
      />
      <div className="container-search">
        <Search onSearch={setSearchTerm} />
        <Filter onFilterClick={handleFilterClick} />
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
          <Form_add_user
            title="Añadir Usuario"
            onClose={() => setShowForm(false)}
          />
        </>
      )}
      {showFilter && (
        <>
          <Filter_user
            title="Filtros de rol"
            onClose={() => setShowFilter(false)}
          />
        </>
      )}
    </>
  );
};

export default User;
