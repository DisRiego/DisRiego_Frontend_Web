import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Head from "./Head";
import Search from "./Search";
import Filter from "./Filter";
import Table from "./Table";
import Pagination from "./Pagination";
import Form_add_property from "./forms/adds/Form_add_property";
import Message from "../Message";
import axios from "axios";

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

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoadingTable(true);
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND +
          import.meta.env.VITE_ROUTE_BACKEND_PROPERTY
      );
      setData(response.data.data);
      setButtonDisabled(false);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    } finally {
      setLoadingTable(false);
    }
  };

  console.log(data);

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
      "Folio de matricula inmobiliaria": info.real_estate_registration_number,
      Extensión: info.extension,
      Latitud: info.latitude,
      Longitud: info.longitude,
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
