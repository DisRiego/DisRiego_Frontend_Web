import { useEffect, useState } from "react";
import axios from "axios";
import Head from "./Head";
import Search from "./Search";
import Filter from "./Filter";
import Table from "./Table";
import Pagination from "./Pagination";
import Form_device from "./forms/adds/Form_device";

const Iot = () => {
  const [data, setData] = useState([]);
  const [loadingTable, setLoadingTable] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showEdit, setShowEdit] = useState();
  const [showChangeStatus, setShowChangeStatus] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [confirMessage, setConfirMessage] = useState();
  const [loading, setLoading] = useState("");
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
    estados: {},
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

  const options = [
    { icon: "BiShow", name: "Ver detalles" },
    { icon: "BiEditAlt", name: "Editar" },
    { icon: "MdOutlineCheckCircle", name: "Habilitar" },
    { icon: "VscError", name: "Inhabilitar" },
  ];

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      setLoadingTable(true);
      const response = [
        {
          id: 1,
          id_lot: 1,
          owner_document: 123456789,
          name_type_device: "Válvula",
          model: "VAL-100",
          installation_date: "",
          estimated_maintenance_date: "",
          status_name: "Activo",
        },
        {
          id: 2,
          id_lot: 2,
          owner_document: 987654321,
          name_type_device: "Medidor",
          model: "MED-200",
          installation_date: "",
          estimated_maintenance_date: "",
          status_name: "Activo",
        },
        {
          id: 3,
          id_lot: 3,
          owner_document: 111222333,
          name_type_device: "Controlador",
          model: "CTRL-X",
          installation_date: "",
          estimated_maintenance_date: "",
          status_name: "Activo",
        },
        {
          id: 4,
          id_lot: 4,
          owner_document: 444555666,
          name_type_device: "Relé",
          model: "REL-12V",
          installation_date: "",
          estimated_maintenance_date: "",
          status_name: "Activo",
        },
        {
          id: 5,
          id_lot: 5,
          owner_document: 999888777,
          name_type_device: "Inversor",
          model: "INV-4000",
          installation_date: "",
          estimated_maintenance_date: "",
          status_name: "Activo",
        },
        {
          id: 6,
          id_lot: 6,
          owner_document: 555333111,
          name_type_device: "Batería",
          model: "BAT-LITHIUM",
          installation_date: "",
          estimated_maintenance_date: "",
          status_name: "Activo",
        },
        {
          id: 7,
          id_lot: 7,
          owner_document: 222333444,
          name_type_device: "Panel",
          model: "SOL-PANEL",
          installation_date: "",
          estimated_maintenance_date: "",
          status_name: "Activo",
        },
        {
          id: 8,
          id_lot: 8,
          owner_document: 888777666,
          name_type_device: "Breaker",
          model: "BRK-3P",
          installation_date: "",
          estimated_maintenance_date: "",
          status_name: "Activo",
        },
        {
          id: 9,
          id_lot: 9,
          owner_document: 101010101,
          name_type_device: "DPS",
          model: "DPS-1000",
          installation_date: "",
          estimated_maintenance_date: "",
          status_name: "Activo",
        },
        {
          id: 10,
          id_lot: 10,
          owner_document: 121212121,
          name_type_device: "Portafusible",
          model: "PF-32",
          installation_date: "",
          estimated_maintenance_date: "",
          status_name: "Activo",
        },
        {
          id: 11,
          id_lot: 11,
          owner_document: 343434343,
          name_type_device: "Fusible",
          model: "FUS-15A",
          installation_date: "",
          estimated_maintenance_date: "",
          status_name: "Activo",
        },
        {
          id: 12,
          id_lot: 12,
          owner_document: 565656565,
          name_type_device: "Fuente de poder",
          model: "PWR-24V",
          installation_date: "",
          estimated_maintenance_date: "",
          status_name: "Activo",
        },
        {
          id: 13,
          id_lot: 13,
          owner_document: 787878787,
          name_type_device: "Adaptador",
          model: "ADP-ETH",
          installation_date: "",
          estimated_maintenance_date: "",
          status_name: "Activo",
        },
        {
          id: 14,
          id_lot: 14,
          owner_document: 909090909,
          name_type_device: "Antena",
          model: "ANT-XR",
          installation_date: "",
          estimated_maintenance_date: "",
          status_name: "Inactivo",
        },
      ];

      // const response = await axios.get(
      //   import.meta.env.VITE_URI_BACKEND +
      //     import.meta.env.VITE_ROUTE_BACKEND_USERS
      // );
      // const sortedData = response.data.data.sort((a, b) =>
      //   a.name.localeCompare(b.name)
      // );
      const sortedData = response.sort((a, b) => a.id - b.id);

      setData(sortedData);

      setButtonDisabled(false);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    } finally {
      setLoadingTable(false);
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
          "ID Dispositivo": info.id,
          "ID Lote": info.id_lot,
          "Número de documento": info.owner_document,
          "Tipo de dispositivo": info.name_type_device,
          Modelo: info.model,
          "Fecha de instalación": info.installation_date,
          "Fecha estimada de mantenimiento": info.estimated_maintenance_date,
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

  return (
    <>
      <Head head_data={head_data} onButtonClick={handleButtonClick} />
      <div className="container-search">
        <Search onSearch={setSearchTerm} /*buttonDisabled={buttonDisabled}*/ />
        <Filter
        // onFilterClick={handleFilterClick}
        // buttonDisabled={buttonDisabled}
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
            // updateData={updateData}
            token={token}
            loading={loading}
            setLoading={setLoading}
            typeForm={typeForm}
            setTypeForm={setTypeForm}
          />
        </>
      )}
    </>
  );
};

export default Iot;
