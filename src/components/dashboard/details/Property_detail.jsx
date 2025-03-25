import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Bar, Line } from "react-chartjs-2";
import "../../../styles/index.css";
import Head from "../Head";
import Table from "../Table";
import Pagination from "../Pagination";
import Lot from "../Lot";
import Iot_by_property from "../Iot_by_property";
import RobotoNormalFont from "../../../assets/fonts/Roboto-Regular.ttf";
import RobotoBoldFont from "../../../assets/fonts/Roboto-Bold.ttf";
import Icon from "../../../assets/icons/Disriego_title.png";
import { format, subDays, subWeeks, subMonths, subYears } from "date-fns";
import { jsPDF } from "jspdf"; // Importa jsPDF
import { autoTable } from "jspdf-autotable"; // componentes de Chart.js usados en el componente
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);
import { IoDocument } from "react-icons/io5";

const Property_detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState("");
  const [dots, setDots] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState("consumo");
  const [activePeriod, setActivePeriod] = useState("mes");
  const [activePeriodRight, setActivePeriodRight] = useState("año");
  const [dataLots, setDataLots] = useState([]);
  const [loadingTable, setLoadingTable] = useState(false);
  const [activeOption, setActiveOption] = useState("lot");

  const head_data = {
    title: "Detalles del predio #" + id,
    description:
      "En esta sección podrás visualizar información detallada sobre el predio.",
    buttons: {
      button1: {
        icon: "FaPlus",
        class: "color-hover",
        text: "Añadir lote",
      },
      button2: {
        icon: "LuDownload",
        class: "",
        text: "Descargar reporte",
      },
    },
  };

  const handleButtonClick = (buttonText) => {
    if (buttonText === "Añadir lote") {
      setShowForm(true);
    }

    if (buttonText === "Descargar reporte") {
      setLoading("is-loading");
      generateReport();
    }
  };
  //Generar reporte de predio
  const generateReport = () => {
    const doc = new jsPDF();
    // Datos del predio actual
    // const currentProperty = mockData.find(
    //   (property) => property.id === parseInt(id)
    // );
    // // Filtra los lotes que pertenecen al predio actual
    // const lotsForProperty = lotMockData.filter(
    //   (lot) => lot.property_id === parseInt(id)
    // );

    // Add Roboto font to the document
    doc.addFont(RobotoNormalFont, "Roboto", "normal");
    doc.addFont(RobotoBoldFont, "Roboto", "bold");
    //colorear fondo
    doc.setFillColor(243, 242, 247);
    doc.rect(0, 0, 210, 53, "F"); // colorear una parte de la pagina
    // agregar logo (usando base 64 directamente sobre la importacion)
    doc.addImage(Icon, "PNG", 156, 10, 39, 11);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(17);
    doc.setFont("Roboto", "bold");
    doc.text("REPORTE PREDIAL", 12, 18);
    doc.setFontSize(11);
    doc.text(`Fecha de generación:`, 12, 27);
    doc.text(`Generado por:`, 12, 39);
    /*doc.setTextColor(94, 100, 112);*/
    doc.text("Datos del dueño", 12, 63);
    doc.text("Datos del predio", 12, 100);

    doc.setTextColor(94, 100, 112);
    doc.setFont("Roboto", "normal");
    doc.setFontSize(10);
    doc.text(`${new Date().toLocaleString()}`, 12, 32);
    doc.text(`[Nombre del usuario]`, 12, 44);
    doc.setFontSize(11);
    doc.text(`[Dirección de la empresa]`, 194, 27, { align: "right" });
    doc.text(`[Ciudad, Dept. País]`, 194, 33, { align: "right" });
    doc.text(`[Teléfono]`, 194, 39, { align: "right" });
    doc.setFontSize(10);
    doc.text("Nombre completo", 12, 70);
    doc.text("Número de documento", 110, 70);
    doc.text("Dirección de correspondencia", 12, 82);
    doc.text("Teléfono", 110, 82);
    doc.text("[NOMBRE]", 12, 75);
    doc.text(currentProperty?.user_name || "[No. documento]", 110, 75);
    doc.text("[DIRECCION]", 12, 87);
    doc.text("[TELEFONO]", 110, 87);

    autoTable(doc, {
      startY: 105,
      margin: { left: 12, right: 12 },
      head: [
        [
          "ID",
          "Nombre del predio",
          "Folio matrícula inmobiliaria",
          "Extensión",
          "Latitud",
          "Longitud",
          "Número de lotes",
        ],
      ],
      body: [
        [
          currentProperty?.id || "",
          currentProperty?.name || "",
          currentProperty?.inmobilario || "",
          currentProperty?.extension || "",
          currentProperty?.latitud || "",
          currentProperty?.longitud || "",
          lotsForProperty.length,
        ],
      ],
      theme: "grid",
      headStyles: {
        fillColor: [252, 252, 253],
        textColor: [0, 0, 0],
        fontStyle: "bold",
        lineWidth: 0.5,
        lineColor: [234, 236, 240],
      },
      bodyStyles: {
        textColor: [89, 89, 89],
        fontSize: 9,
        cellPadding: 4,
      },
      styles: {
        fontSize: 9,
        font: "Roboto",
        lineColor: [226, 232, 240],
      },
    });

    // Lotes asociados al predio
    const currentY = doc.lastAutoTable.finalY + 10;

    doc.setFontSize(11);
    doc.setFont("Roboto", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text(`Lotes Asociados al predio [${id}]`, 14, currentY);

    // Tabla de lotes asociados
    autoTable(doc, {
      startY: currentY + 5,
      margin: { left: 12, right: 12 },
      head: [
        [
          "ID",
          "Nombre del lote",
          "Folio matrícula inmobiliaria",
          "Extensión",
          "Latitud",
          "Longitud",
          "Tipo de cultivo",
          "Intervalo de pago",
        ],
      ],
      body: lotsForProperty.map((lot) => [
        lot.id,
        lot.name,
        lot.inmobilario,
        lot.extension,
        lot.latitud,
        lot.longitud,
        "[Tipo de cultivo]",
        "[Intervalo de pago]",
      ]),
      theme: "grid",
      headStyles: {
        fillColor: [252, 252, 253],
        textColor: [0, 0, 0],
        fontStyle: "bold",
        lineWidth: 0.1,
        lineColor: [234, 236, 240],
      },
      bodyStyles: {
        textColor: [89, 89, 89],
        fontSize: 9,
        cellPadding: 4,
      },
      styles: {
        fontSize: 9,
        font: "Roboto",
        lineColor: [226, 232, 240],
      },
    });
    //pie de pagina
    doc.addImage(Icon, "PNG", 12, 280, 32, 9);

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
      setLoading("");
    }, 500);
  };

  // useEffect(() => {
  //   getProperty();
  // }, []);

  // const getProperty = async () => {
  //   try {
  //     const response = await axios.get(
  //       import.meta.env.VITE_URI_BACKEND +
  //         import.meta.env.VITE_ROUTE_BACKEND_PROPERTY +
  //         id
  //     );
  //     setData(response.data.data[0]);
  //   } catch (error) {
  //     console.log("Error al obtener rol:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // Función para generar etiquetas de fecha según el período seleccionado
  const generateDateLabels = (period) => {
    const today = new Date();
    let labels = [];
    let format_str = "";

    switch (period) {
      case "dia":
        // Últimos 30 días
        format_str = "dd MMM";
        for (let i = 29; i >= 0; i--) {
          labels.push(format(subDays(today, i), format_str));
        }
        break;
      case "semana":
        // Últimas 8 semanas
        format_str = "'Sem' w";
        for (let i = 7; i >= 0; i--) {
          labels.push(format(subWeeks(today, i), format_str));
        }
        break;
      case "mes":
        // Últimos 7 meses
        format_str = "MMM";
        for (let i = 6; i >= 0; i--) {
          labels.push(format(subMonths(today, i), format_str));
        }
        break;
      case "año":
        // Últimos 5 años
        format_str = "yyyy";
        for (let i = 4; i >= 0; i--) {
          labels.push(format(subYears(today, i), format_str));
        }
        break;
      default:
        return [];
    }
    return labels;
  };

  // Función para generar datos aleatorios según el período y número de etiquetas
  const generateRandomData = (numLabels, min = 10, max = 100) => {
    return Array.from(
      { length: numLabels },
      () => Math.floor(Math.random() * (max - min + 1)) + min
    );
  };

  // Función para obtener datos según el tipo (consumo/producción) y período (día/semana/mes/año)
  const getChartData = (type, period) => {
    const labels = generateDateLabels(period);
    const numDataPoints = labels.length;

    if (type === "consumo") {
      return {
        labels,
        datasets: [
          {
            label: "Agua",
            data: generateRandomData(numDataPoints, 5, 90),
            borderColor: "rgb(108, 158, 255)",
            backgroundColor: "rgba(108, 158, 255, 0.3)",
            tension: 0,
            pointStyle: "circle",
            pointRadius: 5,
            pointHoverRadius: 10,
            borderWidth: 1,
          },
          {
            label: "Energía",
            data: generateRandomData(numDataPoints, 15, 95),
            borderColor: "rgb(196, 157, 40)",
            backgroundColor: "rgba(196, 157, 40, 0.3)",
            tension: 0,
            pointStyle: "circle",
            pointRadius: 5,
            pointHoverRadius: 10,
            borderWidth: 1,
          },
        ],
      };
    } else {
      return {
        labels,
        datasets: [
          {
            label: "Baterías",
            data: generateRandomData(numDataPoints, 15, 80),
            borderColor: "rgb(65, 139, 96)",
            backgroundColor: "rgba(65, 139, 96, 0.3)",
            tension: 0,
            pointStyle: "circle",
            pointRadius: 5,
            pointHoverRadius: 10,
            borderWidth: 1,
          },
          {
            label: "Paneles",
            data: generateRandomData(numDataPoints, 20, 75),
            borderColor: "rgb(225, 149, 142)",
            backgroundColor: "rgba(225, 149, 142, 0.4)",
            tension: 0,
            pointStyle: "circle",
            pointRadius: 5,
            pointHoverRadius: 10,
            borderWidth: 1,
          },
        ],
      };
    }
  };

  // Función para obtener datos de barras según el tipo (consumo/producción) y período (día/semana/mes/año)
  const getBarChartData = (type, period) => {
    const labels = generateDateLabels(period);
    const numDataPoints = labels.length;

    if (type === "consumo") {
      return {
        labels,
        datasets: [
          {
            label: "Agua",
            data: generateRandomData(numDataPoints, 30, 100),
            backgroundColor: "rgba(91, 147, 255, 0.8)",
            stack: "Stack 0",
          },
          {
            label: "Energía",
            data: generateRandomData(numDataPoints, 10, 50),
            backgroundColor: "rgba(255, 236, 182, 1)",
            stack: "Stack 0",
          },
        ],
      };
    } else {
      return {
        labels,
        datasets: [
          {
            label: "Baterías",
            data: generateRandomData(numDataPoints, 40, 90),
            backgroundColor: "rgba(65, 139, 96, 0.8)",
            stack: "Stack 0",
          },
          {
            label: "Paneles",
            data: generateRandomData(numDataPoints, 10, 40),
            backgroundColor: "rgba(225, 149, 142, 0.8)",
            stack: "Stack 0",
          },
        ],
      };
    }
  };

  // Configuraciones para los gráficos
  const getLineOptions = (period) => {
    let titleText = "Niveles de consumo";
    if (activeTab === "produccion") {
      titleText = "Niveles de producción";
    }

    switch (period) {
      case "dia":
        titleText += " diario (últimos 30 días)";
        break;
      case "semana":
        titleText += " semanal (últimas 8 semanas)";
        break;
      case "mes":
        titleText += " mensual (últimos 7 meses)";
        break;
      case "año":
        titleText += " anual (últimos 5 años)";
        break;
    }

    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
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
        },
      },
    };
  };

  const getBarOptions = (period) => {
    let titleText = "Niveles de consumo";
    if (activeTab === "produccion") {
      titleText = "Niveles de producción";
    }

    switch (period) {
      case "dia":
        titleText += " diario (últimos 30 días)";
        break;
      case "semana":
        titleText += " semanal (últimas 8 semanas)";
        break;
      case "mes":
        titleText += " mensual (últimos 7 meses)";
        break;
      case "año":
        titleText += " anual (últimos 5 años)";
        break;
    }

    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
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
        },
        x: {
          stacked: true,
        },
      },
    };
  };

  // Definir los valores para las tarjetas resumen
  const summaryCards =
    activeTab === "consumo"
      ? [
          {
            title: "Consumo promedio de energía",
            valueUptakeEnergy: "155 kWh",
            bgColor: "rgba(252,241,210,1)",
          },
          {
            title: "Consumo actual de energía",
            valueUptakeEnergy: "132 kWh",
            bgColor: "rgba(252,241,210,1)",
          },
          {
            title: "Consumo promedio de agua",
            valueUptakeWater: "245 m³",
            bgColor: "rgb(231, 239, 255)",
          },
          {
            title: "Consumo actual de agua",
            valueUptakeWater: "265 m³",
            bgColor: "rgb(231, 239, 255)",
          },
        ]
      : [
          {
            title: "Energía almacenada (Baterías)",
            valueStorageEnergy: "155 kWh",
            bgColor: "#eff9d9",
          },
          {
            title: "Autonomía restante (Baterías)",
            valueStorageEnergy: "2h",
            bgColor: "rgba(239,249,217,1)",
          },
          {
            title: "Producción mensual de energía",
            valueProductionEnergy: "155 kWh",
            bgColor: "#ffd9d5",
          },
          {
            title: "Producción actual de energía",
            valueProductionEnergy: "132 kWh",
            bgColor: "#ffd9d5",
          },
        ];

  const head_lot_data = {
    lot: {
      title: "Información de lotes",
      description:
        "En esta sección podrás visualizar los lotes que componen el predio.",
    },
    iot: {
      title: "Información de dispositivos IoT",
      description:
        "En esta sección podrás visualizar todos los dispositivos IoT instalados en el predio.",
    },
  };

  useEffect(() => {
    fetchLots();
  }, []);

  const fetchLots = async () => {
    try {
      setLoadingTable(true);
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND +
          import.meta.env.VITE_ROUTE_BACKEND_PROPERTY +
          id +
          import.meta.env.VITE_ROUTE_BACKEND_LOTS
      );
      setDataLots(response.data.data);

      const sortedData = response.data.data.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      // const sortedData = response.data.data.sort((a, b) => a.name - b.name);

      console.log(sortedData);

      setDataLots(sortedData);
      // setButtonDisabled(false);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    } finally {
      setLoadingTable(false);
    }
  };

  const handleTabChange = (tab) => setActiveOption(tab);

  const renderContent = () => {
    switch (activeOption) {
      case "lot":
        return <Lot dataLots={dataLots} id={id} loadingTable={loadingTable} />;
      case "iot":
        return <Iot_by_property />;
      default:
        return null;
    }
  };

  return (
    <>
      <Head
        head_data={head_data}
        onButtonClick={handleButtonClick}
        loading={loading}
      />

      <div className="is-flex is-justify-content-space-between is-align-items-center mb-4">
        <h2 className="title is-5 mb-0">Visualiza las gráficas</h2>
        <div className="tabs is-toggle is-small">
          <div className="buttons is-justify-content-flex-end">
            <button
              className={`button ${
                activeTab === "consumo" ? "color-hover" : ""
              }`}
              onClick={() => setActiveTab("consumo")}
            >
              Consumo
            </button>
            <div
              className={`button ${
                activeTab === "produccion" ? "color-hover" : ""
              }`}
              onClick={() => setActiveTab("produccion")}
            >
              Producción
            </div>
          </div>
        </div>
      </div>
      <div className="rol-detail">
        {/* Tarjetas de resumen */}
        <div className="columns is-multiline mb-5">
          {summaryCards.map((card, index) => (
            <div className="column" key={index}>
              <div
                className="box p-4"
                style={{ backgroundColor: card.bgColor, height: "100%" }}
              >
                <p className="has-text-weight-bold has-text-black mb-2">
                  {card.title}
                </p>
                <p className="is-size-4 has-text-weight-bold energy-consumption">
                  {card.valueUptakeEnergy}
                </p>
                <p className="is-size-4 has-text-weight-bold water-consumption">
                  {card.valueUptakeWater}
                </p>
                <p className="is-size-4 has-text-weight-bold battery-production">
                  {card.valueStorageEnergy}
                </p>
                <p className="is-size-4 has-text-weight-bold energy-production">
                  {card.valueProductionEnergy}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pestañas para tiempo: día, semana, mes, año */}
        <div className="columns">
          <div className="column">
            <div className="is-flex is-justify-content-space-between is-align-items-center mb-2">
              <h3 className="subtitle is-6 mb-2">
                Niveles de {activeTab === "consumo" ? "consumo" : "producción"}
              </h3>
              <div className="tabs is-flex">
                <ul className="mt-0">
                  <li className={activePeriod === "dia" ? "is-active" : ""}>
                    <a onClick={() => setActivePeriod("dia")}>Día</a>
                  </li>
                  <li className={activePeriod === "semana" ? "is-active" : ""}>
                    <a onClick={() => setActivePeriod("semana")}>Semana</a>
                  </li>
                  <li className={activePeriod === "mes" ? "is-active" : ""}>
                    <a onClick={() => setActivePeriod("mes")}>Mes</a>
                  </li>
                  <li className={activePeriod === "año" ? "is-active" : ""}>
                    <a onClick={() => setActivePeriod("año")}>Año</a>
                  </li>
                </ul>
              </div>
            </div>
            <div style={{ height: "250px" }}>
              <Line
                data={getChartData(activeTab, activePeriod)}
                options={getLineOptions(activePeriod)}
              />
            </div>
          </div>
          <div className="column">
            <div className="is-flex is-justify-content-space-between is-align-items-center mb-2">
              <h3 className="subtitle is-6 mb-2">
                Niveles de {activeTab === "consumo" ? "consumo" : "producción"}
              </h3>
              <div className="tabs tabs-period right">
                <ul className="mt-0">
                  <li
                    className={activePeriodRight === "dia" ? "is-active" : ""}
                  >
                    <a onClick={() => setActivePeriodRight("dia")}>Día</a>
                  </li>
                  <li
                    className={
                      activePeriodRight === "semana" ? "is-active" : ""
                    }
                  >
                    <a onClick={() => setActivePeriodRight("semana")}>Semana</a>
                  </li>
                  <li
                    className={activePeriodRight === "mes" ? "is-active" : ""}
                  >
                    <a onClick={() => setActivePeriodRight("mes")}>Mes</a>
                  </li>
                  <li
                    className={activePeriodRight === "año" ? "is-active" : ""}
                  >
                    <a onClick={() => setActivePeriodRight("año")}>Año</a>
                  </li>
                </ul>
              </div>
            </div>
            <div style={{ height: "250px" }}>
              <Bar
                data={getBarChartData(activeTab, activePeriodRight)}
                options={getBarOptions(activePeriodRight)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="property-detail mt-4">
        <div className="columns is-multiline">
          <div className="column rol-detail">
            <div className="level">
              <h3 className="title is-6 margin-bottom">Detalles del usuario</h3>
            </div>
            <div className="columns is-multiline is-mobile">
              <div className="column is-half column-p0">
                <strong> Nombre del cliente</strong>
              </div>
              <div className="column is-half column-p0">[]</div>
            </div>
            <div className="columns is-multiline is-mobile">
              <div className="column is-half column-p0">
                <strong> Tipo de documento</strong>
              </div>
              <div className="column column-p0">[]</div>
            </div>
            <div className="columns is-multiline is-mobile">
              <div className="column is-half column-p0">
                <strong> Número de documento</strong>
              </div>
              <div className="column column-p0">[]</div>
            </div>
            <div className="columns is-multiline is-mobile">
              <div className="column is-half">
                <strong> Número de telefono</strong>
              </div>
              <div className="column column">[]</div>
            </div>
          </div>
          <div className="mr-2 ml-2"></div>
          <div className="column rol-detail">
            <div className="level">
              <h3 className="title is-6 margin-bottom">Detalles del usuario</h3>
            </div>
            <div className="columns is-multiline is-mobile">
              <div className="column is-half column-p0">
                <strong>Folio de matricula inmobilaria</strong>
              </div>
              <div className="column is-half column-p0">[]</div>
            </div>
            <div className="columns is-multiline is-mobile">
              <div className="column is-half column-p0">
                <strong>Extensión del predio</strong>
              </div>
              <div className="column column-p0">[]</div>
            </div>
            <div className="columns is-multiline is-mobile">
              <div className="column is-half column-p0">
                <strong>Longitud</strong>
              </div>
              <div className="column column-p0">[]</div>
            </div>
            <div className="columns is-multiline is-mobile">
              <div className="column is-half">
                <strong>Latitud</strong>
              </div>
              <div className="column column">[]</div>
            </div>
          </div>
        </div>
      </div>
      <div className="rol-detail mb-5">
        <h3 className="title is-6 margin-bottom">Ver anexos del predio</h3>
        <div className="columns">
          <div className="column is-flex is-align-items-center">
            <IoDocument className="mr-2" />
            <span>[]</span>
          </div>
          <div className="column is-flex is-align-items-center">
            <IoDocument className="mr-2" />
            <span>[]</span>
          </div>
        </div>
      </div>
      {/* <Head head_data={head_lot_data} onButtonClick={handleButtonClick} /> */}
      <Head
        head_data={head_lot_data[activeOption]}
        onButtonClick={handleButtonClick}
        loading={loading}
      />
      <>
        <div className="tabs is-boxed">
          <ul>
            {["lot", "iot"].map((tab) => (
              <li key={tab} className={activeOption === tab ? "is-active" : ""}>
                <a onClick={() => handleTabChange(tab)}>
                  {tab === "lot" && "Lotes Vinculados"}
                  {tab === "iot" && "Dispositivos de energía"}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>{renderContent()}</div>
      </>
    </>
  );
};

export default Property_detail;
