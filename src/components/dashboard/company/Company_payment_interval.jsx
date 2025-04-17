import { useEffect, useState } from "react";
import axios from "axios";
import useUserPermissions from "../../../hooks/useUserPermissions";
import Head from "../Head";
import Tab from "../Tab";
import Table from "../Table";
import Pagination from "../Pagination";
import Message from "../../Message";
import Form_interval from "../forms/adds/Form_interval";
import Change_status_interval from "../Status/Change_status_interval";

const Company_payment_interval = ({}) => {
  const {
    permissions: permissionsUser,
    token,
    decodedToken,
  } = useUserPermissions();
  const hasPermission = (permission) => permissionsUser.includes(permission);

  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [loadingTable, setLoadingTable] = useState(false);
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState("");
  const parentComponent = "crop";
  const [title, setTitle] = useState();
  const [showMessage, setShowMessage] = useState(false);
  const [titleMessage, setTitleMessage] = useState(false);
  const [message, setMessage] = useState(false);
  const [status, setStatus] = useState(false);
  const [showChangeStatus, setShowChangeStatus] = useState(false);
  const [confirMessage, setConfirMessage] = useState();
  const [typeForm, setTypeForm] = useState();

  const headData = {
    title: "Gestión de empresa",
    description:
      "En esta sección podrás gestionar los intervalos de pago registrados en la empresa.",
    buttons: {
      ...(hasPermission("Añadir intervalo de pago") && {
        button1: {
          icon: "FaPlus",
          class: "color-hover",
          text: "Añadir intervalo",
        },
      }),
    },
  };

  const handleButtonClick = (buttonText) => {
    if (buttonText === "Añadir intervalo") {
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
      key: "rates",
      label: "Tarifas",
      path: "/dashboard/company/rates",
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

  useEffect(() => {
    fetchPayment();
  }, []);

  const fetchPayment = async () => {
    try {
      setLoadingTable(true);
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND +
          import.meta.env.VITE_ROUTE_BACKEND_COMPANY_PAYMENT_INTERVAL
      );
      setData(response.data.data);

      const sortedData = response.data.data.sort((a, b) => a.id - b.id);

      setData(sortedData);
      setButtonDisabled(false);
    } catch (error) {
      console.error("Error al obtener los intervalos:", error);
    } finally {
      setLoadingTable(false);
    }
  };

  const updateData = async () => {
    fetchPayment();
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
      "ID del intervalo": info.id,
      "Nombre del intervalo": info.name || "",
      "Tiempo del intervalo (días)": info.interval_days || "",
    }));

  console.log(data);

  const columns = [
    "ID del intervalo",
    "Nombre del intervalo",
    "Tiempo del intervalo (días)",
    "Opciones",
  ];

  const options = [
    hasPermission("Editar intervalo de pago") && {
      icon: "BiEditAlt",
      name: "Editar",
    },
    hasPermission("Eliminar intervalo de pago") && {
      icon: "MdDeleteSweep",
      name: "Eliminar",
    },
  ].filter(Boolean);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <>
      <Head head_data={headData} onButtonClick={handleButtonClick} />
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
          <Form_interval
            title="Añadir intervalo"
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
          <Form_interval
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
        <Change_status_interval
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

export default Company_payment_interval;
