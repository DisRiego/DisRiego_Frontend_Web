import { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "./Pagination";
import Table from "./Table";

const Lot = ({ id, dataLots, loadingTable }) => {
  console.log("Entro Lot");
  const [idRow, setIdRow] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [backupData, setBackupData] = useState([]);
  const [filters, setFilters] = useState({ estados: {} });
  const [statusFilter, setStatusFilter] = useState(false);
  const parentComponent = "lot";

  const columns = [
    "ID",
    // "ID del lote",
    "Nombre del lote",
    "Número de documento del dueño",
    "Folio de matricula inmobiliaria",
    "Extensión (m²)",
    "Latitud",
    "Longitud",
    "Tipo de cultivo",
    "Intervalo de pago",
    "Estado",
    "Opciones",
  ];

  const updateData = async () => {
    fetchProperties();
  };

  const toTitleCase = (str) => {
    if (typeof str !== "string") return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  useEffect(() => {
    if (!statusFilter) {
      const filtered = dataLots
        .filter((info) =>
          Object.values(info)
            .join(" ")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
        .map((info) => ({
          ID: info.id,
          // "ID del predio": info.id,
          "Nombre del lote": toTitleCase(info.name) || "",
          "Número de documento del dueño": info.owner_document_number || "",
          "Folio de matricula inmobiliaria":
            info.real_estate_registration_number || "",
          "Extensión (m²)": info.extension || "",
          Latitud: info.latitude || "",
          Longitud: info.longitude || "",
          "Tipo de cultivo": info.type_crop_id || "",
          "Intervalo de pago": info.payment_interval || "",
          Estado: info.state_name || "",
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
  }, [dataLots, searchTerm, filters.estados]);

  const options = [
    { icon: "BiShow", name: "Ver detalles" },
    { icon: "BiEditAlt", name: "Editar" },
    { icon: "MdOutlineCheckCircle", name: "Habilitar" },
    { icon: "VscError", name: "Inhabilitar" },
  ];

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  console.log(dataLots);
  return (
    <>
      <Table
        columns={columns}
        data={paginatedData}
        options={options}
        loadingTable={loadingTable}
        setId={setIdRow}
        // setTitle={setTitle}
        // setShowEdit={setShowEdit}
        // setShowChangeStatus={setShowChangeStatus}
        // setConfirMessage={setConfirMessage}
        // setTypeForm={setTypeForm}
        parentComponent={parentComponent}
      />
      <Pagination
        totalItems={filteredData.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

export default Lot;
