import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Head from "./Head";
import Search from "./Search";
import Filter from "./Filter";
import Table from "./Table";

const Property_user = () => {
  const [data, setData] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [loading, setLoading] = useState("");
  const [loadingTable, setLoadingTable] = useState(false);

  const handleButtonClick = (buttonText) => {
    if (buttonText === "Descargar reporte") {
      setLoading("is-loading");
      generateReport();
    }
  };

  const handleFilterClick = () => {
    setShowFilter(true);
  };

  const head_data = {
    title: "Mis predios y lotes",
    description:
      "En esta sección podrás visualizar la información de los predios y lotes vinculados a su número de identificación.",
  };

  const columns = [
    "ID del predio",
    "Nombre del predio",
    "Folio de matricula inmobiliaria",
    "Latitud",
    "Longitud",
    "Extensión",
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
    </>
  );
};

export default Property_user;
