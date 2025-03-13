import React, { useState } from "react";
import { MdDownloadDone } from "react-icons/md";

const notifications = [
  {
    id: 1,
    date: "Mar 10, 2025",
    user: "Nombre del técnico",
    action: "completó el mantenimiento",
    property: "[Nombre de tu predio] - [Nombre de tu lote]",
    details: "Cambio de estado 'En mantenimiento' a 'Finalizado'",
    time: "9 horas",
    avatar: "https://via.placeholder.com/50",
  },
  {
    id: 2,
    date: "Mar 10, 2025",
    user: "Nombre usuario",
    action: "actualizó su información personal",
    details:
      "Se ha modificado el número de teléfono y la dirección de contacto",
    time: "9 horas",
    avatar: "https://via.placeholder.com/50",
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
    avatar: "https://via.placeholder.com/50",
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
  const [activeTab, setActiveTab] = useState("notificaciones"); // Estado para cambiar pestañas

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const activeData = activeTab === "notificaciones" ? notifications : requests;

  return (
    <div>
      <div>
        <div className="level is-mobile">
          <div className="level-left">
            <div className="notification-header">
              <h2 className="title is-4 mb-4">Notificaciones y Solicitudes</h2>
              <p className="subtitle is-6">
                En esta sección puedes gestionar las notificaciones y
                solicitudes del distrito
              </p>
            </div>
          </div>
          <div className="level-right">
            <button className="button is-success">
              <MdDownloadDone className="icon-spacing" /> Marcar todo como leído
            </button>
          </div>
        </div>

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

        {/* Renderizado de datos según la pestaña activa */}
        <div>
          {activeData.length === 0 ? (
            <p className="has-text-centered">No hay {activeTab} disponibles.</p>
          ) : (
            activeData.map((notif) => (
              <div key={notif.id}>
                <DateSeparator date={notif.date} />
                <div className="box notification-item">
                  <article className="media">
                    <figure className="media-left">
                      <p className="image is-64x64">
                        <img src={notif.avatar} alt="avatar" />
                      </p>
                    </figure>
                    <div className="media-content">
                      <div className="content">
                        <p>
                          <strong>{notif.user}</strong> {notif.action}
                          <br />
                          <small>{notif.details}</small>
                        </p>
                      </div>
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
      </div>
    </div>
  );
};

export default Notification;
