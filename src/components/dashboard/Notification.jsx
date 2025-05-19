import { useEffect, useRef, useState } from "react";
import axios from "axios";
import useUserPermissions from "../../hooks/useUserPermissions";
import Head from "./reusable/Head";
import Tab from "./reusable/Tab";
import Confirm_modal from "./reusable/Confirm_modal";
import Message from "../Message";
import { SlOptions } from "react-icons/sl";
import { MdDownloadDone } from "react-icons/md";
import { jwtDecode } from "jwt-decode";
import {
  format,
  isToday,
  isYesterday,
  differenceInDays,
  formatDistanceToNow,
} from "date-fns";
import { es } from "date-fns/locale";

const formatRelativeDate = (isoDate) => {
  const date = new Date(isoDate);

  if (isToday(date)) return "Hoy";
  if (isYesterday(date)) return "Ayer";

  const diffDays = differenceInDays(new Date(), date);

  if (diffDays < 7) return `Hace ${diffDays} días`;
  if (diffDays < 14) return "Hace una semana";
  if (diffDays < 21) return "Hace dos semanas";
  if (diffDays < 30) return "Hace tres semanas";
  if (diffDays < 60) return "Hace un mes";

  return formatDistanceToNow(date, { addSuffix: true, locale: es });
};

const DateSeparator = ({ date }) => (
  <div className="date-separator">
    <hr />
    <span className="date-tag">{date}</span>
    <hr />
  </div>
);

const Notification = () => {
  const [dots, setDots] = useState("");
  const [data, setData] = useState([]);
  const [activeRow, setActiveRow] = useState(null);
  const [loadingTable, setLoadingTable] = useState(false);
  const menuRefs = useRef({});
  let shownDates = new Set();

  const {
    permissions: permissionsUser,
    token,
    decodedToken,
  } = useUserPermissions();
  const hasPermission = (permission) => permissionsUser.includes(permission);

  const [visibleData, setVisibleData] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const bottomRef = useRef(null);

  const [showConfirm, setShowConfirm] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [titleMessage, setTitleMessage] = useState(false);
  const [message, setMessage] = useState(false);
  const [status, setStatus] = useState(false);
  const [confirMessage, setConfirMessage] = useState();
  const [method, setMethod] = useState();
  const [uriPost, setUriPost] = useState("");
  const [loading, setLoading] = useState("");
  const [typeForm, setTypeForm] = useState(true);

  const [notifToUpdate, setNotifToUpdate] = useState(null);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  const feedbackMessages = {
    read: {
      successTitle: "Notificación marcada como leída exitosamente",
      successMessage: "Se ha marcado como leída la notificación.",
      errorTitle: "Error al marcar como leída la notificación",
      errorMessage:
        "No se pudo marcar como leída la notificación. Por favor, inténtelo de nuevo.",
    },
    read_all: {
      successTitle: "Notificaciones marcadas como leídas exitosamente",
      successMessage: "Se han marcado como leídas todas las notificaciones.",
      errorTitle: "Error al marcar como leídas las notificaciones",
      errorMessage:
        "No se pudo marcar como leídas las notificaciones. Por favor, inténtelo de nuevo.",
    },
  };

  const head_data_notification = {
    title: "Notificaciones",
    description:
      "En esta sección puedes gestionar las notificaciones generadas por la plataforma.",
    buttons: {
      ...(hasPermission("Marcar como leídas todas las notificaciones") &&
        hasUnreadNotifications && {
          button1: {
            icon: "MdDownloadDone",
            class: "color-hover",
            text: "Marcar todo como leido",
          },
        }),
    },
  };

  const tabs = [
    hasPermission("Ver notificaciones") && {
      key: "notification",
      label: "Notificaciones",
      path: "/dashboard/notification",
    },
    (hasPermission("Ver todas las solicitudes") ||
      hasPermission("Ver todas las solicitudes de un usuario")) && {
      key: "request",
      label: "Solicitudes",
      path: "/dashboard/request",
    },
  ].filter(Boolean);

  const options = [
    hasPermission("Marcar como leída una notificación") && {
      icon: MdDownloadDone,
      name: "Marcar como leído",
    },
  ].filter(Boolean);

  const handleButtonClick = (buttonText) => {
    if (buttonText === "Marcar todo como leido") {
      const decode = jwtDecode(token);
      setConfirMessage("¿Desea marcar como leídas todas las notificaciones?");
      setMethod("put");
      setUriPost(
        import.meta.env.VITE_URI_BACKEND_IOT +
          import.meta.env.VITE_ROUTE_BACKEND_NOTIFICACTION +
          decode.id +
          import.meta.env.VITE_ROUTE_BACKEND_NOTIFICACTION_READ_ALL
      );
      setTypeForm("read_all");
      setShowConfirm(true);
    }
  };

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  useEffect(() => {
    let intervalId;

    if (loadingTable) {
      intervalId = setInterval(() => {
        setDots((prev) => (prev.length < 3 ? prev + "." : ""));
      }, 500);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [loadingTable]);

  const handleOption = (option, notif) => {
    if (option.name === "Marcar como leído") {
      setNotifToUpdate(notif.id);
      setConfirMessage("¿Desea marcar como leída la notificación?");
      setMethod("put");
      setUriPost(
        import.meta.env.VITE_URI_BACKEND_IOT +
          import.meta.env.VITE_ROUTE_BACKEND_NOTIFICACTION_BASE +
          notif.id +
          import.meta.env.VITE_ROUTE_BACKEND_NOTIFICACTION_READ
      );
      setTypeForm("read");
      setShowConfirm(true);
    }
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
    if (token && hasPermission("Ver notificaciones")) {
      getNotificaction();
    }
  }, [token, permissionsUser]);

  const getNotificaction = async () => {
    try {
      setLoadingTable(true);
      const decode = jwtDecode(token);
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND_IOT +
          import.meta.env.VITE_ROUTE_BACKEND_NOTIFICACTION +
          decode.id
      );

      const sortedData = response.data.data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      setData(sortedData);
      setHasUnreadNotifications(sortedData.some((notif) => !notif.read));
      setPage(1);
      setLoadingTable(false);
    } catch (error) {
      console.error("Error al obtener los tipos de dispositivos", error);
    }
  };

  useEffect(() => {
    setVisibleData(data.slice(0, page * pageSize));
  }, [data, page]);

  useEffect(() => {
    if (!bottomRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && page * pageSize < data.length) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    observer.observe(bottomRef.current);

    return () => {
      if (bottomRef.current) observer.unobserve(bottomRef.current);
    };
  }, [bottomRef.current, data, page]);

  const formatHour = (isoDate) => {
    const date = new Date(isoDate);
    return format(date, "hh:mm a").toLowerCase();
  };

  const updateData = async () => {
    getNotificaction();
  };

  const markAsReadLocally = (notifId) => {
    setData((prevData) =>
      prevData.map((notif) =>
        notif.id === notifId ? { ...notif, read: true } : notif
      )
    );
    setActiveRow(null);
  };

  return (
    <>
      <Head
        head_data={head_data_notification}
        onButtonClick={handleButtonClick}
      />
      <Tab tabs={tabs} useLinks={true} />

      <div>
        {loadingTable ? (
          <div className="rol-detail">
            <p className="has-text-centered">Cargando información{dots}</p>
          </div>
        ) : data.length === 0 ? (
          <div className="rol-detail">
            <p className="has-text-centered">
              No hay notificaciones disponibles.
            </p>
          </div>
        ) : (
          <>
            {visibleData.map((notif) => {
              const relativeDate = formatRelativeDate(notif.created_at);
              const shouldShowSeparator = !shownDates.has(relativeDate);
              if (shouldShowSeparator) shownDates.add(relativeDate);

              return (
                <div key={notif.id}>
                  {shouldShowSeparator && <DateSeparator date={relativeDate} />}

                  <div
                    className={`rol-detail notification-item ${
                      notif.read ? "notification-read" : ""
                    }`}
                  >
                    <article className="media is-align-items-center">
                      <div className="media-content">
                        <p>
                          <strong>{notif.title}</strong>
                          <br />
                          <small>{notif.message}</small>
                        </p>
                      </div>
                      <div className="media-right">
                        <div
                          className="is-flex is-flex-direction-column"
                          style={{ position: "relative" }}
                        >
                          <small className="has-text-centered">
                            {formatHour(notif.created_at)}
                          </small>
                          {!notif.read && (
                            <div className="is-flex is-justify-content-end">
                              <button
                                className="button is-small button-option"
                                onClick={() => handleClick(notif.id)}
                              >
                                <SlOptions />
                              </button>
                            </div>
                          )}

                          {!notif.read && activeRow === notif.id && (
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
              );
            })}
            {page * pageSize < data.length && (
              <div className="rol-detail">
                <p className="has-text-centered mt-3">
                  Cargando más notificaciones{dots}
                </p>
              </div>
            )}

            <div ref={bottomRef}></div>
          </>
        )}
      </div>
      {showConfirm && (
        <Confirm_modal
          onClose={() => {
            setShowConfirm(false);
          }}
          onSuccess={() => {
            markAsReadLocally(notifToUpdate);
            setShowConfirm(false);
          }}
          confirMessage={confirMessage}
          method={method}
          setShowMessage={setShowMessage}
          setTitleMessage={setTitleMessage}
          setMessage={setMessage}
          setStatus={setStatus}
          updateData={updateData}
          uriPost={uriPost}
          typeForm={typeForm}
          loading={loading}
          setLoading={setLoading}
          feedbackMessages={feedbackMessages}
        />
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

export default Notification;
