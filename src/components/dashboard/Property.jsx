import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Head from "./Head";
import Search from "./Search";
import Filter from "./Filter";
import Table from "./Table";
import Pagination from "./Pagination";
import Form_add_property from "./forms/adds/Form_add_property";
import Message from "../Message";
import axios from "axios";
import RobotoNormalFont from "../../assets/fonts/Roboto-Regular.ttf";
import RobotoBoldFont from "../../assets/fonts/Roboto-Bold.ttf";
import Icon from "../../assets/icons/Disriego_title.png";
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

const Property = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [loading, setLoading] = useState("");
  const [loadingTable, setLoadingTable] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [titleMessage, setTitleMessage] = useState(false);
  const [message, setMessage] = useState(false);
  const [status, setStatus] = useState(false);
  // const [id, setId] = useState(null);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const handleButtonClick = (buttonText) => {
    if (buttonText === "Añadir predio") {
      setShowForm(true);
    }

    if (buttonText === "Descargar reporte") {
      setLoading("is-loading");
      generatePropertyReport();
      // generateLotReport();
    }
  };
  //generacion de pdf consolidado de predios
  const generatePropertyReport = () => {
    // Aqui va el codigo de generar reporte
    const doc = new jsPDF();

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
    doc.text("CONSOLIDADO DE PREDIOS", 12, 18);
    doc.setFontSize(11);
    doc.text(`Fecha de generación:`, 12, 27);
    doc.text(`Generado por:`, 12, 39);
    doc.text("Predios actuales en el sistema", 12, 63);

    doc.setTextColor(94, 100, 112);
    doc.setFont("Roboto", "normal");
    doc.setFontSize(10);
    doc.text(`${new Date().toLocaleString()}`, 12, 32);
    doc.text(`[Nombre del usuario]`, 12, 44);
    doc.setFontSize(11);
    doc.text(`[Dirección de la empresa]`, 194, 27, { align: "right" });
    doc.text(`[Ciudad, Dept. País]`, 194, 33, { align: "right" });
    doc.text(`[Teléfono]`, 194, 39, { align: "right" });
    doc.text(`Cantidad de Predios: ${data.length}`, 12, 68);

    // Agregar tabla con autoTable
    autoTable(doc, {
      startY: 80,
      margin: { left: 12 },
      head: [
        [
          "ID del predio",
          "Nombre",
          "Número de documento del dueño",
          "Folio de matricula inmobiliaria",
          "Extensión",
          "Latitud",
          "Longitud",
          "Estado",
        ],
      ],
      body: filteredData.map((property) => [
        property["ID del predio"],
        property.Nombre,
        property["Número de documento del dueño"],
        property["Folio de matricula inmobiliaria"],
        property.Extensión,
        property.Latitud,
        property.Longitud,
        property.Estado,
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

    doc.addImage(Icon, "PNG", 12, 280, 32, 9);

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
      setLoading("");
    }, 500);
    console.log("Generando reporte...");
  };

  //GENERAR CONSOLIDAD DE LOTES
  const generateLotReport = () => {
    // Aqui va el codigo de generar reporte
    const doc = new jsPDF();

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
    doc.text("CONSOLIDADO DE LOTES", 12, 18);
    doc.setFontSize(11);
    doc.text(`Fecha de generación:`, 12, 27);
    doc.text(`Generado por:`, 12, 39);
    doc.text("Lotes actuales en el sistema", 12, 63);

    doc.setTextColor(94, 100, 112);
    doc.setFont("Roboto", "normal");
    doc.setFontSize(10);
    doc.text(`${new Date().toLocaleString()}`, 12, 32);
    doc.text(`[Nombre del usuario]`, 12, 44);
    doc.setFontSize(11);
    doc.text(`[Dirección de la empresa]`, 194, 27, { align: "right" });
    doc.text(`[Ciudad, Dept. País]`, 194, 33, { align: "right" });
    doc.text(`[Teléfono]`, 194, 39, { align: "right" });
    doc.text(`Cantidad de Lotes: ${data.length}`, 12, 68);

    // Agregar tabla con autoTable
    autoTable(doc, {
      startY: 80,
      margin: { left: 12 },
      head: [
        [
          "ID lote",
          "ID predio vinculado",
          "Nombre del lote",
          "Numero de documeno",
          "Folio matricula inmobiliaria",
          "Extencion",
          "Latitud",
          "Longitud",
          "Tipo de cultivo",
          "Intervalo de pago",
        ],
      ],
      body: filteredData.map((lot) => [
        lot.Id,
        lot.property_id,
        lot.name,
        lot["Número de documento del dueño"],
        lot["Folio de matricula inmobiliaria"],
        lot.Extensión,
        lot.Latitude,
        lot.Longitude,
        lot["Tipo de cultivo"],
        lot["Intervalo de pago"],
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
        fontSize: 9,
        cellPadding: 3,
        lineColor: [234, 236, 240],
      },
    });

    doc.addImage(Icon, "PNG", 12, 280, 32, 9);

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
      setLoading("");
    }, 500);
    console.log("Generando reporte...");
  };

  const handleFilterClick = () => {
    setShowFilter(true);
  };

  const head_data = {
    title: "Gestión de predios",
    description:
      "En esta sección puedes gestionar predios, registrar nuevos lotes y visualizar sus detalles.",
    buttons: {
      button1: {
        icon: "FaPlus",
        class: "color-hover",
        text: "Añadir predio",
      },
      button2: {
        icon: "LuDownload",
        class: "",
        text: "Descargar reporte",
      },
    },
  };

  const columns = [
    "ID",
    "ID del predio",
    "Nombre",
    "Número de documento del dueño",
    "Folio de matricula inmobiliaria",
    "Extensión (m²)",
    "Latitud",
    "Longitud",
    "Estado",
    "Opciones",
  ];

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoadingTable(true);
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND +
          import.meta.env.VITE_ROUTE_BACKEND_PROPERTY
      );
      setData(response.data.data);

      const sortedData = response.data.data.sort((a, b) => a.id - b.id);

      console.log(sortedData);

      setData(sortedData);
      setButtonDisabled(false);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    } finally {
      setLoadingTable(false);
    }
  };

  const updateData = async () => {
    fetchProperties();
  };

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  const toTitleCase = (str) => {
    if (typeof str !== "string") return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const filteredData = data
    .filter((info) =>
      Object.values(info)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .map((info) => ({
      ID: info.id,
      "ID del predio": info.id,
      Nombre: toTitleCase(info.name),
      "Número de documento del dueño": info.owner_document_number,
      "Folio de matricula inmobiliaria": info.real_estate_registration_number,
      "Extensión (m²)": info.extension,
      Latitud: info.latitude,
      Longitud: info.longitude,
      Estado: info.estado,
    }));

  const options = [
    { icon: "BiShow", name: "Ver detalles" },
    { icon: "BiEditAlt", name: "Editar" },
    { icon: "LuDownload", name: "Inhabilitar" },
  ];

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  console.log(data);

  return (
    <>
      <Head
        head_data={head_data}
        onButtonClick={handleButtonClick}
        loading={loading}
        buttonDisabled={buttonDisabled}
      />
      <div className="container-search">
        <Search onSearch={setSearchTerm} buttonDisabled={buttonDisabled} />
        <Filter
          onFilterClick={handleFilterClick}
          buttonDisabled={buttonDisabled}
        />
      </div>
      <Table
        columns={columns}
        data={paginatedData}
        options={options}
        loadingTable={loadingTable}
      />
      <Pagination
        totalItems={filteredData.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
      {showForm && (
        <>
          <Form_add_property
            title="Añadir predio"
            onClose={() => setShowForm(false)}
            setShowMessage={setShowMessage}
            setTitleMessage={setTitleMessage}
            setMessage={setMessage}
            setStatus={setStatus}
            updateData={updateData}
            // id={id}
            loading={loading}
            setLoading={setLoading}
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

export default Property;
