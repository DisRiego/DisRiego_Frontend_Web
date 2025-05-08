import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import useUserPermissions from "../../hooks/useUserPermissions";
import Head from "./reusable/Head";
import Tab from "./reusable/Tab";
import Search from "./reusable/Search";
import Filter from "./reusable/Filter";
import Table from "./reusable/Table";
import Pagination from "./reusable/Pagination";

const Billing = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState("");
  const [loadingTable, setLoadingTable] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const itemsPerPage = 5;

  const {
    permissions: permissionsUser,
    token,
    decodedToken,
  } = useUserPermissions();
  const hasPermission = (permission) => permissionsUser.includes(permission);

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
          issue_date: "2025-04-01",
          due_date: "2025-04-30",
          amount_due: 150000,
          attachment: "factura_fac-001.pdf",
          status_name: "Pendiente",
        },
        {
          id: 2,
          property_id: 102,
          lot_id: 8,
          owner_document_number: "9876543210",
          payment_interval_name: "Bimestral",
          issue_date: "2025-04-05",
          due_date: "2025-06-05",
          amount_due: 300000,
          attachment: "factura_fac-002.pdf",
          status_name: "Pagada",
        },
        {
          id: 3,
          property_id: 103,
          lot_id: 2,
          owner_document_number: "1122334455",
          payment_interval_name: "Trimestral",
          issue_date: "2025-03-15",
          due_date: "2025-06-15",
          amount_due: 450000,
          attachment: "factura_fac-003.pdf",
          status_name: "Vencida",
        },
        {
          id: 3,
          property_id: 103,
          lot_id: 2,
          owner_document_number: "1010115909",
          payment_interval_name: "Anual",
          issue_date: "2025-04-01",
          due_date: "2025-04-15",
          amount_due: 500000,
          attachment: "factura_fac-004.pdf",
          status_name: "Vencida",
        },
      ];

      setData(billing);

      //   setData(sortedData);
    } catch (error) {
      console.error("Error al obtener las facturas:", error);
    } finally {
      setButtonDisabled(false);
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
          "N° Factura": info.id,
          "ID del predio": info.property_id,
          "ID del lote": info.lot_id,
          "Número de documento": info.owner_document_number,
          "Intervalo de pago": info.payment_interval_name,
          "Fecha de emisión": info.due_date?.slice(0, 10),
          "Fecha de vencimiento": info.due_date?.slice(0, 10),
          "Valor a pagar": info.amount_due,
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

  return (
    <>
      <Head head_data={head_data} />
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
            <div className="total_amount">
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
    </>
  );
};

export default Billing;
