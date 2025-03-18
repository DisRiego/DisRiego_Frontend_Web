import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Bar, Line } from "react-chartjs-2";
import "../../../styles/index.css";
import Head from "../Head";
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

const metrics = [
  {
    title: "Consumo promedio de energía",
    value: "155 kWh",
    className: "warning",
  },
  { title: "Consumo actual de energía", value: "132 kWh", className: "danger" },
  { title: "Consumo promedio de agua", value: "245 m³", className: "info" },
  { title: "Consumo actual de agua", value: "265 m³", className: "primary" },
];

const attachments = [
  { name: "Escritura pública", file: "EscrituraPublica.pdf", size: "5.7MB" },
  {
    name: "Certificado de tradición y libertad (CTL)",
    file: "CTL.pdf",
    size: "5.7MB",
  },
];

// Datos sinteticos de los lotes
const lotMockData = [
  {
    id: 101,
    property_id: 1, // Lote perteneciente a "Finca La Esperanza"
    name: "Lote A1",
    inmobilario: "L-123",
    extension: "10 Ha",
    latitud: "2.9250",
    longitud: "-75.2800",
    estado: "Activo",
  },
  {
    id: 102,
    property_id: 2, // Otro lote para "Finca La Esperanza"
    name: "Lote A2",
    inmobilario: "L-124",
    extension: "15 Ha",
    latitud: "2.9260",
    longitud: "-75.2790",
    estado: "Activo",
  },
  {
    id: 103,
    property_id: 3, // Lote para "Hacienda El Roble"
    name: "Lote hacienda el roble",
    inmobilario: "R-456",
    extension: "60 Ha",
    latitud: "2.9350",
    longitud: "-75.2850",
    estado: "Activo",
  },
  {
    id: 104,
    property_id: 4, // Lote para "Predio Los Nogales"
    name: "Lote N1",
    inmobilario: "N-789",
    extension: "25 Ha",
    latitud: "2.9200",
    longitud: "-75.2650",
    estado: "Inactivo",
  },
  {
    id: 105,
    property_id: 3, // Lote para "Predio Los Nogales"
    name: "Lote N1",
    inmobilario: "N-789",
    extension: "25 Ha",
    latitud: "2.9200",
    longitud: "-75.2650",
    estado: "Inactivo",
  },
];

// Datos sinteticos de los predios
const mockData = [
  {
    id: 1,
    name: "Finca La Esperanza",
    user_name: "1023456789",
    inmobilario: "123-456789",
    extension: "50 Ha",
    latitud: "2.9273",
    longitud: "-75.2819",
    estado: "Activo",
  },
  {
    id: 2,
    name: "Hacienda El Roble",
    user_name: "1122334455",
    inmobilario: "234-567890",
    extension: "120 Ha",
    latitud: "2.9385",
    longitud: "-75.2901",
    estado: "Activo",
  },
  {
    id: 3,
    name: "Granja San Luis",
    user_name: "9988776655",
    inmobilario: "345-678901",
    extension: "30 Ha",
    latitud: "2.9156",
    longitud: "-75.2753",
    estado: "Inactivo",
  },
  {
    id: 4,
    name: "Predio Los Nogales",
    user_name: "6677889900",
    inmobilario: "456-789012",
    extension: "75 Ha",
    latitud: "2.9214",
    longitud: "-75.2687",
    estado: "Activo",
  },
  {
    id: 5,
    name: "Terreno Las Palmas",
    user_name: "3344556677",
    inmobilario: "567-890123",
    extension: "95 Ha",
    latitud: "2.9321",
    longitud: "-75.2850",
    estado: "Activo",
  },
];

const PropertyDetail = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [tableTab, setTableTab] = useState("lotes");

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
    const currentProperty = mockData.find(
      (property) => property.id === parseInt(id)
    );
    // Filtra los lotes que pertenecen al predio actual
    const lotsForProperty = lotMockData.filter(
      (lot) => lot.property_id === parseInt(id)
    );

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

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("consumo"); // 'consumo' o 'produccion'
  const [activePeriod, setActivePeriod] = useState("mes"); // 'dia', 'semana', 'mes', 'año'
  const [activePeriodRight, setActivePeriodRight] = useState("año"); // Para el gráfico de la derecha

  const handleOnClick = async () => {
    navigate("lot/1");
  };

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
            bgColor: "rgba(91,147,255,0.15)",
          },
          {
            title: "Consumo actual de agua",
            valueUptakeWater: "265 m³",
            bgColor: "rgba(91,147,255,0.15)",
          },
        ]
      : [
          {
            title: "Energía almacenada (Baterías)",
            valueStorageEnergy: "155 kWh",
            bgColor: "rgba(239,249,217,1)",
          },
          {
            title: "Autonomía restante (Baterías)",
            valueStorageEnergy: "2h",
            bgColor: "rgba(239,249,217,1)",
          },
          {
            title: "Producción mensual de energía",
            valueProductionEnergy: "155 kWh",
            bgColor: "rgba(229,135,127, 0.4)",
          },
          {
            title: "Producción actual de energía",
            valueProductionEnergy: "132 kWh",
            bgColor: "rgba(229,135,127, 0.4)",
          },
        ];
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

  return (
    <div className="property-detail-container">
      <Head
        head_data={head_data}
        onButtonClick={handleButtonClick}
        loading={loading}
      />
      <div className="box">
        <div className="is-flex is-justify-content-space-between is-align-items-center mb-4">
          <h2 className="title is-5 mb-0">Visualiza las gráficas</h2>
          <div className="tabs is-toggle is-small">
            <ul>
              <li className={activeTab === "consumo" ? "is-active" : ""}>
                <a onClick={() => setActiveTab("consumo")}>
                  <span>Consumo</span>
                </a>
              </li>
              <li className={activeTab === "produccion" ? "is-active" : ""}>
                <a onClick={() => setActiveTab("produccion")}>
                  <span>Producción</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Tarjetas de resumen */}
        <div className="columns is-multiline mb-5">
          {summaryCards.map((card, index) => (
            <div className="column is-3" key={index}>
              <div
                className="box p-4"
                style={{ backgroundColor: card.bgColor, height: "100%" }}
              >
                <p className="is-size-7 has-text-weight-bold mb-2">
                  {card.title}
                </p>
                <p className="is-size-4 has-text-weight-bold uptake-value-energy">
                  {card.valueUptakeEnergy}
                </p>
                <p className="is-size-4 has-text-weight-bold uptake-value-water">
                  {card.valueUptakeWater}
                </p>
                <p className="is-size-4 has-text-weight-bold storage-value-energy">
                  {card.valueStorageEnergy}
                </p>
                <p className="is-size-4 has-text-weight-bold production-value-energy">
                  {card.valueProductionEnergy}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pestañas para tiempo: día, semana, mes, año */}
        <div className="columns">
          <div className="column is-6">
            <div className="is-flex is-justify-content-space-between is-align-items-center mb-2">
              <h3 className="subtitle is-6 mb-2">
                Niveles de {activeTab === "consumo" ? "consumo" : "producción"}
              </h3>
              <div className="tabs is-small tabs-period left">
                <ul>
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
          <div className="column is-6">
            <div className="is-flex is-justify-content-space-between is-align-items-center mb-2">
              <h3 className="subtitle is-6 mb-2">
                Niveles de {activeTab === "consumo" ? "consumo" : "producción"}
              </h3>
              <div className="tabs is-small tabs-period right">
                <ul>
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

      <div className="details">
        <DetailsBox
          title="Detalles del usuario"
          data={{
            "Nombre del cliente": "[Nombre del cliente]",
            "Tipo de documento": "[Tipo de documento]",
            "Número de documento": "[Número de documento]",
            "Fecha de expedición": "[Fecha de expedición]",
          }}
        />

        <DetailsBox
          title="Nombre del predio"
          data={{
            "Folio de matricula inmobiliaria": "[Matricula inmobiliaria]",
            "Extensión del predio": "[Extensión m²]",
            Longitud: "[Longitud]",
            Latitud: "[Latitud]",
          }}
        />
      </div>

      <div className="attachments">
        <h2>Ver anexos del predio</h2>
        <div className="attachment-list">
          {attachments.map((attachment, index) => (
            <AnexoBox key={index} attachment={attachment} />
          ))}
        </div>
      </div>

      <div className="tabs">
        <ul>
          <li className={tableTab === "lotes" ? "active" : ""}>
            <a onClick={() => setTableTab("lotes")}>Lotes vinculados</a>
          </li>
          <li className={tableTab === "energia" ? "active" : ""}>
            <a onClick={() => setTableTab("energia")}>
              Dispositivos de energía
            </a>
          </li>
        </ul>
      </div>

      {tableTab === "lotes" ? <LotesTable /> : <EnergiaTable />}
    </div>
  );
};

export default PropertyDetail;

const DropdownButton = ({ lotId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { id: propertyId } = useParams();

  const handleAction = (action) => {
    setIsOpen(false);
    if (action === "ver") {
      navigate(`/dashboard/property/${propertyId}/lot/${lotId}`);
    }
  };

  return (
    <div className="dropdown">
      <button
        className="btn dropdown-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        ...
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          <button className="dropdown-item" onClick={() => handleAction("ver")}>Ver</button>
          <button className="dropdown-item" onClick={() => handleAction("editar")}>Editar</button>
          <button className="dropdown-item" onClick={() => handleAction("inhabilitar")}>Inhabilitar</button>
        </div>
      )}
    </div>
  );
};

const LotesTable = () => {
  // Obtener el id del predio usando useParams
  const { id } = useParams();
  
  // Filtrar los lotes que pertenecen al predio actual
  const filteredLots = lotMockData.filter(lot => lot.property_id === parseInt(id));

  return (
    <div className="table-container">
      <table className="custom-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre del lote</th>
            <th>Folio matrícula inmobiliaria</th>
            <th>Extensión</th>
            <th>Latitud</th>
            <th>Longitud</th>
            <th>Estado</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredLots.map((lot) => (
            <tr key={lot.id}>
              <td>{lot.id}</td>
              <td>{lot.name}</td>
              <td>{lot.inmobilario}</td>
              <td>{lot.extension}</td>
              <td>{lot.latitud}</td>
              <td>{lot.longitud}</td>
              <td>{lot.estado}</td>
              <td>
                <DropdownButton lotId={lot.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const DetailsBox = ({ title, data }) => (
  <div className="details-box">
    <h2>{title}</h2>
    <table>
      <tbody>
        {Object.entries(data).map(([key, value], index) => (
          <tr key={index}>
            <th>{key}</th>
            <td>{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const AnexoBox = ({ attachment }) => (
  <div className="anexo-box">
    <strong>{attachment.name}</strong>
    <p>
      {attachment.file} - {attachment.size}
    </p>
  </div>
);
