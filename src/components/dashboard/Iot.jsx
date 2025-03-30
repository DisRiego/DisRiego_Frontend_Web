import { useEffect, useState } from "react";
import axios from "axios";
import Head from "./Head";
import Search from "./Search";
import Filter from "./Filter";
import Table from "./Table";
import Pagination from "./Pagination";

const Iot = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const head_data = {
    title: "Gestión de dispositivos",
    description:
      "En esta sección puedes gestionar todos los dispositivos y visualizar su estado actual.",
    buttons: {
      button1: {
        icon: "FaPlus",
        class: "color-hover",
        text: "Añadir dispositivo",
      },
      button2: {
        icon: "LuDownload",
        class: "",
        text: "Descargar reporte",
      },
    },
  };

  const handleButtonClick = (buttonText) => {
    if (buttonText === "Añadir dispositivo") {
      setShowForm(true);
    }

    if (buttonText === "Descargar reporte") {
      setLoadingReport("is-loading");
      generateReport();
    }
  };

  const columns = [
    "ID",
    "ID Dispositivo",
    "ID Lote",
    "Número de documento",
    "Tipo de dispositivo",
    "Modelo",
    "Fecha de instalación",
    "Fecha estimada de mantenimiento",
    "Estado",
    "Opciones",
  ];

  const options = [
    { icon: "BiShow", name: "Ver detalles" },
    { icon: "BiEditAlt", name: "Editar" },
    { icon: "MdOutlineCheckCircle", name: "Habilitar" },
    { icon: "VscError", name: "Inhabilitar" },
  ];

  return (
    <>
      <Head head_data={head_data} />
      <div className="container-search">
        <Search onSearch={setSearchTerm} /*buttonDisabled={buttonDisabled}*/ />
        <Filter
        // onFilterClick={handleFilterClick}
        // buttonDisabled={buttonDisabled}
        />
      </div>
      <Table columns={columns} data={data} options={options} />
    </>
  );
};

export default Iot;
