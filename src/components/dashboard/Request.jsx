import { useEffect, useState } from "react";
import { MdDownloadDone } from "react-icons/md";
import Head from "./Head";
import Tab from "./Tab";
import Search from "./Search";
import Filter from "./Filter";
import Table from "./Table";
import Pagination from "./Pagination";

const Request = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [loadingTable, setLoadingTable] = useState(false);

  const head_data_request = {
    title: "Solicitudes",
    description:
      "En esta sección puedes gestionar las solicitudes generadas por la plataforma.",
    buttons: {
      button1: {
        icon: "LuDownload",
        class: "",
        text: "Descargar reporte",
      },
    },
  };

  const handleButtonClick = (buttonText) => {
    if (buttonText === "Descargar reporte") {
      setLoading("is-loading");
      generateReport();
    }
  };

  const tabs = [
    {
      key: "notification",
      label: "Notificaciones",
      path: "/dashboard/notification",
    },
    {
      key: "request",
      label: "Solicitudes",
      path: "/dashboard/request",
    },
  ];

  useEffect(() => {
    getRequest();
  }, []);

  const getRequest = async () => {
    const mockData = [
      {
        id: 1,
        lot_id: "001",
        valve_id: "V-123",
        owner_document: "1023456789",
        request_type: "Apertura programada con limite de agua",
        open_date: "Mar 10, 2025",
        close_date: "Mar 11, 2025",
        creation_date: "Mar 09, 2025",
        status: "Finalizado",
      },
      {
        id: 2,
        lot_id: "002",
        valve_id: "V-456",
        owner_document: "1122334455",
        request_type: "Apertura programada sin limite de agua",
        open_date: "Mar 10, 2025",
        close_date: "Mar 11, 2025",
        creation_date: "Mar 08, 2025",
        status: "En proceso",
      },
      {
        id: 3,
        lot_id: "003",
        valve_id: "V-789",
        owner_document: "9988776655",
        request_type: "Apertura programada con limite de agua",
        open_date: "Mar 09, 2025",
        close_date: "Mar 10, 2025",
        creation_date: "Mar 07, 2025",
        status: "Completado",
      },
    ];

    setData(mockData);
  };

  const filteredData = data
    .filter((info) =>
      Object.values(info)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .map((info) => ({
      ID: info.id,
      "ID de la solicitud": info.id,
      "ID del lote": info.lot_id,
      "ID de la válvula": info.valve_id,
      "Número de documento": info.owner_document,
      "Tipo de solicitud": info.request_type,
      "Fecha de apertura": info.open_date,
      "Fecha de cierre": info.close_date,
      "Fecha de creación de la solicitud": info.creation_date,
      Estado: info.status,
    }));

  const columns = [
    "ID de la solicitud",
    "ID del lote",
    "ID de la válvula",
    "Número de documento",
    "Tipo de solicitud",
    "Fecha de apertura",
    "Fecha de cierre",
    "Fecha de creación de la solicitud",
    "Estado",
    "Opciones",
  ];

  const options = [
    { icon: "BiShow", name: "Ver detalles" },
    { icon: "MdDownloadDone", name: "Aprobar" },
    { icon: "VscError", name: "Denegar" },
  ];

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  return (
    <>
      <Head head_data={head_data_request} onButtonClick={handleButtonClick} />
      <Tab tabs={tabs} useLinks={true}></Tab>
      <Table
        columns={columns}
        data={paginatedData}
        options={options}
        loadingTable={loadingTable}
      ></Table>
    </>
  );
};

export default Request;
