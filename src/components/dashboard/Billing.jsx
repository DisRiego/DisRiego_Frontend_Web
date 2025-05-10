import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import useUserPermissions from "../../hooks/useUserPermissions";
import Head from "./reusable/Head";
import Tab from "./reusable/Tab";
import Search from "./reusable/Search";
import Filter from "./reusable/Filter";
import Table from "./reusable/Table";
import Pagination from "./reusable/Pagination";
import Message from "../Message";
import { jsPDF } from "jspdf";
import Icon from "../../assets/icons/Disriego_title.png";
import { autoTable } from "jspdf-autotable";
import RobotoNormalFont from "../../assets/fonts/Roboto-Regular.ttf";
import RobotoBoldFont from "../../assets/fonts/Roboto-Bold.ttf";

const Billing = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState("");
  const [loadingTable, setLoadingTable] = useState(false);
  const [loadingReport, setLoadingReport] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const itemsPerPage = 5;

  const {
    permissions: permissionsUser,
    token,
    decodedToken,
  } = useUserPermissions();
  const hasPermission = (permission) => permissionsUser.includes(permission);
  const api_key = import.meta.env.VITE_API_KEY;

  const [filteredData, setFilteredData] = useState([]);
  const [backupData, setBackupData] = useState([]);

  const [showMessage, setShowMessage] = useState(false);
  const [titleMessage, setTitleMessage] = useState(false);
  const [message, setMessage] = useState(false);
  const [status, setStatus] = useState(false);

  const [statusFilter, setStatusFilter] = useState(false);
  const [filters, setFilters] = useState({
    type_devices: {},
    estados: {},
    installation_date: {
      from: "",
      to: "",
    },
  });

  const [id, setId] = useState(null);
  const [dots, setDots] = useState("");
  const totals = useMemo(() => {
    const counts = {
      emitidas: data.length,
      pendientes: 0,
      pagadas: 0,
      vencidas: 0,
    };

    data.forEach((item) => {
      const estado = item.status_name?.toLowerCase();
      if (estado === "pendiente") counts.pendientes += 1;
      else if (estado === "pagada") counts.pagadas += 1;
      else if (estado === "vencida") counts.vencidas += 1;
    });

    return counts;
  }, [data]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const head_data = {
    title: "Gestión de facturación",
    description:
      "En esta sección podrás gestionar y monitorear las facturas y transacciones del sistema.",
    buttons: {
      button1: {
        icon: "LuDownload",
        class: "",
        text: "Descargar reporte",
      },
    },
  };

  const handleButtonClick = async (buttonText) => {
    if (buttonText === "Descargar reporte") {
      try {
        setLoadingReport("is-loading");

        // 1. Obtener datos de empresa y ubicación
        const response = await axios.get(
          import.meta.env.VITE_URI_BACKEND +
            import.meta.env.VITE_ROUTE_BACKEND_COMPANY
        );
        const companyData = response.data.data;

        const locationData = await fetchLocationNames(
          companyData.country,
          companyData.state,
          companyData.city
        );

        const response_2 = await axios.get(
          import.meta.env.VITE_URI_BACKEND +
            import.meta.env.VITE_ROUTE_BACKEND_USERS +
            decodedToken.id
        );
        const userData = response_2.data.data[0];

        // 3. Generar reporte con los datos obtenidos
        generateReport(
          filteredData,
          toTitleCase,
          () => setLoadingReport(""),
          companyData,
          locationData,
          userData
        );
      } catch (error) {
        console.log(error);
        setTitleMessage?.("Error al generar el reporte");
        setMessage?.(
          `No se pudo generar el reporte debido a un problema con el servidor.
          \n Por favor, Inténtelo de nuevo más tarde.`
        );
        setStatus?.("is-false");
        setShowMessage?.(true);
        setLoadingReport("");
      }
    }
  };

  const tabs = [
    {
      key: "billing",
      label: "Facturas",
      path: "/dashboard/billing",
    },
    {
      key: "transaction",
      label: "Transacciones",
      path: "/dashboard/transaction",
    },
  ].filter(Boolean);

  const columns = [
    "N° Factura",
    "ID del predio",
    "ID del lote",
    "Número de documento",
    "Intervalo de pago",
    "Fecha de emisión",
    "Fecha de vencimiento",
    "Valor a pagar",
    "Anexo",
    "Estado",
    "Opciones",
  ];

  const options = [
    {
      icon: "BiShow",
      name: "Ver detalles",
    },
    {
      icon: "TbCoin",
      name: "Pagar",
    },
  ].filter(Boolean);

  useEffect(() => {
    fetchBilling();
  }, []);

  const fetchBilling = async () => {
    try {
      setLoadingTable(true);
      //   const response = await axios.get(
      //     import.meta.env.VITE_URI_BACKEND_MAINTENANCE +
      //       import.meta.env.VITE_ROUTE_BACKEND_REPORT
      //   );
      //   const sortedData = response.data.data.sort((a, b) => b.id - a.id);
      const billing = [
        {
          id: 1,
          property_id: 101,
          lot_id: 5,
          owner_document_number: "1234567890",
          payment_interval_name: "Mensual",
          issue_date: "2025-04-01",
          due_date: "2025-04-30",
          amount_due: 150000,
          attachment: "factura_fac-001.pdf",
          status_name: "Pendiente",
        },
        {
          id: 2,
          property_id: 102,
          lot_id: 8,
          owner_document_number: "9876543210",
          payment_interval_name: "Bimestral",
          issue_date: "2025-04-05",
          due_date: "2025-06-05",
          amount_due: 300000,
          attachment: "factura_fac-002.pdf",
          status_name: "Pagada",
        },
        {
          id: 3,
          property_id: 103,
          lot_id: 2,
          owner_document_number: "1122334455",
          payment_interval_name: "Trimestral",
          issue_date: "2025-03-15",
          due_date: "2025-06-15",
          amount_due: 450000,
          attachment: "factura_fac-003.pdf",
          status_name: "Vencida",
        },
        {
          id: 4,
          property_id: 103,
          lot_id: 2,
          owner_document_number: "1010115909",
          payment_interval_name: "Anual",
          issue_date: "2025-04-01",
          due_date: "2025-04-15",
          amount_due: 50000,
          attachment: "factura_fac-004.pdf",
          status_name: "Vencida",
        },
      ];
      const sortedData = billing.sort((a, b) => b.id - a.id);

      setData(sortedData);
    } catch (error) {
      console.error("Error al obtener las facturas:", error);
    } finally {
      setButtonDisabled(false);
      setLoadingTable(false);
    }
  };

  const fetchLocationNames = async (countryCode, stateCode, cityId) => {
    try {
      const BASE_URL = "https://api.countrystatecity.in/v1";

      const [countryRes, stateRes, cityRes] = await Promise.all([
        axios.get(`${BASE_URL}/countries/${countryCode}`, {
          headers: { "X-CSCAPI-KEY": api_key },
        }),
        axios.get(`${BASE_URL}/countries/${countryCode}/states/${stateCode}`, {
          headers: { "X-CSCAPI-KEY": api_key },
        }),
        axios.get(
          `${BASE_URL}/countries/${countryCode}/states/${stateCode}/cities`,
          {
            headers: { "X-CSCAPI-KEY": api_key },
          }
        ),
      ]);

      const cityName =
        cityRes.data.find((city) => city.id === parseInt(cityId))?.name ||
        "Desconocido";

      return {
        country: countryRes.data.name,
        state: stateRes.data.name,
        city: cityName,
      };
    } catch (error) {
      console.error("Error al obtener nombres de ubicación:", error);
      return {
        country: "Desconocido",
        state: "Desconocido",
        city: "Desconocido",
      };
    }
  };

  useEffect(() => {
    if (!statusFilter) {
      const filtered = data
        .filter((info) =>
          Object.values(info)
            .join(" ")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
        .map((info) => ({
          ID: info.id,
          "N° Factura": info.id,
          "ID del predio": info.property_id,
          "ID del lote": info.lot_id,
          "Número de documento": info.owner_document_number,
          "Intervalo de pago": info.payment_interval_name,
          "Fecha de emisión": info.due_date?.slice(0, 10),
          "Fecha de vencimiento": info.due_date?.slice(0, 10),
          "Valor a pagar": formatCurrency(info.amount_due),
          Anexo: info.attachment,
          Estado: info.status_name,
        }));

      setFilteredData(filtered);
      setBackupData(filtered);
    } else {
      const selectedStates = Object.keys(filters.estados).filter(
        (key) => filters.estados[key]
      );

      if (selectedStates.length > 0) {
        const filteredByState = backupData.filter((info) =>
          selectedStates.includes(info.Estado)
        );
        setFilteredData(filteredByState);
      } else {
        setFilteredData(backupData);
      }

      setStatusFilter(false);
    }
  }, [data, searchTerm, filters.estados]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const toTitleCase = (str) => {
    if (typeof str !== "string") return str;
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <>
      <Head
        head_data={head_data}
        onButtonClick={handleButtonClick}
        loading={loadingReport}
        buttonDisabled={buttonDisabled}
      />
      <Tab tabs={tabs} useLinks={true}></Tab>
      {loadingTable ? (
        <div className="rol-detail">
          <div className="loader-cell">
            <div className="loader cont-loader"></div>
            <p className="loader-text">Cargando información{dots}</p>
          </div>
        </div>
      ) : (
        <>
          <div className="container-cont">
            <div className="total_amount">
              <div className="fixed-grid has-4-cols-desktop has-2-cols-mobile">
                <div className="grid">
                  <div className="cell rol-detail">
                    <p className="has-text-weight-bold mb-2">
                      Total facturas emitidas
                    </p>
                    <p className="is-size-5 has-text-weight-bold">
                      {totals.emitidas}
                    </p>
                  </div>
                  <div className="cell rol-detail">
                    <p className="has-text-weight-bold mb-2">
                      Total facturas pendientes
                    </p>
                    <p className="is-size-5 has-text-weight-bold">
                      {totals.pendientes}
                    </p>
                  </div>
                  <div className="cell rol-detail">
                    <p className="has-text-weight-bold mb-2">
                      Total facturas pagadas
                    </p>
                    <p className="is-size-5 has-text-weight-bold">
                      {totals.pagadas}
                    </p>
                  </div>
                  <div className="cell rol-detail">
                    <p className="has-text-weight-bold mb-2">
                      Total facturas vencidas
                    </p>
                    <p className="is-size-5 has-text-weight-bold">
                      {totals.vencidas}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="columns mb-1">
              <div className="column is-three-quarters">
                <div className="rol-detail"></div>
              </div>
              <div className="column">
                <div className="rol-detail"></div>
              </div>
            </div>
          </div>
          <div className="container-search">
            <Search onSearch={setSearchTerm} buttonDisabled={buttonDisabled} />
            <Filter buttonDisabled={buttonDisabled} />
          </div>
          <Table
            columns={columns}
            data={paginatedData}
            options={options}
            loadingTable={loadingTable}
            setId={setId}
          />
          <Pagination
            totalItems={filteredData.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
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

export default Billing;

const generateReport = (
  filteredData,
  toTitleCase,
  onFinish,
  companyData,
  locationNames,
  userData
) => {
  const doc = new jsPDF("landscape");

  // Add Roboto font to the document
  doc.addFont(RobotoNormalFont, "Roboto", "normal");
  doc.addFont(RobotoBoldFont, "Roboto", "bold");

  //colorear fondo
  doc.setFillColor(243, 242, 247);
  doc.rect(0, 0, 300, 53, "F"); // Colorear una parte de la página

  // Agregar logo
  doc.addImage(Icon, "PNG", 246, 10, 39, 11);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(17);
  doc.setFont("Roboto", "bold");
  doc.text("CONSOLIDADOS DE FACTURAS", 12, 18);
  doc.setFontSize(11);
  doc.text(`Fecha de generación:`, 12, 27);
  doc.text(`Generado por:`, 12, 39);
  /*doc.setTextColor(94, 100, 112);*/
  doc.text("Facturas actuales en el sistema", 12, 63);

  doc.setTextColor(94, 100, 112);
  doc.setFont("Roboto", "normal");
  doc.setFontSize(10);
  doc.text(`${new Date().toLocaleString()}`, 12, 32);
  doc.text(
    [userData?.name, userData?.first_last_name, userData?.second_last_name]
      .filter(Boolean) // Elimina null, undefined y strings vacíos
      .join(" "),
    12,
    44
  );

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont("Roboto", "bold");
  doc.text(`Dirección de la empresa:`, 285, 27, { align: "right" });
  doc.text(`Correo electrónico de la empresa:`, 285, 39, { align: "right" });

  doc.setTextColor(94, 100, 112);
  doc.setFont("Roboto", "normal");
  doc.setFontSize(10);
  doc.text(
    `${companyData.address}. ${locationNames.state}, ${locationNames.city}`,
    285,
    32,
    { align: "right" }
  );

  doc.text(`${companyData.email}`, 285, 44, { align: "right" });
  doc.text(`Cantidad de facturas: ${filteredData.length}`, 12, 68);

  // Resto de cosas del PDF
  autoTable(doc, {
    startY: 80,
    margin: { left: 12 },
    head: [
      [
        "N° Factura",
        "ID del predio",
        "ID del lote",
        "Número de documento",
        "Intervalo de pago",
        "Fecha de emisión",
        "Fecha de vencimiento",
        "Valor a pagar",
        "Estado",
      ],
    ],
    body: filteredData.map((bill) => [
      bill["N° Factura"],
      bill["ID del predio"],
      bill["ID del lote"],
      bill["Número de documento"],
      bill["Intervalo de pago"],
      bill["Fecha de emisión"],
      bill["Fecha de vencimiento"],
      bill["Valor a pagar"],
      bill["Estado"],
    ]),

    theme: "grid",
    headStyles: {
      fillColor: [252, 252, 253],
      textColor: [0, 0, 0],
      fontStyle: "bold",
      lineColor: [234, 236, 240],
      lineWidth: 0.5,
      font: "Roboto", // Add Roboto font to table headers
    },
    bodyStyles: {
      textColor: [89, 89, 89],
      font: "Roboto", // Add Roboto font to table body
    },
    styles: {
      fontSize: 10,
      cellPadding: 3,
      lineColor: [234, 236, 240],
    },
  });

  //Pie de pagina
  doc.addImage(Icon, "PNG", 12, 190, 32, 9);

  // Agregar numeración de páginas en el pie de página
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);

    doc.setFont("Roboto", "normal"); // Set Roboto font for page numbers
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.text(`Página ${i}/${pageCount}`, pageWidth - 10, pageHeight - 10, {
      align: "right",
    });
  }

  // Convertir el PDF a un Blob
  const pdfBlob = doc.output("blob");

  // Crear una URL del Blob
  const pdfUrl = URL.createObjectURL(pdfBlob);

  // Abrir el PDF en una nueva pestaña
  setTimeout(() => {
    window.open(pdfUrl, "_blank");
    onFinish();
  }, 500);
};
