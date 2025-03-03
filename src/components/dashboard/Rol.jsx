import { useState, useEffect } from "react";
import Head from "./Head";
import Search from "./Search";
import Filter from "./Filter";
import Table from "./Table";
import Pagination from "./Pagination";
import Form from "./Form";
import View_filter from "./View_filter";
import Filter_rol from "./form_filters/Filter_rol";

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
    }
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
