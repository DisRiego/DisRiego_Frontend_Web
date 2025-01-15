import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Head from "./Head";
import Search from "./Search";
import Filter from "./Filter";
import Table from "./Table";
import Pagination from "./Pagination";

const Fault_report = () => {
  const [data, setData] = useState([]);
  const navegation = useNavigate();

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
        id: 1,
        predio: "predio 1",
        lote: "lote 1",
        fallo: "daño válvula",
        fecha: "2024-12-23",
        estado: "1",
      },
      {
        id: 2,
        predio: "predio 2",
        lote: "lote 2",
        fallo: "daño bateria",
        fecha: "2024-12-25",
        estado: "0",
      }
    ]);
  }, []);

  const mapData = data.map((info) => ({
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

  const handleOnClick = async () => {
    navegation("detail");
  };

  return (
    <>
      <Head head_data={head_data} />
      <div className="container-search">
        <Search />
        <Filter />
      </div>
      <Table columns={columns} data={mapData} options={options}/>
      <Pagination/>
      <button className="button" onClick={handleOnClick}>Detalles</button>
    </>
  );
};

export default Fault_report;
