import { useEffect, useState } from "react";
import axios from "axios";
import Head from "./Head";
import Search from "./Search";
import Filter from "./Filter";
import Table from "./Table";
import Pagination from "./Pagination";
import Form_device from "./forms/adds/Form_device";
import Filter_iot from "./filters/Filter_iot";
import Change_status_iot from "./Status/Change_status_iot";
import Form_assign_iot from "./forms/adds/Form_assign_iot";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import Icon from "../../assets/icons/Disriego_title.png";
import RobotoNormalFont from "../../assets/fonts/Roboto-Regular.ttf";
import RobotoBoldFont from "../../assets/fonts/Roboto-Bold.ttf";
import Message from "../Message";

const Iot = () => {
  const [data, setData] = useState([]);
  const [loadingTable, setLoadingTable] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const [showChangeStatus, setShowChangeStatus] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [confirMessage, setConfirMessage] = useState();
  const [loading, setLoading] = useState("");
  const [loadingReport, setLoadingReport] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [titleMessage, setTitleMessage] = useState(false);
  const [message, setMessage] = useState(false);
  const [status, setStatus] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [id, setId] = useState(null);
  const [title, setTitle] = useState();
  const [typeForm, setTypeForm] = useState();
  const token = localStorage.getItem("token");

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [filteredData, setFilteredData] = useState([]);
  const [backupData, setBackupData] = useState([]);
  const [statusFilter, setStatusFilter] = useState(false);
  const [filters, setFilters] = useState({
    type_devices: {},
    estados: {},
    installation_date: {
      from: "",
      to: "",
    },
  });

  const head_data = {
    title: "Gestión de dispositivos",
    description:
      "En esta sección puedes gestionar todos los dispositivos y visualizar su estado actual.",
    buttons: {
      button1: {
        icon: "FaPlus",
        class: "color-hover",
        text: "Añadir dispositivo",
      },
      button2: {
        icon: "LuDownload",
        class: "",
        text: "Descargar reporte",
      },
    },
  };

  const handleButtonClick = (buttonText) => {
    if (buttonText === "Añadir dispositivo") {
      setShowForm(true);
    }

    if (buttonText === "Descargar reporte") {
      setLoadingReport("is-loading");
      generateReport();
    }
  };

  // Función para generar el reporte PDF
  const generateReport = () => {
    const doc = new jsPDF("landscape");

    // Añadir fuentes Roboto al documento
    doc.addFont(RobotoNormalFont, "Roboto", "normal");
    doc.addFont(RobotoBoldFont, "Roboto", "bold");

    // Colorear fondo
    doc.setFillColor(243, 242, 247);
    doc.rect(0, 0, 300, 53, "F"); // Colorear una parte de la página

    // Agregar logo
    doc.addImage(Icon, "PNG", 246, 10, 39, 11);

    // Configurar título y encabezados
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(17);
    doc.setFont("Roboto", "bold");
    doc.text("CONSOLIDADO DE DISPOSITIVOS", 12, 18);
    doc.setFontSize(11);
    doc.text(`Fecha de generación:`, 12, 27);
    doc.text(`Generado por:`, 12, 39);
    doc.text("Dispositivos registrados actualmente", 12, 63);

    // Configurar información adicional
    doc.setTextColor(94, 100, 112);
    doc.setFont("Roboto", "normal");
    doc.setFontSize(10);
    doc.text(`${new Date().toLocaleString()}`, 12, 32);
    doc.text(`[Nombre del usuario]`, 12, 44);
    doc.setFontSize(11);
    doc.text(`[Dirección de la empresa]`, 285, 27, { align: "right" });
    doc.text(`[Ciudad, Dept. País]`, 285, 33, { align: "right" });
    doc.text(`[Teléfono]`, 285, 39, { align: "right" });
    doc.text(`Cantidad de dispositivos: ${filteredData.length}`, 12, 68);

    // Agregar tabla con autoTable
    autoTable(doc, {
      startY: 80,
      margin: { left: 12 },
      head: [
        [
          "ID dispositivo",
          "ID Lote",
          "Número de documento",
          "Tipo de dispositivo",
          "Modelo",
          "Fecha de instalación",
          "Fecha estimada de mantenimiento",
          "Estado",
        ],
      ],
      body: filteredData.map((device) => [
        device["ID Dispositivo"],
        device["ID Lote"] || "-",
        device["Número de documento"],
        device["Tipo de dispositivo"],
        device["Modelo"],
        device["Fecha de instalación"]?.slice(0, 10),
        device["Fecha estimada de mantenimiento"]?.slice(0, 10),
        device["Estado"],
      ]),
      theme: "grid",
      headStyles: {
        fillColor: [252, 252, 253],
        textColor: [0, 0, 0],
        fontStyle: "bold",
        lineColor: [234, 236, 240],
        lineWidth: 0.5,
        font: "Roboto", // Añadir fuente Roboto a los encabezados de tabla
      },
      bodyStyles: {
        textColor: [89, 89, 89],
        font: "Roboto", // Añadir fuente Roboto al cuerpo de la tabla
      },
      styles: {
        fontSize: 10,
        cellPadding: 3,
        lineColor: [234, 236, 240],
      },
    });

    // Agregar pie de página
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
      setLoadingReport("");
    }, 500);
  };

  const columns = [
    "ID",
    "ID Dispositivo",
    "ID Lote",
    "Número de documento",
    "Tipo de dispositivo",
    "Modelo",
    "Fecha de instalación",
    "Fecha estimada de mantenimiento",
    "Estado",
    "Opciones",
  ];

  const handleFilterClick = () => {
    setShowFilter(true);
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      setLoadingTable(true);
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND_IOT +
          import.meta.env.VITE_ROUTE_BACKEND_DEVICES
      );

      console.log(response.data.data);

      const sortedData = response.data.data.sort((a, b) => a.id - b.id);
      // const sortedData = response.data.data.sort((a, b) => b.id - a.id);

      setData(sortedData);

      setButtonDisabled(false);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    } finally {
      setLoadingTable(false);
    }
  };

  const updateData = async () => {
    fetchDevices();
  };

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showMessage]);

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
          "ID Dispositivo": info.id,
          "ID Lote": info.lot_id,
          "Número de documento": info.owner_document_number,
          "Tipo de dispositivo": info.device_type_name,
          Modelo: info.model,
          "Fecha de instalación": info.installation_date?.slice(0, 10),
          "Fecha estimada de mantenimiento":
            info.estimated_maintenance_date?.slice(0, 10),
          Estado: info.device_status_name,
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

  const options = [
    { icon: "BiShow", name: "Ver detalles" },
    { icon: "TbMap2", name: "Asignar" },
    { icon: "TbMap2", name: "Reasignar" },
    { icon: "BiEditAlt", name: "Editar" },
    { icon: "MdOutlineCheckCircle", name: "Habilitar" },
    { icon: "VscError", name: "Inhabilitar" },
  ];

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <>
      <Head
        head_data={head_data}
        loading={loadingReport}
        onButtonClick={handleButtonClick}
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
        setId={setId}
        setTitle={setTitle}
        setShowEdit={setShowEdit}
        setShowAssign={setShowAssign}
        setShowChangeStatus={setShowChangeStatus}
        setConfirMessage={setConfirMessage}
        setTypeForm={setTypeForm}
      />
      <Pagination
        totalItems={filteredData.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
      {showForm && (
        <>
          <Form_device
            title="Añadir dispositivo"
            onClose={() => setShowForm(false)}
            setShowMessage={setShowMessage}
            setTitleMessage={setTitleMessage}
            setMessage={setMessage}
            setStatus={setStatus}
            updateData={updateData}
            token={token}
            loading={loading}
            setLoading={setLoading}
            typeForm={typeForm}
            setTypeForm={setTypeForm}
          />
        </>
      )}
      {showEdit && (
        <>
          <Form_device
            title={title}
            onClose={() => setShowEdit(false)}
            id={id}
            setShowMessage={setShowMessage}
            setTitleMessage={setTitleMessage}
            setMessage={setMessage}
            setStatus={setStatus}
            updateData={updateData}
            token={token}
            loading={loading}
            setLoading={setLoading}
            typeForm={typeForm}
            setTypeForm={setTypeForm}
          />
        </>
      )}
      {showAssign && (
        <>
          <Form_assign_iot
            title={title}
            onClose={() => setShowAssign(false)}
            id={id}
            setShowMessage={setShowMessage}
            setTitleMessage={setTitleMessage}
            setMessage={setMessage}
            setStatus={setStatus}
            // updateData={updateData}
            token={token}
            loading={loading}
            setLoading={setLoading}
            typeForm={typeForm}
            setTypeForm={setTypeForm}
          />
        </>
      )}
      {showChangeStatus && (
        <Change_status_iot
          onClose={() => setShowChangeStatus(false)}
          onSuccess={() => setShowChangeStatus(false)}
          id={id}
          confirMessage={confirMessage}
          setShowMessage={setShowMessage}
          setTitleMessage={setTitleMessage}
          setMessage={setMessage}
          setStatus={setStatus}
          updateData={updateData}
          typeForm={typeForm}
          loading={loading}
          setLoading={setLoading}
        />
      )}
      {showFilter && (
        <Filter_iot
          onClose={() => setShowFilter(false)}
          data={data}
          filteredData={filteredData}
          setFilteredData={setFilteredData}
          setStatusFilter={setStatusFilter}
          filters={filters}
          setFilters={setFilters}
          backupData={backupData}
        />
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

export default Iot;
