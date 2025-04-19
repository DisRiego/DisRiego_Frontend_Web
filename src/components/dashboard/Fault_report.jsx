import { useState, useEffect } from "react";
import Head from "./reusable/Head";
import Search from "./reusable/Search";
import Filter from "./reusable/Filter";
import Table from "./reusable/Table";
import Pagination from "./reusable/Pagination";

const Fault_report = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleButtonClick = (buttonText) => {
    if (buttonText === "Reportar fallo") {
      setShowForm(true);
    }

    //Aqui es donde se debe implementar la funcionalidad del reporte
    if (buttonText === "Descargar reporte") {
      console.log("Generando reporte...");
    }
  };

  const head_data = {
    title: "Reportes de fallos",
    description:
      "En esta sección puedes visualizar y generar reportes de fallos.",
    buttons: {
      button1: {
        icon: "FaPlus",
        class: "color-hover",
        text: "Reportar fallo",
      },
      button2: {
        icon: "LuDownload",
        class: "",
        text: "Descargar reporte",
      },
    },
  };

  const columns = [
    "ID Reporte",
    "Nombre del predio",
    "Nombre del lote",
    "Posible fallo",
    "Fecha de reporte del fallo",
    "Estado",
    "Opciones",
  ];

  useEffect(() => {
    setData([
      {
        id: 123,
        predio: "predio 1",
        lote: "lote 1",
        fallo: "daño válvula",
        fecha: "2024-12-23",
        estado: "1",
      },
      {
        id: 123,
        predio: "predio 1",
        lote: "lote 1",
        fallo: "daño medidor",
        fecha: "2025-01-10",
        estado: "1",
      },
      {
        id: 234,
        predio: "predio 2",
        lote: "lote 2",
        fallo: "daño bateria",
        fecha: "2024-12-25",
        estado: "0",
      },
      {
        id: 345,
        predio: "predio 3",
        lote: "lote 3",
        fallo: "daño controlador",
        fecha: "2024-12-28",
        estado: "1",
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
      "ID Reporte": info.id,
      "Nombre del predio": info.predio,
      "Nombre del lote": info.lote,
      "Posible fallo": info.fallo,
      "Fecha de reporte del fallo": info.fecha,
      Estado: info.estado,
    }));

  const options = [
    { icon: "BiShow", name: "Ver detalles" },
    { icon: "BiEditAlt", name: "Finalizar mantenimiento" },
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
        <Search onSearch={setSearchTerm} /> <Filter />
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
          <Form title="Reportar fallo" onClose={() => setShowForm(false)} />
        </>
      )}
    </>
  );
};

export default Fault_report;
