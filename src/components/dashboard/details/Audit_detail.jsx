import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Head from "../reusable/Head";
import { TbPointFilled } from "react-icons/tb";

const Audit_detail = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [dots, setDots] = useState("");

  const head_data = {
    title: `Detalles del evento #${id}`,
    description:
      "En esta sección, podrás visualizar la información de un evento.",
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    getEvent();
  }, []);

  const getEvent = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND_FACTURACTION +
          import.meta.env.VITE_ROUTE_BACKEND_INVOICE_DETAIL +
          id
      );
      const sortedData = response.data.data;
      setData(sortedData.concepts);
      setButtonDisabled(false);
      // setBank(sortedData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error al obtener los bancos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toTitleCase = (str) => {
    if (typeof str !== "string") return str;
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <>
      <Head className="mb-3" head_data={head_data} />
      <div className="rol-detail mb-4">
        <div className="is-flex is-justify-content-space-between is-align-items-center">
          <h3 className="title is-6 mb-0">Estado actual</h3>
          <span className={`button detail-status-${data?.status_name}`}>
            <TbPointFilled />
            {toTitleCase(data?.status_name)}
          </span>
        </div>
      </div>
      <div className="rol-detail mb-4">
        <div className="fixed-grid has-2-cols-desktop has-1-cols-mobile">
          <div className="grid">
            <div className="cell">
              <p className="has-text-weight-bold">Nombre del evento</p>
              <p>[]</p>
            </div>
            <div className="cell">
              <p className="has-text-weight-bold">Descripción del evento</p>
              <p>[]</p>
            </div>
            <div className="cell">
              <p className="has-text-weight-bold">Modulo afectado</p>
              <p>[]</p>
            </div>
            <div className="cell">
              <p className="has-text-weight-bold">Fecha del evento</p>
              <p>[]</p>
            </div>
          </div>
        </div>
      </div>
      <div className="rol-detail mb-4">
        <h3 className="title is-6 mb-4">Información del usuario</h3>

        <div className="fixed-grid has-2-cols-desktop has-1-cols-mobile">
          <div className="grid">
            <div className="cell">
              <p className="has-text-weight-bold">Nombre</p>
              <p>[]</p>
            </div>
            <div className="cell">
              <p className="has-text-weight-bold">Número de documento</p>
              <p>[]</p>
            </div>
            <div className="cell">
              <p className="has-text-weight-bold">Correo electrónico</p>
              <p>[]</p>
            </div>
            <div className="cell">
              <p className="has-text-weight-bold">Nùmero de celular</p>
              <p>[]</p>
            </div>
            <div className="cell">
              <p className="has-text-weight-bold">Dirección IP</p>
              <p>[]</p>
            </div>
            <div className="cell">
              <p className="has-text-weight-bold">Rol</p>
              <p>[]</p>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed-grid has-2-cols-desktop has-1-cols-mobile">
        <div className="grid">
          <div className="cell rol-detail">
            <h3 className="title is-6 mb-4">Información antes del evento</h3>
            <div className="rol-detail">
              <div className="columns is-multiline is-mobile">
                <div className="column column-p0">
                  Nombre del campo afectado
                </div>
                <div className="column column-p0">[]</div>
              </div>
              <div className="columns is-multiline is-mobile">
                <div className="column column-p0">
                  Informacion del campo afectado
                </div>
                <div className="column">[]</div>
              </div>
            </div>
          </div>
          <div className="cell rol-detail">
            <h3 className="title is-6 mb-4">Información después del evento</h3>
            <div className="rol-detail">
              <div className="columns is-multiline is-mobile">
                <div className="column column-p0">
                  Nombre del campo afectado
                </div>
                <div className="column column-p0">[]</div>
              </div>
              <div className="columns is-multiline is-mobile">
                <div className="column column-p0">
                  Informacion del campo afectado
                </div>
                <div className="column">[]</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Audit_detail;
