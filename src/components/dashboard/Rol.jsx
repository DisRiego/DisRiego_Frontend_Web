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
      head: [
        ["Nombre del rol", "Descripción", "Cantidad de usuarios", "Permisos"],
      ],
      body: data.map((rol) => [
        rol.nombre,
        rol.descripcion,
        "-",
        rol.permisos.map((p) => p.nombre).join(", "),
      ]),
      theme: "grid",
      headStyles: {
        fillColor: [252, 252, 253],
        textColor: [89, 89, 89],
        fontStyle: "bold",
        lineColor: [234, 236, 240],
        lineWidth: 0.5,
      },
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
      doc.text(`Página ${i}/${pageCount}`, pageWidth - 10, pageHeight - 10, {
        align: "right",
      });
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
    "ID",
    "Nombre del rol",
    "Descripción",
    "Cantidad de usuarios",
    "Permisos",
    "Estado",
    "Opciones",
  ];

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_URI_BACKEND_USER + "/roles"
        );
        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error al obtener los roles:", error);
      }
    };

    fetchRoles();
    //   {
    //     id: 2,
    //     nombre: "Usuario",
    //     descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    //     cantidad: 10,
    //     permisos: [{ id: 1, nombre: "crear usuario", categoria: "usuario" }],
    //     estado: "Inactivo",
    //   },
    // ]);
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
      "Nombre del rol": info.name,
      Descripción: info.description,
      "Cantidad de usuarios": info.cantidad,
      Permisos: info.permissions,
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
          <Form_add_rol title="Añadir Rol" onClose={() => setShowForm(false)} />
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
