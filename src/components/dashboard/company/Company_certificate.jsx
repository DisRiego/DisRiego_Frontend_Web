import { useEffect, useState } from "react";
import axios from "axios";
import useUserPermissions from "../../../hooks/useUserPermissions";
import Head from "../reusable/Head";
import Tab from "../reusable/Tab";
import Table from "../reusable/Table";
import Pagination from "../reusable/Pagination";
import Message from "../../Message";
import Form_certificate from "../forms/adds/Form_certificate";
import Change_status_certificate from "../Status/Change_status_certificate";

const Company_certificate = ({}) => {
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
  const parentComponent = "certificate";
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
      "En esta sección podrás gestionar los certificados digitales registrados en la empresa.",
    buttons: {
      ...(hasPermission("Añadir certificado") && {
        button1: {
          icon: "FaPlus",
          class: "color-hover",
          text: "Añadir certificado",
        },
      }),
    },
  };

  const handleButtonClick = (buttonText) => {
    if (buttonText === "Añadir certificado") {
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
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoadingTable(true);
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND +
          import.meta.env.VITE_ROUTE_BACKEND_COMPANY_CERTIFICATE
      );
      setData(response.data.data);

      const sortedData = response.data.data.sort(
        (a, b) => new Date(b.start_date) - new Date(a.start_date)
      );

      setData(sortedData);
      // setButtonDisabled(false);
    } catch (error) {
      console.error("Error al obtener los certificados:", error);
    } finally {
      setLoadingTable(false);
    }
  };

  const updateData = async () => {
    fetchCertificates();
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
      "Numéro de serie": info.serial_number || "",
      "Nit empresa": info.nit || "",
      "Fecha de generación": info.start_date || "",
      "Fecha de expiración": info.expiration_date || "",
      Anexo: info.attached || "",
      Estado: info.nombre_estado || "",
    }));

  console.log(data);

  const columns = [
    "Numéro de serie",
    "Nit empresa",
    "Fecha de generación",
    "Fecha de expiración",
    "Anexo",
    "Estado",
    "Opciones",
  ];

  const options = [
    hasPermission("Editar certificado") && {
      icon: "BiEditAlt",
      name: "Editar",
    },
    hasPermission("Habilitar certificado") && {
      icon: "MdOutlineCheckCircle",
      name: "Habilitar",
    },
    hasPermission("Inhabilitar certificado") && {
      icon: "MdDisabledVisible",
      name: "Inhabilitar",
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
          <Form_certificate
            title="Añadir certificado"
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
          <Form_certificate
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
        <Change_status_certificate
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

export default Company_certificate;
