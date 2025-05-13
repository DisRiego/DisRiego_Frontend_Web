import { useEffect, useMemo, useState, useRef } from "react";
import html2canvas from "html2canvas";
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
import { format, subMonths, subYears } from "date-fns";
import { es } from "date-fns/locale";
import { BiBorderRadius } from "react-icons/bi";

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

const Billing = () => {
  const [activePeriodBar, setActivePeriodBar] = useState("anual");
  const [activePeriodDonut, setActivePeriodDonut] = useState("anual");
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState("");
  const [loadingTable, setLoadingTable] = useState(false);
  const [loadingReport, setLoadingReport] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const itemsPerPage = 5;
  const barContainerRef = useRef(null); // gráfica de barrass
  const donutContainerRef = useRef(null); // grafica pastel
  const cardsContainerRef = useRef(null); // tarjetas de resumen

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

        // Capturar el contenedor de tarjetas de resumen
        const cardsCanvas = await html2canvas(cardsContainerRef.current, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: null,
        });
        const cardsImage = cardsCanvas.toDataURL("image/png");

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

        // Generar el reporte con los datos obtenidos
        generateReportWithCharts(
          filteredData,
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
          issue_date: "2025-02-01",
          due_date: "2025-04-30",
          amount_due: 150000,
          attachment: "factura_fac-001.pdf",
          status_name: "Vencida", 
        },
        {
          id: 2,
          property_id: 102,
          lot_id: 8,
          owner_document_number: "9876543210",
          payment_interval_name: "Bimestral",
          issue_date: "2025-03-05",
          due_date: "2025-06-05",
          amount_due: 300000,
          attachment: "factura_fac-002.pdf",
          status_name: "Pagada", 
        },
        {
          id: 6,
          property_id: 105,
          lot_id: 3,
          owner_document_number: "1212131314",
          payment_interval_name: "Trimestral",
          issue_date: "2025-05-10", 
          due_date: "2025-07-10", 
          amount_due: 480000,
          attachment: "factura_fac-006.pdf",
          status_name: "Pagada", 
        },
        {
          id: 7,
          property_id: 101,
          lot_id: 6,
          owner_document_number: "2233445566",
          payment_interval_name: "Bimestral",
          issue_date: "2025-04-20", 
          due_date: "2025-05-20", 
          amount_due: 320000,
          attachment: "factura_fac-007.pdf",
          status_name: "Pendiente", 
        },
        {
          id: 8,
          property_id: 106,
          lot_id: 7,
          owner_document_number: "3344556677",
          payment_interval_name: "Anual",
          issue_date: "2024-10-01", 
          due_date: "2025-01-01", 
          amount_due: 600000,
          attachment: "factura_fac-008.pdf",
          status_name: "Vencida", 
        },
        {
          id: 9,
          property_id: 107,
          lot_id: 9,
          owner_document_number: "4455667788",
          payment_interval_name: "Mensual",
          issue_date: "2025-04-15", 
          due_date: "2025-05-15", 
          amount_due: 170000,
          attachment: "factura_fac-009.pdf",
          status_name: "Pendiente", 
        },
        {
          id: 10,
          property_id: 108,
          lot_id: 4,
          owner_document_number: "5566778899",
          payment_interval_name: "Mensual",
          issue_date: "2024-11-01", 
          due_date: "2024-11-30", 
          amount_due: 145000,
          attachment: "factura_fac-010.pdf",
          status_name: "Pagada", 
        },
        {
          id: 11,
          property_id: 109,
          lot_id: 10,
          owner_document_number: "7788990011",
          payment_interval_name: "Trimestral",
          issue_date: "2024-09-15", 
          due_date: "2024-12-15", 
          amount_due: 420000,
          attachment: "factura_fac-011.pdf",
          status_name: "Vencida",
        },
        {
          id: 12,
          property_id: 102, 
          lot_id: 8,
          owner_document_number: "9876543210",
          payment_interval_name: "Anual",
          issue_date: "2024-12-20", 
          due_date: "2025-12-20", 
          amount_due: 700000,
          attachment: "factura_fac-012.pdf",
          status_name: "Pendiente", 
        },
        {
          id: 13,
          property_id: 110,
          lot_id: 11,
          owner_document_number: "8899001122",
          payment_interval_name: "Bimestral",
          issue_date: "2025-04-20", 
          due_date: "2025-06-20", 
          amount_due: 310000,
          attachment: "factura_fac-013.pdf",
          status_name: "Pagada", 
        },
        {
          id: 14,
          property_id: 104, 
          lot_id: 1,
          owner_document_number: "6677889900",
          payment_interval_name: "Mensual",
          issue_date: "2025-05-10", 
          due_date: "2025-06-10", 
          amount_due: 165000,
          attachment: "factura_fac-014.pdf",
          status_name: "Pendiente", 
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
          "Fecha de emisión": info.issue_date?.slice(0, 10),
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

  // Función para generar etiquetas de fecha según el período seleccionado
  const generateDateLabels = (period) => {
    const today = new Date();
    let labels = [];
    let formatStr = "";

    switch (period) {
      case "trimestral":
        formatStr = "MMM";
        for (let i = 3; i >= 0; i--) {
          labels.push(format(subMonths(today, i), formatStr, { locale: es }));
        }
        break;
      case "semestral":
        formatStr = "MMM";
        for (let i = 5; i >= 0; i--) {
          labels.push(format(subMonths(today, i), formatStr, { locale: es }));
        }
        break;
      case "anual":
        formatStr = "MMM";
        for (let i = 11; i >= 0; i--) {
          labels.push(format(subMonths(today, i), formatStr, { locale: es }));
        }
        break;
      default:
        return [
          "Ene",
          "Feb",
          "Mar",
          "Abr",
          "May",
          "Jun",
          "Jul",
          "Ago",
          "Sep",
          "Oct",
          "Nov",
          "Dic",
        ];
    }
    return labels;
  };

  // Función para generar datos del gráfico de barras basados en los datos de facturación
  const getBarChartData = (period) => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Determinar cuántos meses mostrar según el período
    let numMeses;
    switch (period) {
      case "trimestral":
        numMeses = 3;
        break;
      case "semestral":
        numMeses = 6;
        break;
      case "anual":
      default:
        numMeses = 12;
        break;
    }

    // Generar datos de los meses y etiquetas
    const labels = [];
    const mesesData = [];

    // array con información de los meses a mostrar
    for (let i = numMeses - 1; i >= 0; i--) {
      let targetMonth = currentMonth - i;
      let targetYear = currentYear;

      // Ajustar si necesitamos ir al año anterior
      while (targetMonth < 0) {
        targetMonth += 12;
        targetYear -= 1;
      }

      mesesData.push({
        month: targetMonth,
        year: targetYear,
        pendientes: 0,
        pagadas: 0,
        vencidas: 0,
      });

      // Crear una fecha para obtener el nombre del mes para la etiqueta
      const tempDate = new Date(targetYear, targetMonth, 1);
      labels.push(format(tempDate, "MMM", { locale: es }));
    }

    // Agrupar facturas por estado y mes
    data.forEach((factura) => {
      if (!factura.issue_date) return; 

      const fechaParts = factura.issue_date.split("-");
      if (fechaParts.length !== 3) return;

      const year = parseInt(fechaParts[0], 10);
      const month = parseInt(fechaParts[1], 10) - 1; 
      const day = parseInt(fechaParts[2], 10);

      if (isNaN(year) || isNaN(month) || isNaN(day)) return;

      // Buscar si este mes/año está en nuestro rango de visualización
      const mesIndex = mesesData.findIndex(
        (m) => m.month === month && m.year === year
      );

      if (mesIndex !== -1) {
        const estado = factura.status_name?.toLowerCase();
        if (estado === "pendiente") {
          mesesData[mesIndex].pendientes += 1;
        } else if (estado === "pagada") {
          mesesData[mesIndex].pagadas += 1;
        } else if (estado === "vencida") {
          mesesData[mesIndex].vencidas += 1;
        }
      }
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
          backgroundColor: "rgba(255,214,107, 0.6)",
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

  // Función para generar datos del gráfico circular (donut)
  const getDonutChartData = () => {
    const mesesMap = {
      ene: 0,
      feb: 1,
      mar: 2,
      abr: 3,
      may: 4,
      jun: 5,
      jul: 6,
      ago: 7,
      sept: 8,
      oct: 9,
      nov: 10,
      dic: 11,
    };

    // Calcular montos totales por estado
    const montosPorEstado = {
      pendiente: 0,
      pagada: 0,
      vencida: 0,
    };

    // Filtrar por mes si no es "anual"
    if (activePeriodDonut !== "anual") {
      const mesSeleccionado = mesesMap[activePeriodDonut];
      if (mesSeleccionado !== undefined) {
        data.forEach((factura) => {
          if (!factura.issue_date) return;

          // Convertir string de fecha a objeto Date
          const fechaParts = factura.issue_date.split("-");
          if (fechaParts.length !== 3) return;

          const month = parseInt(fechaParts[1], 10) - 1; 

          // Sólo incluir facturas del mes seleccionado
          if (month === mesSeleccionado) {
            const estado = factura.status_name?.toLowerCase();
            if (estado === "pendiente")
              montosPorEstado.pendiente += factura.amount_due;
            else if (estado === "pagada")
              montosPorEstado.pagada += factura.amount_due;
            else if (estado === "vencida")
              montosPorEstado.vencida += factura.amount_due;
          }
        });
      }
    } else {
      // Si es anual, incluir todas las facturas
      data.forEach((factura) => {
        const estado = factura.status_name?.toLowerCase();
        if (estado === "pendiente")
          montosPorEstado.pendiente += factura.amount_due;
        else if (estado === "pagada")
          montosPorEstado.pagada += factura.amount_due;
        else if (estado === "vencida")
          montosPorEstado.vencida += factura.amount_due;
      });
    }

    return {
      labels: ["Pendientes", "Pagadas", "Vencidas"],
      datasets: [
        {
          data: [
            montosPorEstado.pendiente,
            montosPorEstado.pagada,
            montosPorEstado.vencida,
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

  // Opciones para el gráfico de barras
  const getBarOptions = (period) => {
    let titleText = "Facturas generadas";

    switch (period) {
      case "trimestral":
        titleText += " (últimos 3 meses)";
        break;
      case "semestral":
        titleText += " (últimos 6 meses)";
        break;
      case "anual":
        titleText += " (últimos 12 meses)";
        break;
    }

    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false, 
        },
        title: {
          display: true,
          text: titleText,
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

  // Calcular el monto total para mostrar en el centro del donut
  const calcularMontoTotal = () => {
    const mesesMap = {
      ene: 0,
      feb: 1,
      mar: 2,
      abr: 3,
      may: 4,
      jun: 5,
      jul: 6,
      ago: 7,
      sept: 8,
      oct: 9,
      nov: 10,
      dic: 11,
    };

    // Si es un mes específico, filtrar
    if (activePeriodDonut !== "anual") {
      const mesSeleccionado = mesesMap[activePeriodDonut];
      if (mesSeleccionado !== undefined) {
        return data.reduce((total, factura) => {
          if (!factura.issue_date) return total;

          // Convertir string de fecha a objeto Date
          const fechaParts = factura.issue_date.split("-");
          if (fechaParts.length !== 3) return total;

          const month = parseInt(fechaParts[1], 10) - 1; // Meses en JS son 0-11

          // Sólo incluir facturas del mes seleccionado
          if (month === mesSeleccionado) {
            return total + factura.amount_due;
          }
          return total;
        }, 0);
      }
    }

    // Si es anual o el mes no es válido, mostrar el total general
    return data.reduce((total, factura) => total + factura.amount_due, 0);
  };

  const montoTotal = formatCurrency(calcularMontoTotal());
  const renderCharts = () => {
    return (
      <div className="container-cont mb-5">
        <div className="columns">
          <div className="column is-8">
            <div className="rol-detail" ref={barContainerRef}>
              <div className="is-flex is-justify-content-space-between is-align-items-center mb-2">
                <h3 className="subtitle is-6 mb-2">Facturas generadas</h3>
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
                          backgroundColor: "rgba(255,214,107, 0.6)",
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

                  {/* Desplegable */}
                  <div className="select is-small">
                    <select
                      value={activePeriodBar}
                      onChange={(e) => setActivePeriodBar(e.target.value)}
                    >
                      <option value="trimestral">Trimestral</option>
                      <option value="semestral">Semestral</option>
                      <option value="anual">Anual</option>
                    </select>
                  </div>
                </div>
              </div>
              <div style={{ height: "300px" }}>
                <Bar
                  data={getBarChartData(activePeriodBar)}
                  options={getBarOptions(activePeriodBar)}
                />
              </div>
            </div>
          </div>
          <div className="column is-4">
            <div ref={donutContainerRef} className="rol-detail">
              <div className="is-flex is-justify-content-space-between is-align-items-center mb-4">
                <h3 className="subtitle is-6 mb-0">Total facturado</h3>
                <div className="select is-small">
                  <select
                    value={activePeriodDonut}
                    onChange={(e) => setActivePeriodDonut(e.target.value)}
                  >
                    <option value="sept">Sept.</option>
                    <option value="oct">Oct.</option>
                    <option value="nov">Nov.</option>
                    <option value="dic">Dic.</option>
                    <option value="ene">Ene.</option>
                    <option value="feb">Feb.</option>
                    <option value="mar">Mar.</option>
                    <option value="abr">Abr.</option>
                    <option value="may">May.</option>
                    <option value="jun">Jun.</option>
                    <option value="jul">Jul.</option>
                    <option value="ago">Ago.</option>
                    <option value="anual">Anual</option>
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
                    <p className="is-size-6 mb-0">Total</p>
                    <p className="is-size-5 has-text-weight-bold">
                      {montoTotal}
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
                      <span className="is-size-7">Transacciones aprobadas</span>
                      <span className="is-size-7">
                        {formatCurrency(
                          getDonutChartData().datasets[0].data[1]
                        )}
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
                        {formatCurrency(
                          getDonutChartData().datasets[0].data[0]
                        )}
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
                      <span className="is-size-7">
                        Transacciones rechazadas
                      </span>
                      <span className="is-size-7">
                        {formatCurrency(
                          getDonutChartData().datasets[0].data[2]
                        )}
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
          <div className="container-cont">
            <div className="total_amount" ref={cardsContainerRef}>
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
          </div>
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

export default Billing;
const generateReportWithCharts = (
  filteredData,
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
    [userData?.name, userData?.first_last_name, userData?.second_last_name]
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
  const startY = 72;
  const margin = 12;
  const pdfWidth = doc.internal.pageSize.getWidth();
  const availableWidth = pdfWidth - 2 * margin;

  // Calcular dimensiones para las tarjetas manteniendo la proporción
  const cardsAspectRatio = imagesData.cards.aspectRatio;
  const cardsWidth = availableWidth;
  const cardsHeight = cardsWidth / cardsAspectRatio;

  // Añadir imagen de las tarjetas
  doc.addImage(
    imagesData.cards.image,
    "PNG",
    margin,
    startY,
    cardsWidth,
    cardsHeight
  );

  // Calcular posición para las gráficas
  const graphsStartY = startY + cardsHeight + 5;

  // Establecer dimensiones para las gráficas (misma altura para ambas)
  const fixedHeight = 85; // Altura fija en mm

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
