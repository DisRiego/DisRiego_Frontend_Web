import { useEffect, useState } from "react";
import { data, useParams } from "react-router-dom";
import axios from "axios";
import Head from "../reusable/Head";
import { format, set } from "date-fns";

const Transaction_detail = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({});
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [dots, setDots] = useState("");
  const [loading, setLoading] = useState("");
  const [loadingTable, setLoadingTable] = useState(false);

  const head_data = {
    title: `Detalles de la Transacción #${id}`,
    description:
      "En esta sección, encontrarás la información detallada de la transacción.",
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    getPayment();
  }, []);

  const getPayment = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND_FACTURACTION +
          import.meta.env.VITE_ROUTE_BACKEND_PAYMENT_DETAIL +
          id
      );
      const sortedData = response.data.data;
      setData(sortedData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error al obtener los bancos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const toTitleCase = (str) => {
    if (typeof str !== "string") return str;
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return format(date, "yyyy-MM-dd, hh:mm a").toLowerCase();
  };

  return (
    <>
      <Head className="mb-3" head_data={head_data} />
      {isLoading ? (
        <div className="rol-detail">
          <div className="loader-cell">
            <div className="loader cont-loader"></div>
            <p className="loader-text">Cargando información{dots}</p>
          </div>
        </div>
      ) : (
        <>
          <div className="rol-detail mb-4">
            <div className="fixed-grid has-4-cols-desktop has-2-cols-mobile">
              <div className="grid">
                <div className="cell">
                  <p className="has-text-weight-bold">Método de pago</p>
                  <p>{data?.payment_method}</p>
                </div>
                <div className="cell">
                  <p className="has-text-weight-bold">Nombre del titular</p>
                  <p>{toTitleCase(data?.payer_name)}</p>
                </div>
                <div className="cell">
                  <p className="has-text-weight-bold">
                    Valor de la transacción
                  </p>
                  <p>{formatCurrency([data?.transaction_amount])}</p>
                </div>
                <div className="cell">
                  <p className={`has-text-weight-bold`}>Estado</p>
                  <span
                    className={`status-${data?.payment_status_name.toLowerCase()}`}
                  >
                    {data?.payment_status_name}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="fixed-grid has-2-cols-desktop has-1-cols-mobile">
            <div className="grid">
              <div className="cell rol-detail">
                <h3 className="title is-6 mb-2">
                  Información de la factura y del pago
                </h3>
                <div className="columns is-multiline is-mobile">
                  <div className="column column-p0">ID de la factura</div>
                  <div className="column column-p0">{data?.invoice_id}</div>
                </div>
                <div className="columns is-multiline is-mobile">
                  <div className="column column-p0">Código de la Factura</div>
                  <div className="column column-p0">{data?.reference_code}</div>
                </div>
                <div className="columns is-multiline is-mobile">
                  <div className="column column-p0">Fecha del pago</div>
                  <div className="column column-p0">
                    {formatDateTime(toTitleCase(data?.payment_date))}
                  </div>
                </div>
                <div className="columns is-multiline is-mobile">
                  <div className="column">Referencia del pago</div>
                  <div className="column">{data?.transaction_id}</div>
                </div>
              </div>
              <div className="cell rol-detail">
                <h3 className="title is-6 mb-2">
                  Información del lote y el usuario
                </h3>
                <div className="columns is-multiline is-mobile">
                  <div className="column column-p0">ID del predio</div>
                  <div className="column column-p0">
                    {toTitleCase(data?.property_id)}
                  </div>
                </div>
                <div className="columns is-multiline is-mobile">
                  <div className="column column-p0">ID del lote</div>
                  <div className="column column-p0">{data?.lot_id}</div>
                </div>
                <div className="columns is-multiline is-mobile">
                  <div className="column column-p0">No. Documento</div>
                  <div className="column column-p0">{data?.payer_document}</div>
                </div>
                <div className="columns is-multiline is-mobile">
                  <div className="column column">Correo electrónico</div>
                  <div className="column column">{data?.payer_email}</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Transaction_detail;
