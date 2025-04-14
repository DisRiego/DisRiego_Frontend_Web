import { useEffect, useState } from "react";
import axios from "axios";
import { MdDownloadDone } from "react-icons/md";
import Head from "./Head";
import Tab from "./Tab";
import Search from "./Search";
import Filter from "./Filter";
import Table from "./Table";
import Pagination from "./Pagination";
import Change_status_request from "./Status/Change_status_request";
import Message from "../Message";
import { format } from "date-fns";

const Request = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [loadingTable, setLoadingTable] = useState(false);
  const [id, setId] = useState(null);

  const [title, setTitle] = useState();
  const [typeForm, setTypeForm] = useState();
  const [showChangeStatus, setShowChangeStatus] = useState(false);
  const [confirMessage, setConfirMessage] = useState();
  const [loading, setLoading] = useState("");

  const [showMessage, setShowMessage] = useState(false);
  const [titleMessage, setTitleMessage] = useState(false);
  const [message, setMessage] = useState(false);
  const [status, setStatus] = useState(false);

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
    if (showMessage) {
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  useEffect(() => {
    getRequest();
  }, []);

  const getRequest = async () => {
    try {
      setLoadingTable(true);
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND_IOT +
          import.meta.env.VITE_ROUTE_BACKEND_REQUEST
      );

      console.log(response.data.data);
      const sortedData = response.data.data.sort(
        (a, b) => new Date(b.request_date) - new Date(a.request_date)
      );

      setData(sortedData);

      // setButtonDisabled(false);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    } finally {
      setLoadingTable(false);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return format(date, "yyyy-MM-dd, hh:mm a").toLowerCase();
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
      "ID de la válvula": info.device_iot_id,
      "Número de documento": info.owner_document_number,
      "Tipo de solicitud": info.type_opening_id,
      "Fecha de apertura": formatDateTime(info.open_date),
      "Fecha de cierre": formatDateTime(info.close_date),
      "Fecha de creación de la solicitud": formatDateTime(info.request_date),

      Estado: info.status_name,
    }));

  const updateData = async () => {
    getRequest();
  };

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
        setId={setId}
        setTitle={setTitle}
        setShowChangeStatus={setShowChangeStatus}
        setConfirMessage={setConfirMessage}
        setTypeForm={setTypeForm}
      ></Table>
      <Pagination
        totalItems={filteredData.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
      {showMessage && (
        <Message
          titleMessage={titleMessage}
          message={message}
          status={status}
          onClose={() => setShowMessage(false)}
        />
      )}
      {showChangeStatus && (
        <Change_status_request
          onClose={() => setShowChangeStatus(false)}
          onSuccess={() => setShowChangeStatus(false)}
          id={id}
          confirMessage={confirMessage}
          setShowMessage={setShowMessage}
          setTitleMessage={setTitleMessage}
          setMessage={setMessage}
          setStatus={setStatus}
          updateData={updateData}
          typeForm={typeForm}
          loading={loading}
          setLoading={setLoading}
        />
      )}
    </>
  );
};

export default Request;
