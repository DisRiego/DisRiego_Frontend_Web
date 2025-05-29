import { useEffect, useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
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
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { BiBorderRadius } from "react-icons/bi";
import Filter_consumption from "./filters/Filter_consumption";

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

const Consumption = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState("");
  const [loadingTable, setLoadingTable] = useState(false);
  const [loadingReport, setLoadingReport] = useState("");
  const [loadingPrediction, setLoadingPrediction] = useState("");
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

  const [showFilter, setShowFilter] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [statusFilter, setStatusFilter] = useState(false);
  const [filters, setFilters] = useState({
    typeInterval: {},
    property: {},
    lot: {},
    startDate: "",
    endDate: "",
    consumptionMin: "",
    consumptionMax: "",
  });

  const [id, setId] = useState(null);
  const [dots, setDots] = useState("");

  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [projectedMonthlyAvg, setProjectedMonthlyAvg] = useState({});
  const barContainerRef = useRef(null);
  const summaryContainerRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const head_data = {
    title: hasPermission("Ver todos los consumos")
      ? "Gestión de consumo"
      : "Mis consumos",
    description: hasPermission("Ver todos los consumos")
      ? "En esta sección podrás visualizar el consumo de agua registrado del distrito de riego."
      : "En esta sección podrás visualizar el consumo de agua registrado en tus lotes.",
    buttons: {
      ...((hasPermission("Generar reporte de todos los consumos") ||
        hasPermission("Generar reporte de un consumo de usuario")) && {
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

        if (hasPermission("Generar reporte de todos los consumos")) {
          if (!barContainerRef.current || !summaryContainerRef.current) {
            console.error(
              "No se pudo obtener alguna de las referencias necesarias para los gráficos"
            );
            setLoadingReport("");
            return;
          }

          const captureOptions = {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: null,
            windowWidth: 1200,
            windowHeight: 800,
          };

          const barCanvas = await html2canvas(barContainerRef.current, captureOptions);
          const barImage = barCanvas.toDataURL("image/png", 1.0);

          const summaryCanvas = await html2canvas(summaryContainerRef.current, captureOptions);
          const summaryImage = summaryCanvas.toDataURL("image/png", 1.0);

          const imagesData = {
            bar: {
              image: barImage,
              aspectRatio: barCanvas.width / barCanvas.height,
            },
            summary: {
              image: summaryImage,
              aspectRatio: summaryCanvas.width / summaryCanvas.height,
            },
          };

          generateReport(
            filteredData,
            toTitleCase,
            () => setLoadingReport(""),
            companyData,
            locationData,
            userData,
            imagesData
          );
        } else if (hasPermission("Generar reporte de un consumo de usuario")) {
          generateReportByUser(
            filteredData,
            toTitleCase,
            () => setLoadingReport(""),
            companyData,
            locationData,
            userData
          );
        }
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

  let parentComponent = "";

  if (hasPermission("Ver todos los consumos")) {
    parentComponent = "consumption";
  } else {
    if (hasPermission("Ver todos los consumos de un usuario")) {
      parentComponent = "consumptions";
    }
  }

  const handleFilterClick = () => {
    setShowFilter(true);
  };

  const options = [
    {
      icon: "BiShow",
      name: "Ver detalles",
    },
  ].filter(Boolean);

  let columns = [];
  if (hasPermission("Ver todos los consumos")) {
    columns = [
      "ID",
      "ID del predio",
      "ID del lote",
      "Número de documento",
      "Intervalo de pago",
      "Fecha de lectura",
      "Consumo registrado (m³)",
      "Opciones",
    ];
  } else {
    if (hasPermission("Ver todos los consumos de un usuario")) {
      columns = [
        "ID",
        "Nombre del predio",
        "Nombre del lote",
        "Intervalo de pago",
        "Fecha de lectura",
        "Consumo registrado (m³)",
        "Opciones",
      ];
    }
  }

  useEffect(() => {
    if (token && hasPermission("Ver detalles de un consumo")) {
      getConsumption();
    } else {
      if (token && hasPermission("Ver detalles de un consumo de un usuario")) {
        getConsumptionUser();
      }
    }
  }, [token]);

  const getConsumption = async () => {
    try {
      setLoadingTable(true);
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND_FACTURACTION +
          import.meta.env.VITE_ROUTE_BACKEND_GET_CONSUMPTION
      );

      const sortedData = response.data.sort((a, b) => {
        const dateA = new Date(a.measurement_date);
        const dateB = new Date(b.measurement_date);

        const dateStrA = dateA.toISOString().split("T")[0];
        const dateStrB = dateB.toISOString().split("T")[0];

        if (dateStrA !== dateStrB) {
          return dateStrB.localeCompare(dateStrA);
        }

        return b.measurement_id - a.measurement_id;
      });

      setIsAdmin(true);
      setData(sortedData);
    } catch (error) {
      console.error("Error al obtener las facturas:", error);
    } finally {
      setButtonDisabled(false);
      setLoadingTable(false);
    }
  };

  const getConsumptionUser = async () => {
    try {
      setLoadingTable(true);
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND_FACTURACTION +
          import.meta.env.VITE_ROUTE_BACKEND_GET_CONSUMPTION_USER +
          decodedToken.id +
          import.meta.env.VITE_ROUTE_BACKEND_GET_CONSUMPTION_USER_LOT
      );

      const sortedData = response.data.sort((a, b) => {
        const dateA = new Date(a.measurement_date);
        const dateB = new Date(b.measurement_date);

        const dateStrA = dateA.toISOString().split("T")[0];
        const dateStrB = dateB.toISOString().split("T")[0];

        if (dateStrA !== dateStrB) {
          return dateStrB.localeCompare(dateStrA);
        }

        return b.measurement_id - a.measurement_id;
      });

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
        .map((info) => {
          if (hasPermission("Ver detalles de un consumo")) {
            return {
              ID: info?.measurement_id,
              "ID del predio": info?.property_id,
              "ID del lote": info?.lot_id,
              "Número de documento": info?.document_number,
              "Intervalo de pago": info?.payment_interval,
              "Fecha de lectura": info?.measurement_date?.slice(0, 10),
              "Consumo registrado (m³)": info?.final_volume,
            };
          } else {
            if (hasPermission("Ver detalles de un consumo de un usuario")) {
              return {
                ID: info?.measurement_id,
                "Nombre del predio": info?.property_name,
                "Nombre del lote": info?.lot_name,
                "Intervalo de pago": info?.payment_interval,
                "Fecha de lectura": info?.measurement_date?.slice(0, 10),
                "Consumo registrado (m³)": info?.final_volume,
              };
            }
          }
        });

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

  useEffect(() => {
    if (data.length > 0) {
      const years = [
        ...new Set(
          data
            .filter((item) => item.measurement_date)
            .map((item) => {
              const parts = item.measurement_date.split("-");
              return parseInt(parts[0], 10);
            })
        ),
      ].sort((a, b) => b - a);

      setAvailableYears(years);

      if (years.length > 0 && !selectedYear) {
        setSelectedYear(years[0]);
      }
    }
  }, [data]);

  useEffect(() => {
    if (selectedYear && data.length > 0) {
      const facturasPorAnio = data.filter((item) => {
        if (!item.measurement_date) return false;
        const parts = item.measurement_date.split("-");
        return parseInt(parts[0], 10) === selectedYear;
      });

      const monthsWithData = [
        ...new Set(
          facturasPorAnio.map((item) => {
            const parts = item.measurement_date.split("-");
            return parseInt(parts[1], 10);
          })
        ),
      ].sort((a, b) => a - b);

      const monthObjects = monthsWithData.map((monthNum) => {
        const date = new Date(selectedYear, monthNum - 1, 1);
        return {
          number: monthNum,
          name: format(date, "MMM", { locale: es }),
          full: format(date, "MMMM", { locale: es }),
        };
      });

      setAvailableMonths(monthObjects);

      if (monthObjects.length > 0) {
        if (!selectedMonth || !monthsWithData.includes(selectedMonth.number)) {
          const sortedFacturas = [...facturasPorAnio].sort(
            (a, b) =>
              new Date(b.measurement_date) - new Date(a.measurement_date)
          );

          if (sortedFacturas.length > 0) {
            const latestMonth = parseInt(
              sortedFacturas[0].measurement_date.split("-")[1],
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

  const averageMonthlyConsumption = useMemo(() => {
    if (!data.length || !selectedYear) return 0;

    const consumosPorMes = {};

    data.forEach((item) => {
      const date = new Date(item.measurement_date);
      const year = date.getFullYear();
      const month = date.getMonth();

      if (year === selectedYear) {
        if (!consumosPorMes[month]) {
          consumosPorMes[month] = {
            total: 0,
            count: 0,
          };
        }

        consumosPorMes[month].total += item.final_volume;
        consumosPorMes[month].count += 1;
      }
    });

    const monthlyAverages = Object.values(consumosPorMes).map(
      (mes) => mes.total / mes.count
    );

    if (!monthlyAverages.length) return 0;

    const totalPromedios = monthlyAverages.reduce((sum, val) => sum + val, 0);
    const promedioFinal = totalPromedios / monthlyAverages.length;

    return parseFloat(promedioFinal.toFixed(2));
  }, [data, selectedYear]);

  useEffect(() => {
    const fetchProjectedData = async () => {
      if (!selectedYear) return;

      setLoadingPrediction("is-loading");

      try {
        let response = [];
        if (hasPermission("Ver todos los consumos")) {
          response = await axios.get(
            import.meta.env.VITE_URI_BACKEND_FACTURACTION +
              import.meta.env.VITE_ROUTE_BACKEND_PREDICTION_CONSUMPTION_MONTH +
              selectedYear
          );
        } else {
          if (hasPermission("Ver todos los consumos de un usuario")) {
            response = await axios.get(
              import.meta.env.VITE_URI_BACKEND_FACTURACTION +
                import.meta.env.VITE_ROUTE_BACKEND_GET_CONSUMPTION_USER +
                decodedToken.id +
                import.meta.env
                  .VITE_ROUTE_BACKEND_PREDICTION_CONSUMPTION_MONTH_USER +
                selectedYear
            );
          }
        }

        if (response?.data?.projected_monthly_avg) {
          setProjectedMonthlyAvg(response.data.projected_monthly_avg);
        } else {
          console.warn("Respuesta inesperada:", response.data);
          setProjectedMonthlyAvg({});
        }
      } catch (error) {
        console.error("Error al obtener consumo proyectado mensual:", error);
        setProjectedMonthlyAvg({});
      } finally {
        setLoadingPrediction("");
      }
    };

    fetchProjectedData();
  }, [selectedYear]);

  const averageProjectedConsumption = useMemo(() => {
    const values = Object.values(projectedMonthlyAvg).filter((v) => v > 0);
    if (values.length === 0) return 0;

    const total = values.reduce((acc, val) => acc + val, 0);
    return parseFloat((total / values.length).toFixed(2));
  }, [projectedMonthlyAvg]);

  const projectedVariation = useMemo(() => {
    if (averageMonthlyConsumption === 0 || averageProjectedConsumption === 0)
      return 0;

    return parseFloat(
      (
        ((averageProjectedConsumption - averageMonthlyConsumption) /
          averageMonthlyConsumption) *
        100
      ).toFixed(2)
    );
  }, [averageProjectedConsumption, averageMonthlyConsumption]);

  const getBarChartData = () => {
    if (!selectedYear) return { labels: [], datasets: [] };

    const consumosPorMes = {};

    data.forEach((item) => {
      const date = new Date(item.measurement_date);
      const year = date.getFullYear();
      const month = date.getMonth();

      if (year === selectedYear) {
        const key = month;
        if (!consumosPorMes[key]) {
          consumosPorMes[key] = { total: 0, count: 0 };
        }
        consumosPorMes[key].total += item.final_volume;
        consumosPorMes[key].count += 1;
      }
    });

    const labels = Array.from({ length: 12 }, (_, i) =>
      format(new Date(selectedYear, i, 1), "MMM", { locale: es })
    );

    const promedioMensual = Array.from({ length: 12 }, (_, i) => {
      const entry = consumosPorMes[i];
      return entry ? parseFloat((entry.total / entry.count).toFixed(2)) : 0;
    });

    const proyectadoMensual = Array.from({ length: 12 }, (_, i) => {
      const mes = i + 1;
      return projectedMonthlyAvg[mes] ?? 0;
    });

    return {
      labels,
      datasets: [
        {
          label: "Consumo promedio",
          data: promedioMensual,
          backgroundColor: "rgba(124, 168, 255, 1)",
          borderRadius: 6,
        },
        {
          label: "Consumo proyectado",
          data: proyectadoMensual,
          backgroundColor: "rgba(255, 214, 107, 1)",
          borderRadius: 6,
        },
      ],
    };
  };

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
          text: `Consumos (${selectedYear})`,
          font: {
            size: 14,
          },
        },
        tooltip: {
          callbacks: {
            title: (tooltipItems) => {
              const monthIndex = tooltipItems[0].dataIndex;
              const date = new Date(selectedYear, monthIndex, 1);
              const fullMonth = format(date, "MMMM", { locale: es });
              return toTitleCase(fullMonth);
            },
            label: (tooltipItem) => {
              return `Consumo promedio: ${tooltipItem.formattedValue} m³`;
            },
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
            text: "Cantidad (m³)",
          },
        },
        x: {
          stacked: true,
          title: {
            display: true,
            text: "Meses",
          },
        },
      },
    };
  };

  const toTitleCase = (str) => {
    if (typeof str !== "string") return str;
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const renderCharts = () => {
    return (
      <div className="container-cont mb-5">
        <div className="columns is-align-stretch">
          <div className="column is-three-quarters is-flex is-flex-direction-column">
            <div
              className="rol-detail graph-consumption is-flex is-flex-direction-column"
              ref={barContainerRef}
            >
              <div className="is-flex is-justify-content-space-between is-align-items-center mb-2">
                <h3 className="has-text-weight-bold mb-2">
                  Consumos totales (m³)
                </h3>
                <div className="is-flex is-align-items-center">
                  <div className="is-flex is-align-items-center mr-4">
                    {loadingPrediction === "" && (
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
                        <span className="is-size-7">Consumo proyectado</span>
                      </div>
                    )}

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
                      <span className="is-size-7">Consumo promedio</span>
                    </div>
                  </div>

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
              <div className="is-flex-grow-1 is-flex">
                <Bar data={getBarChartData()} options={getBarOptions()} />
              </div>
            </div>
          </div>
          <div className="column is-flex is-flex-direction-column">
            <div className="rol-detail" ref={summaryContainerRef}>
              <p className="has-text-weight-bold">
                Detalles del año {selectedYear}
              </p>
              <div className="fixed-grid has-1-cols-desktop has-1-cols-mobile">
                <div className="rol-detail mt-4">
                  <p className="has-text-weight-bold mb-2">
                    Consumo promedio mensual
                  </p>
                  <p className="has-text-weight-bold">
                    {averageMonthlyConsumption} m³
                  </p>
                </div>
                {loadingPrediction ? (
                  <>
                    <div className="rol-detail">
                      <div className="loader-cell">
                        <p className="is-size-6 has-text-weight-bold mb-2">
                          Consumo promedio mensual proyectado
                        </p>
                        <div className="loader cont-loader loader-graph"></div>
                        <p className="loader-text"></p>
                      </div>
                    </div>
                    <div className="rol-detail">
                      <div className="loader-cell">
                        <p className="has-text-weight-bold mb-2">
                          Variación esperada
                        </p>
                        <div className="loader cont-loader loader-graph"></div>
                        <p className="loader-text"></p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="rol-detail">
                      <p className="is-size-6 has-text-weight-bold mb-2">
                        Consumo promedio mensual proyectado
                      </p>
                      <p className="has-text-weight-bold">
                        {averageProjectedConsumption} m³
                      </p>
                    </div>
                    <div className="rol-detail mb-0">
                      <p className="has-text-weight-bold mb-2">
                        Variación esperada
                      </p>
                      <p className="has-text-weight-bold">
                        {projectedVariation}%
                      </p>
                    </div>
                  </>
                )}
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
          <div className="container-cont">{renderCharts()}</div>
          <div className="container-search">
            <Search onSearch={setSearchTerm} buttonDisabled={buttonDisabled} />
            <Filter
              onFilterClick={handleFilterClick}
              data={data}
              buttonDisabled={buttonDisabled}
            />
          </div>
          <Table
            columns={columns}
            data={paginatedData}
            options={options}
            loadingTable={loadingTable}
            setId={setId}
            parentComponent={parentComponent}
          />
          <Pagination
            totalItems={filteredData.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </>
      )}
      {showFilter && (
        <>
          <Filter_consumption
            onClose={() => setShowFilter(false)}
            data={data}
            filteredData={filteredData}
            setFilteredData={setFilteredData}
            setStatusFilter={setStatusFilter}
            filters={filters}
            setFilters={setFilters}
            backupData={backupData}
            hasPermission={hasPermission}
            isAdmin={isAdmin}
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

export default Consumption;

const generateReport = (
  filteredData,
  toTitleCase,
  onFinish,
  companyData,
  locationNames,
  userData,
  imagesData
) => {
  const doc = new jsPDF("landscape");

  doc.addFont(RobotoNormalFont, "Roboto", "normal");
  doc.addFont(RobotoBoldFont, "Roboto", "bold");

  doc.setFillColor(243, 242, 247);
  doc.rect(0, 0, 300, 53, "F");

  doc.addImage(Icon, "PNG", 246, 10, 39, 11);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(17);
  doc.setFont("Roboto", "bold");
  doc.text("CONSOLIDADOS DE CONSUMOS", 12, 18);
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

  doc.setTextColor(0, 0, 0);
  doc.setFont("Roboto", "bold");
  doc.text("Resumen de consumo", 12, 63);
  doc.setTextColor(94, 100, 112);
  doc.setFont("Roboto", "normal");
  doc.text(`Cantidad de consumos: ${filteredData.length}`, 12, 68);

  const margin = 12;
  const pdfWidth = doc.internal.pageSize.getWidth();
  const availableWidth = pdfWidth - 2 * margin;
  const graphsStartY = 72;
  const maxGraphHeight = 90;
  const spaceBetween = 10;

  let barHeight = maxGraphHeight;
  let barWidth = barHeight * imagesData.bar.aspectRatio;

  let summaryHeight = maxGraphHeight;
  let summaryWidth = summaryHeight * imagesData.summary.aspectRatio;

  const totalWidth = barWidth + spaceBetween + summaryWidth;

  if (totalWidth > availableWidth) {
    const scaleFactor = availableWidth / totalWidth;
    barWidth *= scaleFactor;
    barHeight *= scaleFactor;
    summaryWidth *= scaleFactor;
    summaryHeight *= scaleFactor;
  }

  const startX =
    margin + (availableWidth - (barWidth + spaceBetween + summaryWidth)) / 2;

  doc.addImage(
    imagesData.bar.image,
    "PNG",
    startX,
    graphsStartY,
    barWidth,
    barHeight
  );

  doc.addImage(
    imagesData.summary.image,
    "PNG",
    startX + barWidth + spaceBetween,
    graphsStartY,
    summaryWidth,
    summaryHeight
  );

  const tableStartY = graphsStartY + Math.max(barHeight, summaryHeight) + 10;

  autoTable(doc, {
    startY: tableStartY,
    margin: { left: 12 },
    head: [
      [
        "ID del predio",
        "ID del lote",
        "Número de documento",
        "Intervalo de pago",
        "Fecha de lectura",
        "Consumo registrado (m³)",
      ],
    ],
    body: filteredData.map((bill) => [
      bill["ID del predio"],
      bill["ID del lote"],
      bill["Número de documento"],
      bill["Intervalo de pago"],
      bill["Fecha de lectura"],
      bill["Consumo registrado (m³)"],
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

  doc.addImage(Icon, "PNG", 12, 190, 32, 9);

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

  const pdfBlob = doc.output("blob");
  const pdfUrl = URL.createObjectURL(pdfBlob);

  setTimeout(() => {
    window.open(pdfUrl, "_blank");
    onFinish();
  }, 500);
};

const generateReportByUser = (
  filteredData,
  toTitleCase,
  onFinish,
  companyData,
  locationNames,
  userData
) => {
  const doc = new jsPDF("landscape");

  doc.addFont(RobotoNormalFont, "Roboto", "normal");
  doc.addFont(RobotoBoldFont, "Roboto", "bold");

  doc.setFillColor(243, 242, 247);
  doc.rect(0, 0, 300, 53, "F");

  doc.addImage(Icon, "PNG", 246, 10, 39, 11);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(17);
  doc.setFont("Roboto", "bold");
  doc.text("CONSOLIDADOS DE CONSUMOS", 12, 18);
  doc.setFontSize(11);
  doc.text(`Fecha de generación:`, 12, 27);
  doc.text(`Generado por:`, 12, 39);
  doc.text("Consumos actuales", 12, 63);

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
  doc.text(`Cantidad de consumos: ${filteredData.length}`, 12, 68);

  autoTable(doc, {
    startY: 80,
    margin: { left: 12 },
    head: [
      [
        "Nombre del predio",
        "Nombre del lote",
        "Intervalo de pago",
        "Fecha de lectura",
        "Consumo registrado (m³)",
      ],
    ],
    body: filteredData.map((bill) => [
      bill["Nombre del predio"],
      bill["Nombre del lote"],
      bill["Intervalo de pago"],
      bill["Fecha de lectura"],
      bill["Consumo registrado (m³)"],
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

  doc.addImage(Icon, "PNG", 12, 190, 32, 9);

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

  const pdfBlob = doc.output("blob");
  const pdfUrl = URL.createObjectURL(pdfBlob);

  setTimeout(() => {
    window.open(pdfUrl, "_blank");
    onFinish();
  }, 500);
};