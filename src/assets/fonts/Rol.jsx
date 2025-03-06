import { useState, useEffect } from "react";
import Head from "../../components/dashboard/Head";
import Search from "../../components/dashboard/Search";
import Filter from "../../components/dashboard/Filter";
import Table from "../../components/dashboard/Table";
import Pagination from "../../components/dashboard/Pagination";
import Form from "../../components/dashboard/Form";
import View_filter from "../../components/dashboard/View_filter";
import Filter_rol from "../../components/dashboard/filter_fields/Filter_rol";
import { jsPDF } from "jspdf";
import Icon from "../../assets/icons/Disriego_title.png";
import { autoTable } from "jspdf-autotable";
// Importa las fuentes (asegúrate que las rutas sean correctas)
import RobotoNormal from "../../assets/fonts/Roboto-Regular.ttf";
import RobotoBold from "../../assets/fonts/Roboto-Bold.ttf";

const Rol = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleButtonClick = (buttonText) => {
    if (buttonText === "Añadir rol") {
      setShowForm(true);
    }

    //Aqui es donde se debe implementar la funcionalidad del reporte
    if (buttonText === "Descargar reporte") {
      console.log("Generando reporte...");
      generateReport();
    }
  };

  const generateReport = () => {
    const doc = new jsPDF();
  // Registrar las fuentes
  doc.addFileToVFS("Roboto-Regular.ttf", RobotoNormal);
  doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
  doc.addFileToVFS("Roboto-Bold.ttf", RobotoBold);
  doc.addFont("Roboto-Bold.ttf", "Roboto", "bold");

    //colorear fondo
    doc.setFillColor(243, 242, 247); // Azul claro
    doc.rect(0, 0, 210, 53, "F"); // colorear una parte de la pagina
    // agregar logo (usando base 64 directamente sobre la importacion)
    doc.addImage(Icon, "PNG", 156, 10, 39, 11);

    doc.setFontSize(17);
    doc.setFont("Roboto", "bold");
    doc.text("REPORTE DE ROLES", 12, 18);
    doc.setFontSize(10);
    doc.setTextColor(94, 100, 112);
    doc.text(`${new Date().toLocaleString()}`, 12, 32);
    doc.text(`[Nombre del usuario]`, 12, 44);
    doc.text(`[Dirección de la empresa]`, 194, 27, { align: "right" });
    doc.text(`[Ciudad, Dept. País]`, 194, 33, { align: "right" });
    doc.text(`[Teléfono]`, 194, 39, { align: "right" });
    doc.setTextColor(0, 0, 0);
    doc.text(`Fecha de generación:`, 12, 27);
    doc.text(`Generado por:`, 12, 39);
    doc.setFontSize(11);
    doc.text("Roles actuales en el sistema", 12, 63);
    doc.setFontSize(11);
    doc.setTextColor(94, 100, 112);
    doc.setFont("Roboto", "Normal");
    doc.text(`Cantidad de roles: ${data.length}`, 12, 68);

        // Agregar tabla con autoTable
        autoTable(doc, { 
          startY: 80,
          margin: { left: 12 },
          head: [["Nombre del rol", "Descripción", "Cantidad de usuarios", "Permisos"]],
          body: data.map((rol) => [
            rol.nombre,
            rol.descripcion,
            "-",
            rol.permisos.map((p) => p.nombre).join(", "),
          ]),
          theme: "grid",
          headStyles: { fillColor: [252, 252, 253], textColor: [89, 89, 89], fontStyle: "bold", 
          lineColor: [234, 236, 240], lineWidth: 0.5,}, 
          bodyStyles: { textColor: [89, 89, 89] },
          styles: { fontSize: 10, cellPadding: 3, lineColor: [234, 236, 240] }, 
        });
            doc.addImage(Icon, "PNG", 12, 280, 32, 9);
            // Agregar numeración de páginas en el pie de página
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
              doc.setPage(i);
              doc.setFontSize(10);
              const pageWidth = doc.internal.pageSize.getWidth();
              const pageHeight = doc.internal.pageSize.getHeight();
              doc.text(`Página ${i}/${pageCount}`, pageWidth - 10, pageHeight - 10, { align: "right" });
            }
        
    doc.save("reporte_roles.pdf");
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
    "Nombre del rol",
    "Descripción",
    "Permisos",
    "Estado",
    "Opciones",
  ];

  useEffect(() => {
    setData([
      {
        id: 1,
        nombre: "Admin",
        descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        permisos: [
          { id: 1, nombre: "Crear usuario", categoria: "usuario" },
          { id: 2, nombre: "Crear rol", categoria: "rol" },
          { id: 3, nombre: "Crear predio", categoria: "predio" },
          { id: 4, nombre: "Editar usuario", categoria: "usuario" },
          { id: 5, nombre: "Inhabilitar usuario", categoria: "usuario" },
          {
            id: 6,
            nombre: "Descargar reporte de usuario",
            categoria: "usuario",
          },
          { id: 7, nombre: "Ver detalles de un usuario", categoria: "usuario" },
        ],
        estado: "Activo",
      },
      {
        id: 2,
        nombre: "Usuario",
        descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        permisos: [{ id: 1, nombre: "crear usuario", categoria: "usuario" }],
        estado: "Inactivo",
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
      "Nombre del rol": info.nombre,
      Descripción: info.descripcion,
      Permisos: info.permisos,
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
          <Form title="Añadir Rol" onClose={() => setShowForm(false)} />
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
    </>
  );
};

export default Rol;
