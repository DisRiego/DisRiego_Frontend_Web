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
import { format, set } from "date-fns";
import { jsPDF } from "jspdf";
import Icon from "../../assets/icons/Disriego_title.png";
import { autoTable } from "jspdf-autotable";
import RobotoNormalFont from "../../assets/fonts/Roboto-Regular.ttf";
import RobotoBoldFont from "../../assets/fonts/Roboto-Bold.ttf";

const Transaction = () => {
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
      const transfer = [
        {
          id: 1,
          owner_document_number: "9876543210",
          payment_reference: "REF00001",
          payment_method: "Tarjeta",
          value: 180000,
          date_payment: "2023-03-15 14:32:00",
          status_name: "Aprobada",
        },
        {
          id: 2,
          owner_document_number: "1234567890",
          payment_reference: "REF00002",
          payment_method: "PSE",
          value: 245000,
          date_payment: "2023-06-21 10:15:00",
          status_name: "Pendiente",
        },
        {
          id: 3,
          owner_document_number: "1098765432",
          payment_reference: "REF00003",
          payment_method: "Tarjeta",
          value: 320000,
          date_payment: "2024-01-05 08:40:00",
          status_name: "Aprobada",
        },
        {
          id: 4,
          owner_document_number: "2223334445",
          payment_reference: "REF00004",
          payment_method: "PSE",
          value: 150000,
          date_payment: "2025-02-28 12:00:00",
          status_name: "Aprobada",
        },
        {
          id: 5,
          owner_document_number: "9988776655",
          payment_reference: "REF00005",
          payment_method: "Tarjeta",
          value: 275000,
          date_payment: "2024-08-10 16:45:00",
          status_name: "Rechazada",
        },
        {
          id: 6,
          owner_document_number: "8765432109",
          payment_reference: "REF00006",
          payment_method: "PSE",
          value: 220000,
          date_payment: "2023-12-19 09:30:00",
          status_name: "Pendiente",
        },
        {
          id: 7,
          owner_document_number: "1122334455",
          payment_reference: "REF00007",
          payment_method: "Tarjeta",
          value: 310000,
          date_payment: "2025-04-10 11:10:00",
          status_name: "Aprobada",
        },
        {
          id: 8,
          owner_document_number: "4433221100",
          payment_reference: "REF00008",
          payment_method: "PSE",
          value: 195000,
          date_payment: "2024-05-14 13:00:00",
          status_name: "Pendiente",
        },
        {
          id: 9,
          owner_document_number: "3216549870",
          payment_reference: "REF00009",
          payment_method: "Tarjeta",
          value: 360000,
          date_payment: "2025-07-22 07:20:00",
          status_name: "Aprobada",
        },
        {
          id: 10,
          owner_document_number: "7891234560",
          payment_reference: "REF00010",
          payment_method: "PSE",
          value: 200000,
          date_payment: "2023-09-17 18:05:00",
          status_name: "Pendiente",
        },
        {
          id: 11,
          owner_document_number: "6547893210",
          payment_reference: "REF00011",
          payment_method: "Tarjeta",
          value: 245500,
          date_payment: "2025-01-26 15:30:00",
          status_name: "Aprobada",
        },
        {
          id: 12,
          owner_document_number: "1010101010",
          payment_reference: "REF00012",
          payment_method: "PSE",
          value: 289000,
          date_payment: "2024-03-30 14:10:00",
          status_name: "Rechazada",
        },
        {
          id: 13,
          owner_document_number: "2020202020",
          payment_reference: "REF00013",
          payment_method: "Tarjeta",
          value: 275500,
          date_payment: "2025-06-12 09:50:00",
          status_name: "Pendiente",
        },
        {
          id: 14,
          owner_document_number: "3030303030",
          payment_reference: "REF00014",
          payment_method: "PSE",
          value: 330000,
          date_payment: "2023-10-25 08:00:00",
          status_name: "Aprobada",
        },
        {
          id: 15,
          owner_document_number: "4040404040",
          payment_reference: "REF00015",
          payment_method: "Tarjeta",
          value: 198000,
          date_payment: "2024-07-07 17:40:00",
          status_name: "Rechazada",
        },
        {
          id: 16,
          owner_document_number: "5050505050",
          payment_reference: "REF00016",
          payment_method: "PSE",
          value: 215000,
          date_payment: "2024-09-13 10:25:00",
          status_name: "Aprobada",
        },
        {
          id: 17,
          owner_document_number: "6060606060",
          payment_reference: "REF00017",
          payment_method: "Tarjeta",
          value: 248000,
          date_payment: "2023-11-01 11:45:00",
          status_name: "Pendiente",
        },
        {
          id: 18,
          owner_document_number: "7070707070",
          payment_reference: "REF00018",
          payment_method: "PSE",
          value: 220000,
          date_payment: "2025-03-03 07:55:00",
          status_name: "Rechazada",
        },
        {
          id: 19,
          owner_document_number: "8080808080",
          payment_reference: "REF00019",
          payment_method: "Tarjeta",
          value: 290000,
          date_payment: "2023-04-04 19:00:00",
          status_name: "Aprobada",
        },
        {
          id: 20,
          owner_document_number: "9090909090",
          payment_reference: "REF00020",
          payment_method: "PSE",
          value: 180000,
          date_payment: "2024-02-11 06:30:00",
          status_name: "Rechazada",
        },
      ];

      const sortedData = transfer.sort((a, b) => b.id - a.id);

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
        .map((item) => new Date(item.date_payment))
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
        const date = new Date(item.date_payment);
        return date.getFullYear() === parseInt(yearFilter);
      });
    }

    if (monthFilter && monthFilter !== "" && yearFilter !== "ALL") {
      filtered = filtered.filter((item) => {
        const date = new Date(item.date_payment);
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
        (item) => item.status_name === statusFilterValue
      );
    }

    const formatted = filtered.map((info) => ({
      ID: info.id,
      "ID de transacción": info.id,
      "Número de documento": info.owner_document_number,
      "Referencia de pago": info.payment_reference,
      "Metodo de pago": info.payment_method,
      "Valor pagado": formatCurrency(info.value),
      "Fecha del pago": formatDateTime(info.date_payment),
      Estado: info.status_name,
    }));

    setFilteredData(formatted);
  }, [data, yearFilter, monthFilter, methodFilter, statusFilterValue]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const availableYears = useMemo(() => {
    return [
      ...new Set(data.map((item) => new Date(item.date_payment).getFullYear())),
    ].sort((a, b) => a - b);
  }, [data]);

  const availableMonths = useMemo(() => {
    if (!yearFilter) return [];

    const monthsInYear = data
      .filter(
        (item) =>
          new Date(item.date_payment).getFullYear() === parseInt(yearFilter)
      )
      .map((item) => new Date(item.date_payment).getMonth());

    const uniqueMonths = Array.from(new Set(monthsInYear)).sort(
      (a, b) => a - b
    );
    return uniqueMonths;
  }, [data, yearFilter]);

  const availableMethods = useMemo(() => {
    return [...new Set(data.map((item) => item.payment_method))];
  }, [data]);

  const availableStatuses = useMemo(() => {
    return [...new Set(data.map((item) => item.status_name))].sort((a, b) =>
      a.localeCompare(b)
    );
  }, [data]);

  const filteredStats = useMemo(() => {
    const selectedYear = parseInt(yearFilter);
    const selectedMonth = parseInt(monthFilter);

    const filtered = data.filter((item) => {
      const date = new Date(item.date_payment);
      const yearMatch = !yearFilter || date.getFullYear() === selectedYear;
      const monthMatch = !monthFilter || date.getMonth() + 1 === selectedMonth;
      const methodMatch = !methodFilter || item.payment_method === methodFilter;
      const statusMatch =
        !statusFilterValue || item.status_name === statusFilterValue;
      return yearMatch && monthMatch && methodMatch && statusMatch;
    });

    const annualIncome = filtered
      .filter(
        (item) => new Date(item.date_payment).getFullYear() === selectedYear
      )
      .reduce((sum, item) => sum + item.value, 0);

    const monthlyIncome = filtered
      .filter((item) => {
        const date = new Date(item.date_payment);
        return (
          date.getFullYear() === selectedYear &&
          date.getMonth() + 1 === selectedMonth
        );
      })
      .reduce((sum, item) => sum + item.value, 0);

    const monthlyTransactions = filtered.filter((item) => {
      const date = new Date(item.date_payment);
      return (
        date.getFullYear() === selectedYear &&
        date.getMonth() + 1 === selectedMonth
      );
    });

    const rejectedTransactions = monthlyTransactions.filter(
      (item) => item.status_name === "Rechazada"
    );

    const rejectionRate = monthlyTransactions.length
      ? (rejectedTransactions.length / monthlyTransactions.length) * 100
      : 0;

    return {
      annualIncome,
      monthlyIncome,
      rejectionRate,
    };
  }, [data, yearFilter, monthFilter, methodFilter, statusFilterValue]);

  const totalIncome = useMemo(() => {
    return data.reduce((sum, item) => sum + item.value, 0);
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
                            <option value="">Mes</option>
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
                <div className="grid">
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
  doc.text("CONSOLIDADOS DE TRANSACCIONES", 12, 18);
  doc.setFontSize(11);
  doc.text(`Fecha de generación:`, 12, 27);
  doc.text(`Generado por:`, 12, 39);
  /*doc.setTextColor(94, 100, 112);*/
  doc.text("Transacciones actuales", 12, 63);

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
  doc.text(`Cantidad: ${filteredData.length}`, 12, 68);

  // Resto de cosas del PDF
  autoTable(doc, {
    startY: 80,
    margin: { left: 12 },
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
