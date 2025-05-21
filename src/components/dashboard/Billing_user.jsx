import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import useUserPermissions from "../../hooks/useUserPermissions";
import Head from "./reusable/Head";
import Search from "./reusable/Search";
import Filter from "./reusable/Filter";
import Table from "./reusable/Table";
import Pagination from "./reusable/Pagination";
import Message from "../Message";
import { jsPDF } from "jspdf";
import Icon from "../../assets/icons/Disriego_title.png";
import { autoTable } from "jspdf-autotable";
import html2canvas from "html2canvas";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import RobotoNormalFont from "../../assets/fonts/Roboto-Regular.ttf";
import RobotoBoldFont from "../../assets/fonts/Roboto-Bold.ttf";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Billing_user = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState("");
  const [loadingTable, setLoadingTable] = useState(false);
  const [loadingReport, setLoadingReport] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const itemsPerPage = 5;

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

  const {
    permissions: permissionsUser,
    token,
    decodedToken,
  } = useUserPermissions();
  const hasPermission = (permission) => permissionsUser.includes(permission);
  const api_key = import.meta.env.VITE_API_KEY;

  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);

  const barContainerRef = useRef(null);
  const donutContainerRef = useRef(null);
  const cardsContainerRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const head_data = {
    title: "Mis facturas y pagos",
    description:
      "En esta sección podrás gestionar el estado de tus facturas y realizar pagos.",
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

        //datos de empresa y ubicación
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

        // Capturar las imágenes de los componentes
        const html2canvas = (await import("html2canvas")).default;

        // Capturar el contenedor de la gráfica de barras
        const barCanvas = await html2canvas(barContainerRef.current, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: null,
        });
        const barImage = barCanvas.toDataURL("image/png");

        // Capturar el contenedor de la gráfica de dona
        const donutCanvas = await html2canvas(donutContainerRef.current, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: null,
        });
        const donutImage = donutCanvas.toDataURL("image/png");

        // se Preparan los datos de las imágenes con sus proporciones
        const imagesData = {
          bar: {
            image: barImage,
            aspectRatio: barCanvas.width / barCanvas.height,
          },
          donut: {
            image: donutImage,
            aspectRatio: donutCanvas.width / donutCanvas.height,
          },
        };

        // Generar el reporte con los datos obtenidos
        generateReportWithCharts(
          filteredData,
          toTitleCase,
          imagesData,
          companyData,
          locationData,
          userData,
          () => setLoadingReport("")
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

  const columns = [
    "N° Factura",
    "Nombre del predio",
    "Nombre del lote",
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
    if (token) {
      fetchBilling();
    }
  }, [token]);

  const fetchBilling = async () => {
    try {
      setLoadingTable(true);
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND_FACTURACTION +
          import.meta.env.VITE_ROUTE_BACKEND_GET_INVOICES_BY_USER +
          decodedToken.id +
          import.meta.env.VITE_ROUTE_BACKEND_GET_INVOICES_BY_USER_LATEST
      );

      const sortedData = response.data.sort(
        (a, b) => b.invoice_id - a.invoice_id
      );

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
          ID: info?.invoice_id,
          "N° Factura": info?.invoice_id,
          "Nombre del predio": info?.property_name,
          "Nombre del lote": info?.lot_name,
          "Número de documento": info?.document_number,
          "Intervalo de pago": info?.payment_interval,
          "Fecha de emisión": info.issuance_date?.slice(0, 10),
          "Fecha de vencimiento": info.expiration_date?.slice(0, 10),
          "Valor a pagar": formatCurrency(info.total_amount),
          Anexo: info.pdf_url,
          Estado: toTitleCase(info.status),
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

  useEffect(() => {
    if (data.length > 0) {
      // Extraer años únicos
      const years = [
        ...new Set(
          data
            .filter((item) => item.issuance_date) // Filtrar elementos sin fecha
            .map((item) => {
              const parts = item.issuance_date.split("-");
              return parseInt(parts[0], 10);
            })
        ),
      ].sort((a, b) => b - a); // Ordenar de mayor a menor

      setAvailableYears(years);

      // Seleccionar el año más reciente por defecto
      if (years.length > 0 && !selectedYear) {
        setSelectedYear(years[0]);
      }
    }
  }, [data]);

  useEffect(() => {
    if (selectedYear && data.length > 0) {
      // Filtrar facturas del año seleccionado
      const facturasPorAnio = data.filter((item) => {
        if (!item.issuance_date) return false;
        const parts = item.issuance_date.split("-");
        return parseInt(parts[0], 10) === selectedYear;
      });

      // Extraer meses únicos con datos
      const monthsWithData = [
        ...new Set(
          facturasPorAnio.map((item) => {
            const parts = item.issuance_date.split("-");
            return parseInt(parts[1], 10); // El mes está en la posición 1 (formato YYYY-MM-DD)
          })
        ),
      ].sort((a, b) => a - b); // Ordenar de menor a mayor

      // Crear objetos de meses con su número y nombre para el selector
      const monthObjects = monthsWithData.map((monthNum) => {
        // Crear una fecha con el mes para obtener su nombre
        const date = new Date(selectedYear, monthNum - 1, 1);
        return {
          number: monthNum,
          name: format(date, "MMM", { locale: es }),
          full: format(date, "MMMM", { locale: es }),
        };
      });

      setAvailableMonths(monthObjects);

      // Seleccionar el mes más reciente por defecto
      if (monthObjects.length > 0) {
        // Si no hay mes seleccionado o el seleccionado no está en los disponibles
        if (!selectedMonth || !monthsWithData.includes(selectedMonth.number)) {
          // Ordenar por fecha para encontrar el más reciente
          const sortedFacturas = [...facturasPorAnio].sort(
            (a, b) => new Date(b.issuance_date) - new Date(a.issuance_date)
          );

          if (sortedFacturas.length > 0) {
            const latestMonth = parseInt(
              sortedFacturas[0].issuance_date.split("-")[1],
              10
            );
            const monthObj = monthObjects.find((m) => m.number === latestMonth);
            setSelectedMonth(monthObj);
          }
        }
      } else {
        setSelectedMonth(null);
      }
    }
  }, [selectedYear, data]);

  // Función para generar datos del gráfico de barras basados en el año seleccionado
  const getBarChartData = () => {
    if (!selectedYear) return { labels: [], datasets: [] };

    // Filtrar facturas por el año seleccionado
    const facturasPorAnio = data.filter((item) => {
      if (!item.issuance_date) return false;
      const parts = item.issuance_date.split("-");
      return parseInt(parts[0], 10) === selectedYear;
    });

    // Inicializar array para los 12 meses del año
    const mesesData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      year: selectedYear,
      pendientes: 0,
      pagadas: 0,
      vencidas: 0,
    }));

    // Agrupar facturas por estado y mes
    facturasPorAnio.forEach((factura) => {
      if (!factura.issuance_date) return;

      const month = parseInt(factura.issuance_date.split("-")[1], 10) - 1; // 0-indexed
      const estado = factura.status?.toLowerCase();

      if (estado === "pendiente") {
        mesesData[month].pendientes += 1;
      } else if (estado === "pagada") {
        mesesData[month].pagadas += 1;
      } else if (estado === "vencida") {
        mesesData[month].vencidas += 1;
      }
    });

    // Crear etiquetas de los meses en español
    const labels = mesesData.map((m, i) => {
      const date = new Date(selectedYear, i, 1);
      return format(date, "MMM", { locale: es });
    });

    // Extraer los datos para el gráfico
    const pendientes = mesesData.map((m) => m.pendientes);
    const pagadas = mesesData.map((m) => m.pagadas);
    const vencidas = mesesData.map((m) => m.vencidas);

    return {
      labels,
      datasets: [
        {
          label: "Facturas vencidas",
          data: vencidas,
          backgroundColor: "rgba(255,165,137,1.000)",
          stack: "Stack 0",
          borderRadius: 6,
        },
        {
          label: "Facturas pendientes",
          data: pendientes,
          backgroundColor: "rgba(255, 214, 107, 1)",
          stack: "Stack 0",
          borderRadius: 6,
        },
        {
          label: "Facturas pagadas",
          data: pagadas,
          backgroundColor: "rgba(124, 168, 255, 1)",
          stack: "Stack 0",
          borderRadius: 6,
        },
      ],
    };
  };

  // Opciones para el gráfico de barras
  const getBarOptions = () => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: `Facturas generadas (${selectedYear})`,
          font: {
            size: 14,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          stacked: true,
          ticks: {
            precision: 0,
          },
          title: {
            display: true,
            text: "Cantidad de facturas",
          },
        },
        x: {
          stacked: true,
          title: {
            display: true,
            text: "Mes",
          },
        },
      },
    };
  };

  // Función para generar datos del gráfico circular (donut)
  const getDonutChartData = () => {
    if (!selectedYear || !selectedMonth)
      return { labels: [], datasets: [{ data: [0, 0, 0] }] };

    // Filtrar facturas por el año y mes seleccionados
    const facturasFiltradas = data.filter((factura) => {
      if (!factura.issuance_date) return false;

      const [year, month] = factura.issuance_date.split("-").map(Number);
      return year === selectedYear && month === selectedMonth.number;
    });

    // Contar facturas por estado
    const cantidadPorEstado = {
      pendiente: 0,
      pagada: 0,
      vencida: 0,
    };

    facturasFiltradas.forEach((factura) => {
      const estado = factura.status?.toLowerCase();
      if (estado === "pendiente") cantidadPorEstado.pendiente += 1;
      else if (estado === "pagada") cantidadPorEstado.pagada += 1;
      else if (estado === "vencida") cantidadPorEstado.vencida += 1;
    });

    return {
      labels: ["Pendientes", "Pagadas", "Vencidas"],
      datasets: [
        {
          data: [
            cantidadPorEstado.pendiente,
            cantidadPorEstado.pagada,
            cantidadPorEstado.vencida,
          ],
          backgroundColor: [
            "rgba(255, 214, 107, 1)",
            "rgba(91, 147, 255, 1)",
            "rgba(255, 143, 107, 1)",
          ],
          borderColor: [
            "rgba(255, 214, 107, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 99, 132, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  // Opciones para el gráfico circular
  const getDonutOptions = () => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: false,
        },
      },
      cutout: "80%",
    };
  };

  // Calcular el total de facturas para mostrar en el centro del donut
  const calcularTotalFacturas = () => {
    if (!selectedYear || !selectedMonth) return 0;

    // Filtrar facturas por el año y mes seleccionados
    const facturasFiltradas = data.filter((factura) => {
      if (!factura.issuance_date) return false;

      const [year, month] = factura.issuance_date.split("-").map(Number);
      return year === selectedYear && month === selectedMonth.number;
    });

    return facturasFiltradas.length;
  };

  const totalFacturas = calcularTotalFacturas();

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

  const renderCharts = () => {
    return (
      <div className="container-cont mb-5">
        <div className="columns">
          <div className="column is-8">
            <div className="rol-detail" ref={barContainerRef}>
              <div className="is-flex is-justify-content-space-between is-align-items-center mb-2">
                <h3 className="subtitle is-6 mb-2">
                  Facturas generadas (Anual)
                </h3>
                <div className="is-flex is-align-items-center">
                  <div className="is-flex is-align-items-center mr-4">
                    <div className="is-flex is-align-items-center mr-3">
                      <span
                        style={{
                          display: "inline-block",
                          width: "12px",
                          height: "12px",
                          backgroundColor: "rgba(255,165,137,1.000)",
                          marginRight: "5px",
                        }}
                      />
                      <span className="is-size-7">Facturas vencidas</span>
                    </div>

                    <div className="is-flex is-align-items-center mr-3">
                      <span
                        style={{
                          display: "inline-block",
                          width: "12px",
                          height: "12px",
                          backgroundColor: "rgba(255, 214, 107, 1)",
                          marginRight: "5px",
                        }}
                      />
                      <span className="is-size-7">Facturas pendientes</span>
                    </div>

                    <div className="is-flex is-align-items-center">
                      <span
                        style={{
                          display: "inline-block",
                          width: "12px",
                          height: "12px",
                          backgroundColor: "rgba(124, 168, 255, 1)",
                          marginRight: "5px",
                        }}
                      />
                      <span className="is-size-7">Facturas pagadas</span>
                    </div>
                  </div>

                  {/* Selector de años */}
                  <div className="select is-small">
                    <select
                      value={selectedYear || ""}
                      onChange={(e) =>
                        setSelectedYear(parseInt(e.target.value, 10))
                      }
                      disabled={availableYears.length === 0}
                    >
                      {availableYears.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div style={{ height: "300px" }}>
                <Bar data={getBarChartData()} options={getBarOptions()} />
              </div>
            </div>
          </div>
          <div className="column is-4">
            <div ref={donutContainerRef} className="rol-detail">
              <div className="is-flex is-justify-content-space-between is-align-items-center mb-4">
                <h3 className="subtitle is-6 mb-0">
                  Facturas generadas (Mensual)
                </h3>
                {/* Selector de meses basado en el año seleccionado */}
                <div className="select is-small">
                  <select
                    value={selectedMonth?.number || ""}
                    onChange={(e) => {
                      const monthNum = parseInt(e.target.value, 10);
                      const monthObj = availableMonths.find(
                        (m) => m.number === monthNum
                      );
                      setSelectedMonth(monthObj);
                    }}
                    disabled={!selectedYear || availableMonths.length === 0}
                  >
                    {availableMonths.map((month) => (
                      <option key={month.number} value={month.number}>
                        {toTitleCase(month.full)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div
                className="is-flex is-flex-direction-column"
                style={{ height: "292px" }}
              >
                {/* Gráfico de dona en la parte superior */}
                <div
                  style={{
                    position: "relative",
                    height: "55%",
                    width: "100%",
                    marginBottom: "20px",
                  }}
                >
                  <Doughnut
                    data={getDonutChartData()}
                    options={getDonutOptions()}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      textAlign: "center",
                    }}
                  >
                    <p
                      className="is-size-6 mb-0"
                      style={{ whiteSpace: "pre-line" }}
                    >
                      {"Total de\nfacturas:"}
                    </p>
                    <p className="is-size-5 has-text-weight-bold">
                      {totalFacturas}
                    </p>
                  </div>
                </div>

                {/* Leyenda debajo del gráfico */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                  }}
                >
                  {/* Transacciones aprobadas (Pagadas) */}
                  <div className="is-flex is-align-items-center mb-2">
                    <span
                      style={{
                        display: "inline-block",
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(91, 147, 255, 1)",
                        marginRight: "8px",
                      }}
                    />
                    <div
                      className="is-flex is-justify-content-space-between"
                      style={{ width: "100%" }}
                    >
                      <span className="is-size-7">Facturas pagadas</span>
                      <span className="is-size-7">
                        {getDonutChartData().datasets[0].data[1]}
                      </span>
                    </div>
                  </div>

                  {/* Transacciones pendientes */}
                  <div className="is-flex is-align-items-center mb-2">
                    <span
                      style={{
                        display: "inline-block",
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(255,214,107, 1)",
                        marginRight: "8px",
                      }}
                    />
                    <div
                      className="is-flex is-justify-content-space-between"
                      style={{ width: "100%" }}
                    >
                      <span className="is-size-7">Facturas pendientes</span>
                      <span className="is-size-7">
                        {getDonutChartData().datasets[0].data[0]}
                      </span>
                    </div>
                  </div>

                  {/* Transacciones rechazadas (Vencidas) */}
                  <div className="is-flex is-align-items-center">
                    <span
                      style={{
                        display: "inline-block",
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(255, 143, 107, 1)",
                        marginRight: "8px",
                      }}
                    />
                    <div
                      className="is-flex is-justify-content-space-between"
                      style={{ width: "100%" }}
                    >
                      <span className="is-size-7">Facturas vencidas</span>
                      <span className="is-size-7">
                        {getDonutChartData().datasets[0].data[2]}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Head
        head_data={head_data}
        onButtonClick={handleButtonClick}
        loading={loadingReport}
        buttonDisabled={buttonDisabled}
      />
      {loadingTable ? (
        <div className="rol-detail">
          <div className="loader-cell">
            <div className="loader cont-loader"></div>
            <p className="loader-text">Cargando información{dots}</p>
          </div>
        </div>
      ) : (
        <>
          {renderCharts()}
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

export default Billing_user;

const generateReportWithCharts = (
  filteredData,
  toTitleCase,
  imagesData,
  companyData,
  locationNames,
  userData,
  onFinish
) => {
  // Crear una nueva instancia de jsPDF en formato horizontal
  const doc = new jsPDF("landscape");

  // Añadir fuentes Roboto al documento
  doc.addFont(RobotoNormalFont, "Roboto", "normal");
  doc.addFont(RobotoBoldFont, "Roboto", "bold");

  // Colorear el fondo del encabezado
  doc.setFillColor(243, 242, 247);
  doc.rect(0, 0, 300, 53, "F");

  // Agregar logo
  doc.addImage(Icon, "PNG", 246, 10, 39, 11);

  // Título y encabezados
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(17);
  doc.setFont("Roboto", "bold");
  doc.text("REPORTE DE FACTURACIÓN", 12, 18);

  doc.setFontSize(11);
  doc.text(`Fecha de generación:`, 12, 27);
  doc.text(`Generado por:`, 12, 39);

  doc.setTextColor(94, 100, 112);
  doc.setFont("Roboto", "normal");
  doc.setFontSize(10);
  doc.text(`${new Date().toLocaleString()}`, 12, 32);
  doc.text(
    [
      toTitleCase(userData?.name),
      toTitleCase(userData?.first_last_name),
      toTitleCase(userData?.second_last_name),
    ]
      .filter(Boolean)
      .join(" "),
    12,
    44
  );

  // Información de la empresa
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

  // Título de la sección de gráficas
  doc.setTextColor(0, 0, 0);
  doc.setFont("Roboto", "bold");
  doc.text("Resumen de facturación", 12, 63);
  doc.setTextColor(94, 100, 112);
  doc.setFont("Roboto", "normal");
  doc.text(`Cantidad de facturas: ${filteredData.length}`, 12, 68);

  // Añadir las tarjetas de resumen
  const margin = 12;
  const pdfWidth = doc.internal.pageSize.getWidth();
  const availableWidth = pdfWidth - 2 * margin;

  // Calcular posición para las gráficas
  const graphsStartY = 72;

  // Establecer dimensiones para las gráficas (misma altura para ambas)
  const fixedHeight = 72; // Altura fija en mm

  // Calcular anchos basados en la altura fija manteniendo proporciones
  const barImgWidth = fixedHeight * imagesData.bar.aspectRatio;
  const donutImgWidth = fixedHeight * imagesData.donut.aspectRatio;

  // Calcular espacio entre gráficas
  const spaceBetween = 10;
  const totalGraphWidth = barImgWidth + spaceBetween + donutImgWidth;

  // Verificar si las gráficas caben lado a lado
  if (totalGraphWidth <= availableWidth) {
    // Centrar el conjunto de gráficas
    const startX = margin + (availableWidth - totalGraphWidth) / 2;

    // Añadir la gráfica de barras a la izquierda
    doc.addImage(
      imagesData.bar.image,
      "PNG",
      startX,
      graphsStartY,
      barImgWidth,
      fixedHeight
    );

    // Añadir la gráfica de dona a la derecha
    doc.addImage(
      imagesData.donut.image,
      "PNG",
      startX + barImgWidth + spaceBetween,
      graphsStartY,
      donutImgWidth,
      fixedHeight
    );
  } else {
    // Si no caben lado a lado, ajustar proporcionalmente
    const barWidthRatio = barImgWidth / totalGraphWidth;
    const donutWidthRatio = donutImgWidth / totalGraphWidth;

    const adjustedBarWidth = availableWidth * barWidthRatio;
    const adjustedDonutWidth = availableWidth * donutWidthRatio;

    const adjustedBarHeight = adjustedBarWidth / imagesData.bar.aspectRatio;
    const adjustedDonutHeight =
      adjustedDonutWidth / imagesData.donut.aspectRatio;

    // Centrar el conjunto de gráficas
    const startX = margin;

    // Añadir las gráficas ajustadas
    doc.addImage(
      imagesData.bar.image,
      "PNG",
      startX,
      graphsStartY,
      adjustedBarWidth,
      adjustedBarHeight
    );

    doc.addImage(
      imagesData.donut.image,
      "PNG",
      startX + adjustedBarWidth + spaceBetween,
      graphsStartY,
      adjustedDonutWidth,
      adjustedDonutHeight
    );
  }

  // Calcular la posición Y para la tabla después de las gráficas
  const tableStartY = graphsStartY + fixedHeight + 10;

  // Añadir la tabla de facturas
  autoTable(doc, {
    startY: tableStartY,
    margin: { left: margin },
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
      font: "Roboto",
    },
    bodyStyles: {
      textColor: [89, 89, 89],
      font: "Roboto",
    },
    styles: {
      fontSize: 10,
      cellPadding: 3,
      lineColor: [234, 236, 240],
    },
  });

  // Pie de página con logo
  doc.addImage(Icon, "PNG", 12, 190, 32, 9);

  // Agregar numeración de páginas en el pie de página
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setFont("Roboto", "normal");
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
