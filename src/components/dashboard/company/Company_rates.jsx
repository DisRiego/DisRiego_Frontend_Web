import { useEffect, useState } from "react";
import axios from "axios";
import useUserPermissions from "../../../hooks/useUserPermissions";
import Head from "../Head";
import Tab from "../Tab";
import Table from "../Table";
import Pagination from "../Pagination";
import Message from "../../Message";

const Company_rates = ({}) => {
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

  const headData = {
    title: "Gestión de empresa",
    description:
      "En esta sección podrás gestionar las tarifas registradas en la empresa.",
    buttons: {
      button1: {
        icon: "FaPlus",
        class: "color-hover",
        text: "Añadir intervalo",
      },
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
    fetchCrop();
  }, []);

  const fetchCrop = async () => {
    try {
      setLoadingTable(true);
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND +
          import.meta.env.VITE_ROUTE_BACKEND_COMPANY_CROP
      );
      setData(response.data.data);

      const sortedData = response.data.data.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      // const sortedData = response.data.data.sort((a, b) => a.name - b.name);

      setData(sortedData);
      setButtonDisabled(false);
    } catch (error) {
      console.error("Error al obtener los intervalos:", error);
    } finally {
      setLoadingTable(false);
    }
  };

  const updateData = async () => {
    fetchCrop();
  };

  // const filteredData = data
  //   .filter((info) =>
  //     Object.values(info)
  //       .join(" ")
  //       .toLowerCase()
  //       .includes(searchTerm.toLowerCase())
  //   )
  //   .map((info) => ({
  //     ID: info.id,
  //     "Nombre del cultivo": info.name || "",
  //     "Tiempo estimada de cosecha": info.harvest_time || "",
  //     Intervalo: info.payment_interval_id || "",
  //     Estado: info.state_name || "",
  //   }));

  // console.log(data);

  // const columns = [
  //   "Nombre del cultivo",
  //   "Tiempo estimada de cosecha",
  //   "Intervalo",
  //   "Estado",
  //   "Opciones",
  // ];

  // const options = [
  //   { icon: "BiEditAlt", name: "Editar" },
  //   { icon: "MdOutlineCheckCircle", name: "Habilitar" },
  //   { icon: "MdDisabledVisible", name: "Inhabilitar" },
  // ];

  // const startIndex = (currentPage - 1) * itemsPerPage;
  // const paginatedData = filteredData.slice(
  //   startIndex,
  //   startIndex + itemsPerPage
  // );

  return (
    <>
      <Head head_data={headData} onButtonClick={handleButtonClick} />
      <Tab tabs={tabs} useLinks={true}></Tab>
      {/* <Table
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
          <Form_crop
            title="Añadir cultivo"
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
          <Form_crop
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
      )} */}
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

export default Company_rates;
