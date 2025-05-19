import { useEffect, useState } from "react";
import axios from "axios";
import useUserPermissions from "../../../hooks/useUserPermissions";
import Head from "../reusable/Head";
import Tab from "../reusable/Tab";
import Table from "../reusable/Table";
import Pagination from "../reusable/Pagination";
import Message from "../../Message";
import Form_concept from "../forms/adds/Form_concept";
import Change_status_concept from "../Status/Change_status_concept";

const Company_concept = ({}) => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loadingTable, setLoadingTable] = useState(false);
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState("");
  const parentComponent = "concept";
  const [title, setTitle] = useState();
  const [showMessage, setShowMessage] = useState(false);
  const [titleMessage, setTitleMessage] = useState(false);
  const [message, setMessage] = useState(false);
  const [status, setStatus] = useState(false);
  const [showChangeStatus, setShowChangeStatus] = useState(false);
  const [confirMessage, setConfirMessage] = useState();
  const [typeForm, setTypeForm] = useState();

  const {
    permissions: permissionsUser,
    token,
    decodedToken,
  } = useUserPermissions();
  const hasPermission = (permission) => permissionsUser.includes(permission);

  const headData = {
    title: "Gestión de empresa",
    description:
      "En esta sección podrás gestionar las tarifas registradas en la empresa.",
    buttons: {
      button1: {
        icon: "FaPlus",
        class: "color-hover",
        text: "Añadir concepto",
      },
    },
  };

  const handleButtonClick = (buttonText) => {
    if (buttonText === "Añadir concepto") {
      setShowForm(true);
    }
  };

  const tabs = [
    hasPermission("Ver detalles de la empresa") && {
      key: "company",
      label: "Datos de la empresa",
      path: "/dashboard/company",
    },
    hasPermission("Ver todos los certificados digitales") && {
      key: "certificate",
      label: "Certificados Digitales",
      path: "/dashboard/company/certificate",
    },
    hasPermission("Ver todos los tipos de cultivos") && {
      key: "crop",
      label: "Tipo de cultivos",
      path: "/dashboard/company/crop",
    },
    hasPermission("Ver todos los intervalos de pagos") && {
      key: "payment",
      label: "Intervalo de pago",
      path: "/dashboard/company/payment",
    },
    hasPermission("Ver todas las tarifas") && {
      key: "concept",
      label: "Conceptos y tarifas",
      path: "/dashboard/company/concept",
    },
  ].filter(Boolean);

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  const columns = [
    "ID de Concepto",
    "Nombre",
    "Descripción",
    "Valor",
    "Tipo",
    "Alcance",
    "Estado",
    "Opciones",
  ];

  useEffect(() => {
    fetchConcept();
  }, []);

  const fetchConcept = async () => {
    try {
      setLoadingTable(true);
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND_FACTURACTION +
          import.meta.env.VITE_ROUTE_BACKEND_CONCEPT
      );
      setData(response.data.data);
      // const sortedData = data.sort((a, b) => a.id - b.id);
      const sortedData = response.data.data.sort((a, b) => b.id - a.id);

      // setData(sortedData);
      // setButtonDisabled(false);
    } catch (error) {
      console.error("Error al obtener los intervalos:", error);
    } finally {
      setLoadingTable(false);
    }
  };

  const updateData = async () => {
    fetchConcept();
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);
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
      "ID de Concepto": info.id,
      Nombre: info.nombre || "",
      Descripción: info.descripcion || "",
      Valor: formatCurrency(info.valor) || "",
      Tipo: info.tipo_name || "",
      Alcance: info.scope_name || "",
      Estado: info.estado_name || "",
    }));

  const options = [
    { icon: "BiEditAlt", name: "Editar" },
    { icon: "MdOutlineCheckCircle", name: "Habilitar" },
    { icon: "MdDisabledVisible", name: "Inhabilitar" },
  ];

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <>
      <Head
        head_data={headData}
        onButtonClick={handleButtonClick}
        buttonDisabled={buttonDisabled}
      />
      <Tab tabs={tabs} useLinks={true}></Tab>
      <Table
        columns={columns}
        data={paginatedData}
        options={options}
        loadingTable={loadingTable}
        parentComponent={parentComponent}
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
          <Form_concept
            title="Añadir concepto"
            onClose={() => setShowForm(false)}
            setShowMessage={setShowMessage}
            setTitleMessage={setTitleMessage}
            setMessage={setMessage}
            setStatus={setStatus}
            updateData={updateData}
            loading={loading}
            setLoading={setLoading}
          />
        </>
      )}
      {showEdit && (
        <>
          <Form_concept
            title={title}
            onClose={() => setShowEdit(false)}
            setShowMessage={setShowMessage}
            setTitleMessage={setTitleMessage}
            setMessage={setMessage}
            setStatus={setStatus}
            updateData={updateData}
            id={id}
            loading={loading}
            setLoading={setLoading}
          />
        </>
      )}
      {showChangeStatus && (
        <Change_status_concept
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

export default Company_concept;
