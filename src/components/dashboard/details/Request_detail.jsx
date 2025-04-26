import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import useUserPermissions from "../../../hooks/useUserPermissions";
import Head from "../reusable/Head";
import Message from "../../Message";
import Change_status_request from "../Status/Change_status_request";
import Form_request_reject from "../forms/adds/Form_request_reject";
import { TbPointFilled } from "react-icons/tb";
import { format } from "date-fns";

const Request_detail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dots, setDots] = useState("");

  const [title, setTitle] = useState();
  const [typeForm, setTypeForm] = useState();
  const [showChangeStatus, setShowChangeStatus] = useState(false);
  const [showFormReject, setShowFormReject] = useState(false);
  const [confirMessage, setConfirMessage] = useState();
  const [loading, setLoading] = useState("");

  const [showMessage, setShowMessage] = useState(false);
  const [titleMessage, setTitleMessage] = useState(false);
  const [message, setMessage] = useState(false);
  const [status, setStatus] = useState(false);

  const {
    permissions: permissionsUser,
    token,
    decodedToken,
  } = useUserPermissions();
  const hasPermission = (permission) => permissionsUser.includes(permission);

  const handleButtonClick = (buttonText) => {
    if (buttonText === "Aprobar solicitud") {
      setConfirMessage(`¿Desea aprobar la solicitud con ID "${id}"?`);
      setTypeForm("aprobar");
      setShowChangeStatus(true);
    }

    if (buttonText === "Denegar solicitud") {
      setTitle("Denegar solicitud");
      setTypeForm("denegar");
      setShowFormReject(true);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);
    return () => clearInterval(interval);
  }, []);

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
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND_IOT +
          import.meta.env.VITE_ROUTE_BACKEND_REQUEST +
          id
      );
      setData(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.log("Error al obtener rol:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateData = async () => {
    setIsLoading(true);
    getRequest();
  };

  const head_data = {
    title: "Ver Detalles de la Solicitud #" + id,
    description:
      "En esta sección, puedes consultar la información de la solicitud.",
    ...(data?.status == 18 && {
      buttons: {
        ...(hasPermission("Aprobar solicitud") && {
          button1: {
            class: "aprrove",
            text: "Aprobar solicitud",
          },
        }),
        ...(hasPermission("Denegar solicitud") && {
          button2: {
            class: "deny",
            text: "Denegar solicitud",
          },
        }),
      },
    }),
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return format(date, "yyyy-MM-dd, hh:mm a").toLowerCase();
  };

  return (
    <div>
      <Head
        className="mb-3"
        head_data={head_data}
        onButtonClick={handleButtonClick}
      />

      {isLoading ? (
        <div className="rol-detail">
          <div className="loader-cell">
            <div className="loader cont-loader"></div>
            <p className="loader-text">Cargando información{dots}</p>
          </div>
        </div>
      ) : (
        <>
          {/* Información del rol */}
          <div className="rol-detail">
            <div className="is-flex is-justify-content-space-between is-align-items-center">
              <h3 className="title is-6">Estado actual</h3>
              <span className={`button detail-status status-${data.status}`}>
                <TbPointFilled />
                {data?.status_name ?? ""}
              </span>
            </div>
            <div className="columns">
              <div className="column">
                <h3 className="title is-6 mb-2">Información del predio</h3>
                <p>
                  <strong>ID del Predio: </strong>
                  {data?.property_id}
                </p>
                <p>
                  <strong>Nombre del Predio: </strong>
                  {data?.property_name}
                </p>
              </div>
              <div className="column">
                <h3 className="title is-6 mb-2">Información del lote</h3>
                <p>
                  <strong>ID del lote: </strong>
                  {data?.lot_id}
                </p>
                <p>
                  <strong>Nombre del lote: </strong>
                  {data?.lot_name}
                </p>
              </div>
            </div>
          </div>

          <div className="rol-detail">
            <div className="columns">
              <div className="column">
                <h3 className="title is-6 mb-2">ID de la válvula</h3>
                <p>{data?.device_iot_id ?? ""}</p>
              </div>
              <div className="column">
                <h3 className="title is-6 mb-2">Tipo de apertura</h3>
                <p>{data?.request_type_name ?? ""}</p>
              </div>
            </div>
            <div className="columns">
              <div className="column">
                <h3 className="title is-6 mb-2">Fecha de apertura</h3>
                <p>{formatDateTime(data?.open_date)}</p>
              </div>
              <div className="column">
                <h3 className="title is-6 mb-2">Fecha de cierre</h3>
                <p>{formatDateTime(data?.close_date)}</p>
              </div>
            </div>
          </div>
          {![17, 18].includes(data.status) &&
            data.rejection_reason_name &&
            data.rejection_comment && (
              <div className="rol-detail">
                <div className="level">
                  <h3 className="title is-6 margin-bottom">
                    Información del rechazo
                  </h3>
                </div>
                <div className="columns">
                  <div className="column">
                    <h3 className="title is-6 mb-2">Motivo</h3>
                    <p>{data?.rejection_reason_name}</p>
                  </div>
                  <div className="column">
                    <h3 className="title is-6 mb-2">Descripción</h3>
                    <p>{data?.rejection_comment}</p>
                  </div>
                </div>
              </div>
            )}
        </>
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
      {showFormReject && (
        <>
          <Form_request_reject
            title={title}
            onClose={() => setShowFormReject(false)}
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
      {showMessage && (
        <Message
          titleMessage={titleMessage}
          message={message}
          status={status}
          onClose={() => setShowMessage(false)}
        />
      )}
    </div>
  );
};

export default Request_detail;
