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

// Import Roboto font files (you'll need to have these files in your project)
// You can download them from Google Fonts or use a CDN
import RobotoNormalFont from "../../assets/fonts/Roboto-Regular.ttf";
import RobotoBoldFont from "../../assets/fonts/Roboto-Bold.ttf";

const User = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleButtonClick = (buttonText) => {
    if (buttonText === "Añadir usuario") {
      setShowForm(true);
    }

    //Aqui es donde se debe implementar la funcionalidad del reporte
    if (buttonText === "Descargar reporte") {
      generateUserReport();
      console.log("Generando reporte...");
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
          "Telefono",
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

    doc.save("Reporte_Usuarios.pdf");
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
    "Fecha de expedición",
    "Numero de telefono",
    "Roles",
    "Estado",
    "Opciones",
  ];

  useEffect(() => {
    setData([
      {
        id: 1,
        nombres: "Sebastian",
        apellidos: "Perdomo Cardozo",
        tipo_documento: "C.C",
        num_documento: 1010115909,
        fecha_expedicion: "24-02-2020",
        roles: "Administrador, Cliente",
        // roles: [
        //   { id: 1, nombre: "Administrador" },
        //   { id: 2, nombre: "Cliente" },
        // ],
        estado: "activo",
      },
      {
        id: 2,
        nombres: "Deivy",
        apellidos: "Mora",
        tipo_documento: "C.C",
        num_documento: 123456789,
        fecha_expedicion: "15-06-2021",
        roles: "Cliente",
        // roles: [{ id: 1, nombre: "Administrador" }],
        estado: "activo",
      },
      {
        id: 3,
        nombres: "Juan",
        apellidos: "Rodriguez",
        tipo_documento: "C.C",
        num_documento: 123456789,
        fecha_expedicion: "15-06-2021",
        roles: "Cliente",
        // roles: [{ id: 1, nombre: "Administrador" }],
        estado: "activo",
      },
    ]);
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
      Nombres: info.nombres,
      Apellidos: info.apellidos,
      "Tipo de documento": info.tipo_documento,
      "Numero de documento": info.num_documento,
      "Fecha de expedición": info.fecha_expedicion,
      Roles: info.roles,
      Estado: info.estado,
    }));

  const options = [
    { icon: "BiShow", name: "Ver detalles" },
    { icon: "BiEditAlt", name: "Editar" },
    { icon: "LuDownload", name: "Inhabilitar" },
    { icon: "LuDownload", name: "Descargar" },
  ];

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <>
      <Head head_data={head_data} onButtonClick={handleButtonClick} />
      <div className="container-search">
        <Search onSearch={setSearchTerm} />
        <Filter onFilterClick={handleFilterClick} />
      </div>
      <Table columns={columns} data={paginatedData} options={options} />
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
