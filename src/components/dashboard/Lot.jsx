import { useEffect, useMemo, useState } from "react";
import Pagination from "./reusable/Pagination";
import Table from "./reusable/Table";
import useUserPermissions from "../../hooks/useUserPermissions";

const Lot = ({
  // id,
  dataLots,
  loadingTable,
  setIdRow,
  setTitle,
  setShowEdit,
  setShowEditUser,
  setShowChangeStatus,
  setConfirMessage,
  setTypeForm,
  route,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [backupData, setBackupData] = useState([]);
  const [filters, setFilters] = useState({ estados: {} });
  const [statusFilter, setStatusFilter] = useState(false);

  console.log(dataLots);

  const parentComponent = "lot";
  const {
    permissions: permissionsUser,
    token,
    decodedToken,
  } = useUserPermissions();
  const hasPermission = (permission) => permissionsUser.includes(permission);

  const columns = [
    "ID",
    // "ID del lote",
    "Nombre del lote",
    "Folio de matricula inmobiliaria",
    "Extensión (m²)",
    "Latitud",
    "Longitud",
    "Tipo de cultivo",
    "Intervalo de pago",
    "Fecha estimada de cosecha",
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
          "Folio de matricula inmobiliaria":
            info.real_estate_registration_number || "",
          "Extensión (m²)": info.extension || "",
          Latitud: info.latitude || "",
          Longitud: info.longitude || "",
          "Tipo de cultivo": toTitleCase(info.nombre_tipo_cultivo) || "",
          "Intervalo de pago": info.nombre_intervalo_pago || "",
          "Fecha estimada de cosecha": info.estimated_harvest_date || "",
          Estado: info.nombre_estado || "",
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

  const allOptions = [
    hasPermission("Ver detalles de un lote") && {
      icon: "BiShow",
      name: "Ver detalles",
    },
    hasPermission("Editar lote") && { icon: "BiEditAlt", name: "Editar" },
    hasPermission("Habilitar lote") && {
      icon: "MdOutlineCheckCircle",
      name: "Habilitar",
    },
    hasPermission("Inhabilitar lote") && {
      icon: "VscError",
      name: "Inhabilitar",
    },
  ].filter(Boolean);

  const options = useMemo(() => {
    if (route === "properties") {
      return [
        hasPermission("Ver detalles del lote de un usuario") && {
          icon: "BiShow",
          name: "Ver detalles",
        },
        hasPermission("Editar lotes de un usuario") && {
          icon: "BiEditAlt",
          name: "Editar",
        },
      ].filter(Boolean);
    }

    return allOptions;
  }, [route, permissionsUser]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <>
      <Table
        columns={columns}
        data={paginatedData}
        options={options}
        loadingTable={loadingTable}
        setId={setIdRow}
        setTitle={setTitle}
        setShowEdit={setShowEdit}
        setShowEditUser={setShowEditUser}
        setShowChangeStatus={setShowChangeStatus}
        setConfirMessage={setConfirMessage}
        setTypeForm={setTypeForm}
        parentComponent={parentComponent}
        route={route}
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
