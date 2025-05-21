import { useEffect, useState } from "react";
import { data, useParams } from "react-router-dom";
import axios from "axios";
import Head from "../reusable/Head";
import Table from "../reusable/Table";

const Billing_detail = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({});
  const [dataInvoice, setDataInvoice] = useState();
  const [dataPayment, setDataPayment] = useState();
  const [dataConcept, setDataConcept] = useState([]);
  const [filteredConcept, setFilteredConcept] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dots, setDots] = useState("");
  const [loading, setLoading] = useState("");
  const [loadingTable, setLoadingTable] = useState(false);
  const [loadingReport, setLoadingReport] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const head_data = {
    title: `Detalles de la Factura #${id}`,
    description:
      "En esta sección, encontrarás la información de la factura generada.",
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
      setLoadingReport("is-loading");

      setTimeout(() => {
        setLoadingReport("");
        window.open(dataInvoice.pdf_url, "_blank");
      }, 1000);
    }
  };

  const columns = [
    "Concepto",
    "Descripción",
    "Valor unitario",
    "Cantidad",
    "Valor total",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    getInvoice();
  }, []);

  const getInvoice = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND_FACTURACTION +
          import.meta.env.VITE_ROUTE_BACKEND_INVOICE_DETAIL +
          id
      );
      const sortedData = response.data.data;
      console.log(sortedData);
      setDataInvoice(sortedData.invoice);
      setDataPayment(sortedData.payment);
      setDataConcept(sortedData.concepts);
      setButtonDisabled(false);
      // setBank(sortedData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error al obtener los bancos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (dataConcept) {
      const filtered = dataConcept
        .filter((info) => Object.values(info).join(" ").toLowerCase())
        .map((info) => ({
          ID: info?.concept_id,
          Concepto: info?.nombre,
          Descripción: info?.descripcion,
          "Valor unitario": info?.valor_unitario,
          Cantidad: info?.cantidad,
          "Valor total": info?.total_concepto,
        }));

      setFilteredConcept(filtered);
    }
  }, [dataConcept]);

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

  return (
    <>
      <Head
        className="mb-3"
        head_data={head_data}
        onButtonClick={handleButtonClick}
        loading={loadingReport}
        buttonDisabled={buttonDisabled}
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
          <div className="rol-detail mb-4">
            <div className="fixed-grid has-4-cols-desktop has-2-cols-mobile">
              <div className="grid">
                <div className="cell">
                  <p className="has-text-weight-bold">Método de pago</p>
                  <p>{dataPayment?.payment_method}</p>
                </div>
                <div className="cell">
                  <p className="has-text-weight-bold">Referencia de pago</p>
                  <p>{dataPayment?.transaction_id}</p>
                </div>
                <div className="cell">
                  <p className="has-text-weight-bold">
                    Valor de la transacción
                  </p>
                  <p>{formatCurrency(dataPayment?.transaction_amount)}</p>
                </div>
                <div className="cell">
                  <p className="has-text-weight-bold">Fecha de pago</p>
                  <p>{dataPayment?.payment_date?.slice(0, 10)}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="fixed-grid has-2-cols-desktop has-1-cols-mobile">
            <div className="grid">
              <div className="cell rol-detail">
                <div className="columns is-multiline is-mobile">
                  <div className="column column-p0">Código de la Factura</div>
                  <div className="column column-p0">
                    {dataInvoice?.reference_code}
                  </div>
                </div>
                <div className="columns is-multiline is-mobile">
                  <div className="column column-p0">Fecha de emisión</div>
                  <div className="column column-p0">
                    {dataInvoice?.issuance_date?.slice(0, 10)}
                  </div>
                </div>
                <div className="columns is-multiline is-mobile">
                  <div className="column column-p0">Fecha de vencimiento</div>
                  <div className="column column-p0">
                    {dataInvoice?.expiration_date?.slice(0, 10)}
                  </div>
                </div>
                <div className="columns is-multiline is-mobile">
                  <div className="column column-p0">
                    Periodo facturado (días)
                  </div>
                  <div className="column column-p0">
                    {dataInvoice?.invoiced_period}
                  </div>
                </div>
                <div className="columns is-multiline is-mobile">
                  <div className="column">Total a pagar</div>
                  <div className="column">
                    {formatCurrency(dataInvoice?.total_amount)}
                  </div>
                </div>
              </div>
              <div className="cell rol-detail">
                <div className="columns is-multiline is-mobile">
                  <div className="column column-p0">Nombre del usuario</div>
                  <div className="column column-p0">
                    {toTitleCase(dataInvoice?.client_name)}
                  </div>
                </div>
                <div className="columns is-multiline is-mobile">
                  <div className="column column-p0">No. Documento</div>
                  <div className="column column-p0">
                    {dataInvoice?.client_document}
                  </div>
                </div>
                <div className="columns is-multiline is-mobile">
                  <div className="column column-p0">Correo electrónico</div>
                  <div className="column column-p0">
                    {dataInvoice?.client_email}
                  </div>
                </div>
                <div className="columns is-multiline is-mobile">
                  <div className="column column-p0">ID del predio</div>
                  <div className="column column-p0">
                    {dataInvoice?.property_id}
                  </div>
                </div>
                <div className="columns is-multiline is-mobile">
                  <div className="column">ID del lote</div>
                  <div className="column">{dataInvoice?.lot_id}</div>
                </div>
              </div>
            </div>
          </div>
          <Table
            columns={columns}
            data={filteredConcept}
            loadingTable={loadingTable}
          />
        </>
      )}
    </>
  );
};

export default Billing_detail;
