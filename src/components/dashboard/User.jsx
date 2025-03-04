import { useState, useEffect } from "react";
import Head from "./Head";
import Search from "./Search";
import Filter from "./Filter";
import Table from "./Table";
import Pagination from "./Pagination";
import Form_add_user from "./forms/adds/Form_add_user";
import Filter_user from "./filters/Filter_user";

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
      console.log("Generando reporte...");
    }
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
        id: 1,
        nombres: "Deivy",
        apellidos: "Mora",
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
