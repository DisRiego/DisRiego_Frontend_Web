import { useEffect, useRef, useState } from "react";
import Head from "./Head";
import Tab from "./Tab";
import { SlOptions } from "react-icons/sl";
import { BiShow } from "react-icons/bi";
import { MdDownloadDone } from "react-icons/md";

const DateSeparator = ({ date }) => (
  <div className="date-separator">
    <hr />
    <span className="date-tag">{date}</span>
    <hr />
  </div>
);

const Notification = () => {
  const [data, setData] = useState([]);
  const [activeRow, setActiveRow] = useState(null);
  const menuRefs = useRef({}); // Guardamos refs para cada dropdown

  const head_data_notification = {
    title: "Notificaciones",
    description:
      "En esta sección puedes gestionar las notificaciones generadas por la plataforma.",
    buttons: {
      button1: {
        icon: "MdDownloadDone",
        class: "color-hover",
        text: "Marcar todo como leido",
      },
    },
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

  const options = [
    { icon: BiShow, name: "Ver detalles" },
    { icon: MdDownloadDone, name: "Marcar como leído" },
  ];

  const handleButtonClick = (buttonText) => {
    if (buttonText === "Marcar todo como leido") {
      console.log("Marcar todas como leídas");
    }
  };

  const handleOption = (option, notif) => {
    console.log("Opción:", option.name, "para:", notif);
  };

  const handleClick = (rowId) => {
    setActiveRow((prev) => (prev === rowId ? null : rowId));
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        Object.values(menuRefs.current).some(
          (ref) => ref && ref.contains(event.target)
        )
      )
        return;

      if (!event.target.closest(".button-option")) {
        setActiveRow(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    const notification = [
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
        time: "Hola mundo",
        avatar: "https://cdn-icons-png.flaticon.com/512/3135/3135768.png",
      },
    ];
    setData(notification);
  }, []);

  return (
    <>
      <Head
        head_data={head_data_notification}
        onButtonClick={handleButtonClick}
      />
      <Tab tabs={tabs} useLinks={true} />

      <div>
        {data.length === 0 ? (
          <p className="has-text-centered">
            No hay notificaciones disponibles.
          </p>
        ) : (
          data.map((notif) => (
            <div key={notif.id}>
              <DateSeparator date={notif.date} />
              <div className="rol-detail notification-item">
                <article className="media is-align-items-center">
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
                    <div
                      className="is-flex is-flex-direction-column"
                      style={{ position: "relative" }}
                    >
                      <small className="has-text-centered">{notif.time}</small>
                      <div className="is-flex is-justify-content-end">
                        <button
                          className="button is-small button-option"
                          onClick={() => handleClick(notif.id)}
                        >
                          <SlOptions />
                        </button>
                      </div>

                      {activeRow === notif.id && (
                        <div
                          className="menu-option-notification"
                          ref={(el) => (menuRefs.current[notif.id] = el)}
                        >
                          <div className="box">
                            {options.map((option, index) => (
                              <button
                                key={index}
                                className="button is-fullwidth"
                                onClick={() => handleOption(option, notif)}
                              >
                                <span className="icon">
                                  <option.icon />
                                </span>
                                <span>{option.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Notification;
