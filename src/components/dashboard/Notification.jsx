import { useEffect, useState } from "react";
import { MdDownloadDone } from "react-icons/md";
import Head from "./Head";
import Search from "./Search";
import Filter from "./Filter";
import Table from "./Table";

const notifications = [
  {
    id: 1,
    date: "Mar 10, 2025",
    user: "Nombre del técnico",
    action: "completó el mantenimiento",
    property: "[Nombre de tu predio] - [Nombre de tu lote]",
    details: "Cambio de estado 'En mantenimiento' a 'Finalizado'",
    time: "9 horas",
    avatar: "https://cdn-icons-png.flaticon.com/512/3135/3135768.png",
  },
  {
    id: 2,
    date: "Mar 10, 2025",
    user: "Nombre usuario",
    action: "actualizó su información personal",
    details:
      "Se ha modificado el número de teléfono y la dirección de contacto",
    time: "9 horas",
    avatar: "https://cdn-icons-png.flaticon.com/512/3135/3135768.png",
  },
];

const requests = [
  {
    id: 1,
    date: "Mar 09, 2025",
    user: "Usuario A",
    action: "solicitó una revisión",
    details: "Revisión del sistema de riego en [Nombre del predio]",
    time: "2 horas",
    avatar: "https://cdn-icons-png.flaticon.com/512/3135/3135768.png",
  },
];

const DateSeparator = ({ date }) => (
  <div className="date-separator">
    <hr />
    <span className="date-tag">{date}</span>
    <hr />
  </div>
);

const Notification = () => {
  const [data, setData] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [loading, setLoading] = useState("");
  const [activeTab, setActiveTab] = useState("notificaciones");
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loadingTable, setLoadingTable] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const activeData = activeTab === "notificaciones" ? notifications : requests;

  const head_data_notification = {
    title: "Notificaciones y Solicitudes",
    description:
      "En esta sección puedes gestionar las notificaciones y solicitudes del distrito.",
    buttons: {
      button1: {
        icon: "MdDownloadDone",
        class: "color-hover",
        text: "Marcar todo como leido",
      },
    },
  };

  const head_data_request = {
    title: "Notificaciones y Solicitudes",
    description:
      "En esta sección puedes gestionar las notificaciones y solicitudes del distrito.",
  };

  const handleButtonClick = (buttonText) => {
    if (buttonText === "Marcar todo como leido") {
      setShowForm(true);
    }

    if (buttonText === "Descargar reporte") {
      setLoading("is-loading");
      generateReport();
    }
  };

  const handleFilterClick = () => {
    setShowFilter(true);
  };

  const columns = [
    "ID de la solicitud",
    "ID del lote",
    "ID de la válvula",
    "Número de documento del dueño",
    "Tipo de solicitud",
    "Fecha de apertura",
    "Fecha de cierre",
    "Fecha de creación de la solicitud",
    "Estado",
    "Opciones",
  ];

  const fetchProperties = async () => {
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
      "ID de la solicitud": info.id,
      "ID del lote": info.lot_id,
      "ID de la válvula": info.valve_id,
      "Número de documento del dueño": info.owner_document,
      "Tipo de solicitud": info.request_type,
      "Fecha de apertura": info.open_date,
      "Fecha de cierre": info.close_date,
      "Fecha de creación de la solicitud": info.creation_date,
      Estado: info.status,
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
    <div>
      {/* Mostrar el Head correspondiente según la pestaña activa */}
      {activeTab === "notificaciones" ? (
        <Head
          head_data={head_data_notification}
          onButtonClick={handleButtonClick}
        />
      ) : (
        <Head head_data={head_data_request} onButtonClick={handleButtonClick} />
      )}

      {/* Pestañas dinámicas */}
      <div className="tabs is-boxed">
        <ul>
          <li className={activeTab === "notificaciones" ? "is-active" : ""}>
            <a onClick={() => handleTabChange("notificaciones")}>
              Notificaciones
            </a>
          </li>
          <li className={activeTab === "solicitudes" ? "is-active" : ""}>
            <a onClick={() => handleTabChange("solicitudes")}>Solicitudes</a>
          </li>
        </ul>
      </div>

      {/* Mostrar Tabla solo si la pestaña activa es "Solicitudes" */}
      {activeTab === "solicitudes" && (
        <div>
          <div className="container-search">
            <Search onSearch={setSearchTerm} />
            <Filter onFilterClick={handleFilterClick} data={data} />
          </div>
          <Table
            columns={columns}
            data={paginatedData}
            options={options}
            loadingTable={loadingTable}
          />
        </div>
      )}

      {/* Renderizado de Notificaciones o Solicitudes */}
      {activeTab === "notificaciones" && (
        <div>
          {activeData.length === 0 ? (
            <p className="has-text-centered">
              No hay notificaciones disponibles.
            </p>
          ) : (
            activeData.map((notif) => (
              <div key={notif.id}>
                <DateSeparator date={notif.date} />
                <div className="rol-detail notification-item">
                  <article className="media">
                    <figure className="media-left">
                      <p className="image is-64x64">
                        <img src={notif.avatar} alt="avatar" />
                      </p>
                    </figure>
                    <div className="media-content">
                      <p>
                        <strong>{notif.user}</strong> {notif.action}
                        <br />
                        <small>{notif.details}</small>
                      </p>
                    </div>
                    <div className="media-right">
                      <small>{notif.time}</small>
                    </div>
                  </article>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Notification;
