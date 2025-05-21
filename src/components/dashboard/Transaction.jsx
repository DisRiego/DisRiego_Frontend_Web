import { useEffect, useMemo, useState, useRef } from "react";
import axios from "axios";
import useUserPermissions from "../../hooks/useUserPermissions";
import Head from "./reusable/Head";
import Tab from "./reusable/Tab";
import Search from "./reusable/Search";
import Filter from "./reusable/Filter";
import Table from "./reusable/Table";
import Pagination from "./reusable/Pagination";
import Message from "../Message";
import { format, set } from "date-fns";
import { jsPDF } from "jspdf";
import Icon from "../../assets/icons/Disriego_title.png";
import { autoTable } from "jspdf-autotable";
import RobotoNormalFont from "../../assets/fonts/Roboto-Regular.ttf";
import RobotoBoldFont from "../../assets/fonts/Roboto-Bold.ttf";
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
import { es } from "date-fns/locale";

// Registrar los componentes de Chart.js
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

const Transaction = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState("");
  const [loadingTable, setLoadingTable] = useState(false);
  const [loadingReport, setLoadingReport] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const itemsPerPage = 5;
  const barContainerRef = useRef(null); // Referencia para la gráfica de barras
  const donutContainerRef = useRef(null); // Referencia para la gráfica de dona
  const cardsContainerRef = useRef(null); // <--- AÑADIR ESTA LÍNEA

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

  const [yearFilter, setYearFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [methodFilter, setMethodFilter] = useState("");
  const [statusFilterValue, setStatusFilterValue] = useState("");
  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

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
      ...(hasPermission("Generar reporte de todas las transacciones") && {
        button1: {
          icon: "LuDownload",
          class: "",
          text: "Descargar reporte",
        },
      }),
    },
  };

  const handleButtonClick = async (buttonText) => {
    if (buttonText === "Descargar reporte") {
      try {
        setLoadingReport("is-loading");

        // Verificar si tenemos todas las referencias
        if (
          !barContainerRef.current ||
          !donutContainerRef.current ||
          !cardsContainerRef.current
        ) {
          console.error(
            "No se pudo obtener alguna de las referencias necesarias"
          );
          setLoadingReport("");
          return;
        }

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
        // Capturar el contenedor de tarjetas de resumen
        const cardsCanvas = await html2canvas(cardsContainerRef.current, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: null,
        });
        const cardsImage = cardsCanvas.toDataURL("image/png");

        // Preparar los datos de las imágenes con sus proporciones
        const imagesData = {
          cards: {
            image: cardsImage,
            aspectRatio: cardsCanvas.width / cardsCanvas.height,
          },
          bar: {
            image: barImage,
            aspectRatio: barCanvas.width / barCanvas.height,
          },
          donut: {
            image: donutImage,
            aspectRatio: donutCanvas.width / donutCanvas.height,
          },
        };

        // 3. Generar reporte con los datos obtenidos
        generateReportWithCharts(
          filteredData,
          toTitleCase,
          () => setLoadingReport(""),
          companyData,
          locationData,
          userData,
          imagesData
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
      key: "invoice",
      label: "Facturas",
      path: "/dashboard/invoice",
    },
    {
      key: "transaction",
      label: "Transacciones",
      path: "/dashboard/transaction",
    },
  ].filter(Boolean);

  const columns = [
    "ID de transacción",
    "Número de documento",
    "Referencia de pago",
    "Metodo de pago",
    "Valor pagado",
    "Fecha del pago",
    "Estado",
    "Opciones",
  ];

  const options = [
    hasPermission("Ver detalles de una transacción") && {
      icon: "BiShow",
      name: "Ver detalles",
    },
  ].filter(Boolean);

  useEffect(() => {
    fetchBilling();
  }, []);

  const fetchBilling = async () => {
    try {
      setLoadingTable(true);
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND_FACTURACTION +
          import.meta.env.VITE_ROUTE_BACKEND_GET_PAYMENT
      );
      const sortedData = response.data.data.sort((a, b) => b.id - a.id);
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
    if (data.length > 0) {
      const sortedDates = data
        .map((item) => new Date(item.payment_date))
        .sort((a, b) => b - a);

      const latestYear = sortedDates[0].getFullYear();
      const monthsInYear = sortedDates
        .filter((d) => d.getFullYear() === latestYear)
        .map((d) => d.getMonth() + 1);

      const latestMonth = Math.max(...monthsInYear);

      setYearFilter(String(latestYear));
      setMonthFilter(String(latestMonth));
    }
  }, [data]);

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return format(date, "yyyy-MM-dd, hh:mm a").toLowerCase();
  };

  useEffect(() => {
    let filtered = data;

    if (yearFilter && yearFilter !== "ALL") {
      filtered = filtered.filter((item) => {
        const date = new Date(item.payment_date);
        return date.getFullYear() === parseInt(yearFilter);
      });
    }

    if (monthFilter && monthFilter !== "" && yearFilter !== "ALL") {
      filtered = filtered.filter((item) => {
        const date = new Date(item.payment_date);
        return date.getMonth() + 1 === parseInt(monthFilter);
      });
    }

    if (methodFilter && methodFilter !== "ALL") {
      filtered = filtered.filter(
        (item) => item.payment_method === methodFilter
      );
    }

    if (statusFilterValue && statusFilterValue !== "ALL") {
      filtered = filtered.filter(
        (item) => item.payment_status_name === statusFilterValue
      );
    }

    const formatted = filtered.map((info) => ({
      ID: info.id,
      "ID de transacción": info?.id,
      "Número de documento": info?.payer_document,
      "Referencia de pago": info?.transaction_id,
      "Metodo de pago": info?.payment_method,
      "Valor pagado": formatCurrency(info?.paid_amount),
      "Fecha del pago": formatDateTime(info?.payment_date),
      Estado: info.payment_status_name,
    }));
    console.log(formatted);

    setFilteredData(formatted);
  }, [data, yearFilter, monthFilter, methodFilter, statusFilterValue]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const availableYears = useMemo(() => {
    return [
      ...new Set(data.map((item) => new Date(item.payment_date).getFullYear())),
    ].sort((a, b) => a - b);
  }, [data]);

  const availableMonths = useMemo(() => {
    if (!yearFilter) return [];

    const monthsInYear = data
      .filter(
        (item) =>
          new Date(item.payment_date).getFullYear() === parseInt(yearFilter)
      )
      .map((item) => new Date(item.payment_date).getMonth());

    const uniqueMonths = Array.from(new Set(monthsInYear)).sort(
      (a, b) => a - b
    );
    return uniqueMonths;
  }, [data, yearFilter]);

  const availableMethods = useMemo(() => {
    return [...new Set(data.map((item) => item.payment_method))];
  }, [data]);

  const availableStatuses = useMemo(() => {
    return [...new Set(data.map((item) => item.payment_status_name))].sort(
      (a, b) => a.localeCompare(b)
    );
  }, [data]);

  const filteredStats = useMemo(() => {
    const selectedYear = parseInt(yearFilter);
    const selectedMonth = parseInt(monthFilter);

    // Filtros para las estadísticas generales
    const filtered = data.filter((item) => {
      const date = new Date(item.payment_date);
      const yearMatch =
        !yearFilter ||
        yearFilter === "ALL" ||
        date.getFullYear() === selectedYear;
      const monthMatch =
        !monthFilter ||
        monthFilter === "" ||
        date.getMonth() + 1 === selectedMonth;
      const methodMatch =
        !methodFilter ||
        methodFilter === "ALL" ||
        item.payment_method === methodFilter;
      const statusMatch =
        !statusFilterValue ||
        statusFilterValue === "ALL" ||
        item.payment_status_name === statusFilterValue;
      return yearMatch && monthMatch && methodMatch && statusMatch;
    });

    // Cálculo específico de ingresos anuales (sin filtro de mes)
    const annualIncome = data
      .filter((item) => {
        const date = new Date(item.payment_date);
        const yearMatch =
          !yearFilter ||
          yearFilter === "ALL" ||
          date.getFullYear() === selectedYear;
        const methodMatch =
          !methodFilter ||
          methodFilter === "ALL" ||
          item.payment_method === methodFilter;
        const statusMatch =
          !statusFilterValue ||
          statusFilterValue === "ALL" ||
          item.payment_status_name === statusFilterValue;
        return yearMatch && methodMatch && statusMatch;
      })
      .reduce((sum, item) => sum + item.paid_amount, 0);

    const monthlyIncome = filtered
      .filter((item) => {
        const date = new Date(item.payment_date);
        return (
          (yearFilter === "ALL" || date.getFullYear() === selectedYear) &&
          (monthFilter === "" || date.getMonth() + 1 === selectedMonth)
        );
      })
      .reduce((sum, item) => sum + item.paid_amount, 0);

    const monthlyTransactions = filtered.filter((item) => {
      const date = new Date(item.payment_date);
      return (
        (yearFilter === "ALL" || date.getFullYear() === selectedYear) &&
        (monthFilter === "" || date.getMonth() + 1 === selectedMonth)
      );
    });

    const rejectedTransactions = monthlyTransactions.filter(
      (item) => item.payment_status_name === "Rechazado"
    );

    const rejectionRate = monthlyTransactions.length
      ? (rejectedTransactions.length / monthlyTransactions.length) * 100
      : 0;

    return {
      annualIncome,
      monthlyIncome,
      rejectionRate,
      filteredTransactions: filtered,
    };
  }, [data, yearFilter, monthFilter, methodFilter, statusFilterValue]);

  const totalIncome = useMemo(() => {
    return data.reduce((sum, item) => sum + item.paid_amount, 0);
  }, [data]);

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

  // Función para generar datos del gráfico de barras basados en los filtros
  const getBarChartData = () => {
    if (
      !filteredStats.filteredTransactions ||
      filteredStats.filteredTransactions.length === 0
    ) {
      return { labels: [], datasets: [] };
    }

    // Seleccionar los datos según el filtro de año y mes
    let transactionsToProcess = filteredStats.filteredTransactions;

    // Preparar la estructura para agrupar transacciones
    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      aprobadas: 0,
      pendientes: 0,
      rechazadas: 0,
    }));

    // Agrupar transacciones por mes y estado
    transactionsToProcess.forEach((transaction) => {
      const date = new Date(transaction.payment_date);
      const month = date.getMonth(); // 0-indexed
      const status = transaction.payment_status_name.toLowerCase();

      // Sumar los montos según el estado
      if (status === "aprobado") {
        monthlyData[month].aprobadas += 1;
      } else if (status === "pendiente") {
        monthlyData[month].pendientes += 1;
      } else if (status === "rechazado") {
        monthlyData[month].rechazadas += 1;
      }
    });

    // Crear etiquetas de los meses en español
    const labels = monthlyData.map((_, i) => {
      const date = new Date(2024, i, 1); // Año no importa, solo queremos el nombre del mes
      return format(date, "MMM", { locale: es });
    });

    // Extraer los datos para el gráfico
    const aprobadas = monthlyData.map((m) => m.aprobadas);
    const pendientes = monthlyData.map((m) => m.pendientes);
    const rechazadas = monthlyData.map((m) => m.rechazadas);

    return {
      labels,
      datasets: [
        {
          label: "Transacciones rechazadas",
          data: rechazadas,
          backgroundColor: "rgba(255,165,137,1.000)",
          stack: "Stack 0",
          borderRadius: 6,
        },
        {
          label: "Transacciones pendientes",
          data: pendientes,
          backgroundColor: "rgba(255, 214, 107, 1)",
          stack: "Stack 0",
          borderRadius: 6,
        },
        {
          label: "Transacciones aprobadas",
          data: aprobadas,
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
          text:
            yearFilter !== "ALL"
              ? `Transacciones por mes (${yearFilter})`
              : "Transacciones por mes (Todos los años)",
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
            beginAtZero: true,
          },
          title: {
            display: true,
            text: "Cantidad de transacciones",
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
    if (
      !filteredStats.filteredTransactions ||
      filteredStats.filteredTransactions.length === 0
    ) {
      return { labels: [], datasets: [{ data: [0, 0, 0] }] };
    }

    // Calcular montos totales por estado
    const montosPorEstado = {
      pendiente: 0,
      aprobado: 0,
      rechazado: 0,
    };

    // Sumar montos según el estado
    filteredStats.filteredTransactions.forEach((transaction) => {
      const status = transaction.payment_status_name.toLowerCase();
      if (status === "pendiente") montosPorEstado.pendiente += 1;
      else if (status === "aprobado") montosPorEstado.aprobado += 1;
      else if (status === "rechazado") montosPorEstado.rechazado += 1;
    });

    return {
      labels: ["Pendientes", "Aprobadas", "Rechazadas"],
      datasets: [
        {
          data: [
            montosPorEstado.pendiente,
            montosPorEstado.aprobado,
            montosPorEstado.rechazado,
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

  // Calcular el total de transacciones
  const calcularMontoTotal = () => {
    if (!filteredStats.filteredTransactions) return 0;

    return filteredStats.filteredTransactions.reduce((total, transaction) => {
      return total + transaction.paid_amount;
    }, 0);
  };

  const montoTotal = formatCurrency(calcularMontoTotal());

  // Renderizar las gráficas
  const renderCharts = () => {
    return (
      <div className="container-cont mb-5">
        <div className="columns">
          <div className="column is-8">
            <div className="rol-detail" ref={barContainerRef}>
              <div className="is-flex is-justify-content-space-between is-align-items-center mb-2">
                <h3 className="subtitle is-6 mb-2">Transacciones generadas</h3>
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
                      <span className="is-size-7">
                        Transacciones rechazadas
                      </span>
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
                      <span className="is-size-7">
                        Transacciones pendientes
                      </span>
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
                      <span className="is-size-7">Transacciones aprobadas</span>
                    </div>
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
                <h3 className="subtitle is-6 mb-0">Total transacciones</h3>
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
                    <p className="is-size-6 mb-0">Total</p>
                    <p className="is-size-5 has-text-weight-bold">
                      {filteredStats.filteredTransactions.length}
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
                  {/* Transacciones aprobadas */}
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
                      <span className="is-size-7">Transacciones aprobadas</span>
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
                      <span className="is-size-7">
                        Transacciones pendientes
                      </span>
                      <span className="is-size-7">
                        {getDonutChartData().datasets[0].data[0]}
                      </span>
                    </div>
                  </div>

                  {/* Transacciones rechazadas */}
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
                      <span className="is-size-7">
                        Transacciones rechazadas
                      </span>
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
          <div className="container-filter">
            <div className="total_amount">
              <div className="fixed-grid has-4-cols-desktop has-2-cols-mobile">
                <div className="grid">
                  <div className="cell">
                    <div className="field">
                      <div className="control">
                        <div class="select ">
                          <select
                            value={yearFilter}
                            onChange={(e) => {
                              const selected = e.target.value;
                              setYearFilter(selected);
                              if (selected === "ALL") setMonthFilter("");
                            }}
                          >
                            <option value="ALL">Todos los años</option>
                            {availableYears.map((year) => (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="cell">
                    <div className="field">
                      <div className="control">
                        <div class="select ">
                          <select
                            value={monthFilter}
                            onChange={(e) => setMonthFilter(e.target.value)}
                            disabled={yearFilter === "ALL"}
                          >
                            <option value="">Todos los meses</option>
                            {availableMonths.map((monthIndex) => (
                              <option
                                key={monthIndex + 1}
                                value={monthIndex + 1}
                              >
                                {monthNames[monthIndex]}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="cell">
                    <div className="field">
                      <div className="control">
                        <div class="select ">
                          <select
                            value={methodFilter}
                            onChange={(e) => setMethodFilter(e.target.value)}
                          >
                            <option value="ALL">
                              Todos los métodos de pago
                            </option>
                            {availableMethods.map((method) => (
                              <option key={method} value={method}>
                                {method}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="cell">
                    <div className="field">
                      <div className="control">
                        <div class="select ">
                          <select
                            value={statusFilterValue}
                            onChange={(e) =>
                              setStatusFilterValue(e.target.value)
                            }
                          >
                            <option value="ALL">Todos los estados</option>
                            {availableStatuses.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="container-cont">
            <div className="total_amount">
              <div className="fixed-grid has-4-cols-desktop has-2-cols-mobile">
                <div className="grid" ref={cardsContainerRef}>
                  <div className="cell rol-detail">
                    <p className="has-text-weight-bold mb-2">
                      Ingresos totales
                    </p>
                    <p className="is-size-5 has-text-weight-bold">
                      {formatCurrency(totalIncome)}
                    </p>
                  </div>
                  <div className="cell rol-detail">
                    <p className="has-text-weight-bold mb-2">
                      Ingresos totales (anual)
                    </p>
                    <p className="is-size-5 has-text-weight-bold">
                      {formatCurrency(filteredStats.annualIncome)}
                    </p>
                  </div>
                  <div className="cell rol-detail">
                    <p className="has-text-weight-bold mb-2">
                      Ingresos totales (mes)
                    </p>
                    <p className="is-size-5 has-text-weight-bold">
                      {formatCurrency(filteredStats.monthlyIncome)}
                    </p>
                  </div>
                  <div className="cell rol-detail">
                    <p className="has-text-weight-bold mb-2">
                      Tasa de rechazo (mensual)
                    </p>
                    <p className="is-size-5 has-text-weight-bold">
                      {filteredStats.rejectionRate.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {renderCharts()}
          <div className="container-search">
            <Search onSearch={setSearchTerm} buttonDisabled={buttonDisabled} />
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

export default Transaction;

const generateReportWithCharts = (
  filteredData,
  toTitleCase,
  onFinish,
  companyData,
  locationNames,
  userData,
  imagesData
) => {
  const doc = new jsPDF("landscape");
  const margin = 12;

  doc.addFont(RobotoNormalFont, "Roboto", "normal");
  doc.addFont(RobotoBoldFont, "Roboto", "bold");

  doc.setFillColor(243, 242, 247);
  doc.rect(0, 0, 300, 53, "F");

  doc.addImage(Icon, "PNG", 246, 10, 39, 11);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(17);
  doc.setFont("Roboto", "bold");
  doc.text("CONSOLIDADOS DE TRANSACCIONES", margin, 18);
  doc.setFontSize(11);
  doc.text(`Fecha de generación:`, margin, 27);
  doc.text(`Generado por:`, margin, 39);

  doc.setTextColor(94, 100, 112);
  doc.setFont("Roboto", "normal");
  doc.setFontSize(10);
  doc.text(`${new Date().toLocaleString()}`, margin, 32);
  doc.text(
    [
      toTitleCase(userData?.name),
      toTitleCase(userData?.first_last_name),
      toTitleCase(userData?.second_last_name),
    ]
      .filter(Boolean)
      .join(" "),
    margin,
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

  let currentY = 60;

  doc.setTextColor(0, 0, 0);
  doc.setFont("Roboto", "bold");
  doc.setFontSize(12); // Puedes ajustar el tamaño del título
  doc.text("Resumen de transacciones", margin, currentY);
  currentY += 6; // Espacio después del título

  doc.setTextColor(94, 100, 112);
  doc.setFont("Roboto", "normal");
  doc.setFontSize(10);

  doc.text(
    `Total de transacciones mostradas: ${filteredData.length}`,
    margin,
    currentY
  );
  currentY += 8; // Espacio después del texto de cantidad

  // Añadir las tarjetas de resumen
  const pdfWidth = doc.internal.pageSize.getWidth();
  const availableWidthForCards = pdfWidth - 2 * margin; // Renombrado para claridad

  // Asegúrate de que imagesData.cards y sus propiedades existen antes de usarlas
  if (
    imagesData.cards &&
    imagesData.cards.image &&
    imagesData.cards.aspectRatio
  ) {
    const cardsAspectRatio = imagesData.cards.aspectRatio;
    const cardsWidth = availableWidthForCards;
    const cardsHeight = cardsWidth / cardsAspectRatio;

    doc.addImage(
      imagesData.cards.image,
      "PNG",
      margin,
      currentY,
      cardsWidth,
      cardsHeight
    );
    currentY += cardsHeight + 7; // Actualizar Y para las gráficas, con un poco más de espacio
  } else {
    console.error(
      "Datos de imagen de tarjetas no encontrados o incompletos en imagesData."
    );
  }

  // Añadir las gráficas al PDF
  const graphsStartY = currentY; // Usar la Y actualizada
  const fixedHeight = 75; // Altura fija en mm para las gráficas (puedes ajustar)
  const availableWidthForGraphs = pdfWidth - 2 * margin;

  // Asegúrate de que imagesData.bar y imagesData.donut y sus propiedades existen
  if (
    imagesData.bar &&
    imagesData.bar.image &&
    imagesData.bar.aspectRatio &&
    imagesData.donut &&
    imagesData.donut.image &&
    imagesData.donut.aspectRatio
  ) {
    const barImgWidth = fixedHeight * imagesData.bar.aspectRatio;
    const donutImgWidth = fixedHeight * imagesData.donut.aspectRatio;
    const spaceBetween = 10;
    const totalGraphWidth = barImgWidth + spaceBetween + donutImgWidth;

    if (totalGraphWidth <= availableWidthForGraphs) {
      const startX = margin + (availableWidthForGraphs - totalGraphWidth) / 2;
      doc.addImage(
        imagesData.bar.image,
        "PNG",
        startX,
        graphsStartY,
        barImgWidth,
        fixedHeight
      );
      doc.addImage(
        imagesData.donut.image,
        "PNG",
        startX + barImgWidth + spaceBetween,
        graphsStartY,
        donutImgWidth,
        fixedHeight
      );
    } else {
      const scaleFactor =
        availableWidthForGraphs / (totalGraphWidth + spaceBetween); // Un intento de ajuste
      let adjustedBarWidth = barImgWidth * scaleFactor;
      let adjustedDonutWidth = donutImgWidth * scaleFactor;

      // Asegurar que el aspect ratio se mantenga
      let adjustedBarHeight = adjustedBarWidth / imagesData.bar.aspectRatio;
      let adjustedDonutHeight =
        adjustedDonutWidth / imagesData.donut.aspectRatio;

      // Si la altura ajustada es mayor que fixedHeight, reescalar por altura
      if (adjustedBarHeight > fixedHeight) {
        adjustedBarHeight = fixedHeight;
        adjustedBarWidth = adjustedBarHeight * imagesData.bar.aspectRatio;
      }
      if (adjustedDonutHeight > fixedHeight) {
        adjustedDonutHeight = fixedHeight;
        adjustedDonutWidth = adjustedDonutHeight * imagesData.donut.aspectRatio;
      }

      const actualTotalGraphWidth =
        adjustedBarWidth + spaceBetween + adjustedDonutWidth;
      const startX =
        margin + (availableWidthForGraphs - actualTotalGraphWidth) / 2;

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
    currentY = graphsStartY + fixedHeight + 10;
  } else {
    console.error(
      "Datos de imagen de gráficos (barra o dona) no encontrados o incompletos en imagesData."
    );
    // currentY se mantiene, la tabla empezará después del espacio de las tarjetas
    currentY += 10; // Añadir un pequeño espacio si los gráficos fallan
  }

  // Calcular la posición Y para la tabla después de las gráficas
  const tableStartY = currentY;

  autoTable(doc, {
    startY: tableStartY,
    margin: { left: margin },
    head: [
      [
        "ID de transacción",
        "Número de documento",
        "Referencia de pago",
        "Metodo de pago",
        "Valor pagado",
        "Fecha del pago",
        "Estado",
      ],
    ],
    body: filteredData.map((bill) => [
      bill["ID de transacción"],
      bill["Número de documento"],
      bill["Referencia de pago"],
      bill["Metodo de pago"],
      bill["Valor pagado"],
      bill["Fecha del pago"],
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

  //Pie de pagina
  doc.addImage(
    Icon,
    "PNG",
    margin,
    doc.internal.pageSize.getHeight() - 20,
    32,
    9
  );

  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setFont("Roboto", "normal");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.text(`Página ${i}/${pageCount}`, pageWidth - margin, pageHeight - 10, {
      align: "right",
    });
  }

  const pdfBlob = doc.output("blob");
  const pdfUrl = URL.createObjectURL(pdfBlob);
  setTimeout(() => {
    window.open(pdfUrl, "_blank");
    onFinish();
  }, 500);
};
