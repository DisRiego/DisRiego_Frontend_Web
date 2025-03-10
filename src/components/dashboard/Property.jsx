import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Head from "./Head";
import Search from "./Search";
import Filter from "./Filter";
import Table from "./Table";
import Pagination from "./Pagination";
import Form_add_property from "./forms/adds/Form_add_property";
import Message from "../Message";

const Property = () => {
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

  const handleButtonClick = (buttonText) => {
    if (buttonText === "Añadir predio") {
      setShowForm(true);
    }

    if (buttonText === "Descargar reporte") {
      setLoading("is-loading");
      generateReport();
    }
  };

  const generateReport = () => {
    // Aqui va el codigo de generar reporte
    console.log("Generando reporte...");
  };

  const handleFilterClick = () => {
    setShowFilter(true);
  };

  const head_data = {
    title: "Gestión de predios",
    description:
      "En esta sección puedes gestionar predios, registrar nuevos lotes y visualizar sus detalles.",
    buttons: {
      button1: {
        icon: "FaPlus",
        class: "color-hover",
        text: "Añadir predio",
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
    "ID del predio",
    "Nombre",
    "Número de documento del dueño",
    "Folio de matricula inmobiliaria",
    "Extensión",
    "Latitud",
    "Longitud",
    "Estado",
    "Opciones",
  ];

  const fetchProperties = async () => {
    const mockData = [
      {
        id: 1,
        name: "Finca La Esperanza",
        user_name: "1023456789",
        inmobilario: "123-456789",
        extension: "50 Ha",
        latitud: "2.9273",
        longitud: "-75.2819",
        estado: "Activo",
      },
      {
        id: 2,
        name: "Hacienda El Roble",
        user_name: "1122334455",
        inmobilario: "234-567890",
        extension: "120 Ha",
        latitud: "2.9385",
        longitud: "-75.2901",
        estado: "Activo",
      },
      {
        id: 3,
        name: "Granja San Luis",
        user_name: "9988776655",
        inmobilario: "345-678901",
        extension: "30 Ha",
        latitud: "2.9156",
        longitud: "-75.2753",
        estado: "Inactivo",
      },
      {
        id: 4,
        name: "Predio Los Nogales",
        user_name: "6677889900",
        inmobilario: "456-789012",
        extension: "75 Ha",
        latitud: "2.9214",
        longitud: "-75.2687",
        estado: "Activo",
      },
      {
        id: 5,
        name: "Terreno Las Palmas",
        user_name: "3344556677",
        inmobilario: "567-890123",
        extension: "95 Ha",
        latitud: "2.9321",
        longitud: "-75.2850",
        estado: "Activo",
      },
    ];

    setData(mockData);
  };

  useEffect(() => {
    fetchProperties();
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
      "ID del predio": info.id,
      Nombre: info.name,
      "Número de documento del dueño": info.user_name,
      "Folio de matricula inmobiliaria": info.inmobilario,
      Extensión: info.extension,
      Latitud: info.latitud,
      Longitud: info.longitud,
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
          <Form_add_property
            title="Añadir predio"
            onClose={() => setShowForm(false)}
            setShowMessage={setShowMessage}
            setMessage={setMessage}
            setStatus={setStatus}
          />
        </>
      )}
    </>
  );
};

export default Property;
