import { useState, useEffect } from "react";
import axios from "axios";
import useUserPermissions from "../../hooks/useUserPermissions";
import Head from "./reusable/Head";
import Tab from "./reusable/Tab";
import Search from "./reusable/Search";
import Filter from "./reusable/Filter";
import Table from "./reusable/Table";
import Pagination from "./reusable/Pagination";
import Form_report from "./forms/adds/Form_report";
import Form_assign_maintenance from "./forms/adds/Form_assign_maintenance";
import Form_finalize_maintenance from "./forms/adds/Form_finalize_maintenance";
import Message from "../Message";
import { format, set } from "date-fns";

const Fault_report = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState("");
  const [loadingTable, setLoadingTable] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const itemsPerPage = 5;

  const {
    permissions: permissionsUser,
    token,
    decodedToken,
  } = useUserPermissions();
  const hasPermission = (permission) => permissionsUser.includes(permission);

  const [title, setTitle] = useState();
  const [id, setId] = useState(null);
  const [idTechnician, setIdTechnician] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const [showFinalize, setShowFinalize] = useState(false);
  const [statusName, setStatusName] = useState(false);
  const [confirMessage, setConfirMessage] = useState();
  const [typeForm, setTypeForm] = useState();
  const [typeAction, setTypeAction] = useState("");

  const [showMessage, setShowMessage] = useState(false);
  const [titleMessage, setTitleMessage] = useState(false);
  const [message, setMessage] = useState(false);
  const [status, setStatus] = useState(false);

  const handleButtonClick = (buttonText) => {
    if (buttonText === "Reportar fallo") {
      setTitle("Crear reporte de fallo");
      setShowForm(true);
    }

    if (buttonText === "Descargar reporte") {
      console.log("Generando reporte...");
    }
  };

  const head_data = {
    title: "Gestión de mantenimiento",
    description:
      "En esta sección puedes visualizar y generar reportes de fallos.",
    buttons: {
      ...((hasPermission("Crear un reporte de fallo") ||
        hasPermission("Crear un reporte de fallo por un usuario")) && {
        button1: {
          icon: "FaPlus",
          class: "color-hover",
          text: "Reportar fallo",
        },
      }),
      ...(hasPermission("Descargar informe de un reporte de fallo") && {
        button2: {
          icon: "LuDownload",
          class: "",
          text: "Descargar reporte",
        },
      }),
    },
  };

  const tabs = [
    {
      key: "system",
      label: "Fallos autogenerados",
      path: "/dashboard/system",
    },
    {
      key: "report",
      label: "Reporte de fallos",
      path: "/dashboard/report",
    },
  ];

  let columns = [];
  if (hasPermission("Ver todos los reportes de fallo")) {
    columns = [
      "ID",
      "ID del reporte",
      "ID del predio",
      "ID del lote",
      "Número de documento",
      "Tipo de fallo",
      "Responsable del mantenimiento",
      "Fecha de generación del reporte",
      "Estado",
      "Opciones",
    ];
  } else if (
    hasPermission("Ver todos los reportes de fallos asignados a un técnico")
  ) {
    columns = [
      "ID",
      "ID del reporte",
      "ID del predio",
      "ID del lote",
      "Número de documento",
      "Tipo de fallo",
      "Fecha de generación del reporte",
      "Estado",
      "Opciones",
    ];
  } else if (
    hasPermission("Ver todos los reportes de fallos para un usuario")
  ) {
    columns = [
      "ID",
      "ID del reporte",
      "Nombre del predio",
      "Nombre del lote",
      "Posible fallo",
      "Fecha de generación del reporte",
      "Estado",
      "Opciones",
    ];
  }

  useEffect(() => {
    if (token && hasPermission("Ver todos los reportes de fallo")) {
      fetchFaultReport();
    } else {
      if (
        token &&
        hasPermission("Ver todos los reportes de fallos asignados a un técnico")
      ) {
        fetchFaultTechnician();
      } else {
        if (
          token &&
          hasPermission("Ver todos los reportes de fallos para un usuario")
        ) {
          fetchFaultUser();
        }
      }
    }
  }, [token, permissionsUser]);

  const fetchFaultReport = async () => {
    try {
      setLoadingTable(true);
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND_MAINTENANCE +
          import.meta.env.VITE_ROUTE_BACKEND_REPORT
      );
      const sortedData = response.data.data.sort((a, b) => b.id - a.id);

      setData(sortedData);
    } catch (error) {
      console.error("Error al obtener los reportes de fallos:", error);
    } finally {
      setButtonDisabled(false);
      setLoadingTable(false);
    }
  };

  const fetchFaultTechnician = async () => {
    try {
      setLoadingTable(true);
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND_MAINTENANCE +
          import.meta.env.VITE_ROUTE_BACKEND_REPORT_TECHNICIAN +
          decodedToken.id +
          import.meta.env.VITE_ROUTE_BACKEND_REPORT_BY_USERS
      );
      const sortedData = response.data.data.sort((a, b) => b.id - a.id);

      setData(sortedData);
    } catch (error) {
      console.error(
        "Error al obtener los reportes de fallos de un usuario:",
        error
      );
    } finally {
      setButtonDisabled(false);
      setLoadingTable(false);
    }
  };

  const fetchFaultUser = async () => {
    try {
      setLoadingTable(true);
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND_MAINTENANCE +
          import.meta.env.VITE_ROUTE_BACKEND_REPORT_USER +
          decodedToken.id +
          import.meta.env.VITE_ROUTE_BACKEND_REPORT_BY_USERS
      );
      const sortedData = response.data.data.sort((a, b) => b.id - a.id);

      setData(sortedData);
    } catch (error) {
      console.error(
        "Error al obtener los reportes de fallos de un usuario:",
        error
      );
    } finally {
      setButtonDisabled(false);
      setLoadingTable(false);
    }
  };

  const updateData = async () => {
    fetchFaultReport();
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return format(date, "yyyy-MM-dd, hh:mm a").toLowerCase();
  };

  const toTitleCase = (str) => {
    if (typeof str !== "string") return str;
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const filteredData = data
    .filter((info) =>
      Object.values(info)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .map((info) => {
      if (hasPermission("Ver todos los reportes de fallo")) {
        return {
          ID: info.id,
          "ID del reporte": info.id,
          "ID del predio": info.property_id,
          "ID del lote": info.lot_id,
          "Número de documento": info.owner_document,
          "Tipo de fallo": info.failure_type,
          "Responsable del mantenimiento": toTitleCase(info.technician_name),
          "ID del responsable": info.technician_id,
          "Fecha de generación del reporte": formatDateTime(info.date),
          Estado: info.status,
        };
      } else if (
        hasPermission("Ver todos los reportes de fallos asignados a un técnico")
      ) {
        return {
          ID: info.id,
          "ID del reporte": info.id,
          "ID del predio": info.property_id,
          "ID del lote": info.lot_id,
          "Número de documento": info.owner_document,
          "Tipo de fallo": info.failure_type,
          "Fecha de generación del reporte": formatDateTime(info.date),
          Estado: info.status,
        };
      } else {
        return {
          ID: info.report_id,
          "ID del reporte": info.report_id,
          "Nombre del predio": info.property_name,
          "Nombre del lote": info.lot_name,
          "Posible fallo": info.failure_type,
          "Fecha de generación del reporte": formatDateTime(info.report_date),
          Estado: info.status,
        };
      }
    });

  const options = [
    (hasPermission("Ver detalles de un reporte de fallo") ||
      hasPermission("Ver detalles de un reporte de fallo para un usuario")) && {
      icon: "BiShow",
      name: "Ver detalles",
    },
    {
      icon: "LuUserSearch",
      name: "Editar reporte",
    },
    hasPermission("Asignar responsable") && {
      icon: "TbUserPlus",
      name: "Asignar responsable",
    },
    hasPermission("Editar responsable") && {
      icon: "LuUserSearch",
      name: "Editar responsable",
    },
    hasPermission("Finalizar mantenimiento") && {
      icon: "BiEditAlt",
      name: "Finalizar mantenimiento",
    },
    hasPermission("Finalizar mantenimiento") && {
      icon: "BiEditAlt",
      name: "Editar mantenimiento",
    },
  ].filter(Boolean);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  return (
    <>
      <Head head_data={head_data} onButtonClick={handleButtonClick} />
      <Tab tabs={tabs} useLinks={true}></Tab>
      <div className="container-search">
        <Search onSearch={setSearchTerm} /> <Filter />
      </div>
      <Table
        columns={columns}
        data={paginatedData}
        options={options}
        loadingTable={loadingTable}
        setId={setId}
        setIdTechnician={setIdTechnician}
        setStatusName={setStatusName}
        setTitle={setTitle}
        setShowEdit={setShowEdit}
        setShowAssign={setShowAssign}
        setShowFinalize={setShowFinalize}
        setConfirMessage={setConfirMessage}
        setTypeForm={setTypeForm}
        setTypeAction={setTypeAction}
      />
      <Pagination
        totalItems={filteredData.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
      {showForm && (
        <>
          <Form_report
            title={title}
            onClose={() => setShowForm(false)}
            setShowMessage={setShowMessage}
            setTitleMessage={setTitleMessage}
            setMessage={setMessage}
            setStatus={setStatus}
            updateData={updateData}
            loading={loading}
            setLoading={setLoading}
          />
        </>
      )}
      {showEdit && (
        <>
          <Form_report
            title={title}
            onClose={() => setShowEdit(false)}
            setShowMessage={setShowMessage}
            setTitleMessage={setTitleMessage}
            setMessage={setMessage}
            setStatus={setStatus}
            updateData={updateData}
            id={id}
            loading={loading}
            setLoading={setLoading}
          />
        </>
      )}
      {showAssign && (
        <>
          <Form_assign_maintenance
            title={title}
            onClose={() => setShowAssign(false)}
            setShowMessage={setShowMessage}
            setTitleMessage={setTitleMessage}
            setMessage={setMessage}
            setStatus={setStatus}
            updateData={updateData}
            id={id}
            loading={loading}
            setLoading={setLoading}
            typeAction={typeAction}
          />
        </>
      )}
      {showFinalize && (
        <>
          <Form_finalize_maintenance
            title={title}
            onClose={() => setShowFinalize(false)}
            setShowMessage={setShowMessage}
            setTitleMessage={setTitleMessage}
            setMessage={setMessage}
            setStatus={setStatus}
            updateData={updateData}
            id={id}
            idTechnician={idTechnician}
            statusName={statusName}
            loading={loading}
            setLoading={setLoading}
            typeAction={typeAction}
          />
        </>
      )}
      {showMessage && (
        <Message
          titleMessage={titleMessage}
          message={message}
          status={status}
          onClose={() => setShowMessage(false)}
        />
      )}
    </>
  );
};

export default Fault_report;
