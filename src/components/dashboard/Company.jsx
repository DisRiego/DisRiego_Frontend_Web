import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Head from "./Head";
import Company_data from "./company/Company_data";
import Company_certificate from "./company/Company_certificate";
import Company_crop from "./company/Company_crop";
import Company_payment_interval from "./company/Company_payment_interval";
import Company_rates from "./company/Company_rates";
import Form_add_certificate from "./forms/adds/Form_add_certificate";

const Company = () => {
  const { id } = useParams();
  const [selectedOption, setSelectedOption] = useState(id);
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("company");
  const [showForm, setShowForm] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [titleMessage, setTitleMessage] = useState(false);
  const [message, setMessage] = useState(false);
  const [status, setStatus] = useState(false);

  console.log(id);
  const handleButtonClick = (buttonText) => {
    if (buttonText === "Añadir certificado") {
      setShowForm(true);
    }
  };

  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    const companyData = {
      id: 1,
      name: "Dis_riego",
      nit: "900123456-7",
      billing_certificate: "Certificado_Fact_001",
      contact_email: "contacto@disriego.com",
      contact_phone: "+57 310 1234567",
      country: "Colombia",
      department: "Huila",
      city: "Neiva",
      address: "Calle 10 # 5-20",
      color_palette: ["#144D2A", "#B4E475", "#E6E6E6", "#4A4A4A", "#000000"],
    };
    setData(companyData);
  };

  const updateData = async () => {
    fetchCompany();
  };

  const headData = {
    company: {
      title: data?.name || "Nombre de la empresa",
      description:
        "En esta sección podrás gestionar y visualizar la información tu empresa.",
    },
    certificate: {
      title: data?.name || "",
      description: "Gestiona los certificados digitales de la empresa.",
      buttons: {
        button1: {
          icon: "FaPlus",
          class: "color-hover",
          text: "Añadir certificado",
        },
      },
    },
    crop: {
      title: data?.name || "Nombre de la empresa",
      description: "Administra los tipos de cultivos de la empresa.",
      buttons: {
        button1: {
          icon: "FaPlus",
          class: "color-hover",
          text: "Añadir cultivo",
        },
      },
    },
    payment_interval: {
      title: data?.name || "Nombre de la empresa",
      description: "Configura los intervalos de pago de la empresa.",
      buttons: {
        button1: {
          icon: "FaPlus",
          class: "color-hover",
          text: "Añadir intervalo",
        },
      },
    },
    rate: {
      title: data?.name || "Nombre de la empresa",
      description: "Gestiona las tarifas de los consumos del agua.",
      buttons: {
        button1: {
          icon: "FaPlus",
          class: "color-hover",
          text: "Añadir tarifa",
        },
      },
    },
  };

  const handleTabChange = (tab) => setActiveTab(tab);

  const renderContent = () => {
    switch (activeTab) {
      case "company":
        return <Company_data />;
      case "certificate":
        return <Company_certificate />;
      case "crop":
        return <Company_crop />;
      case "payment_interval":
        return <Company_payment_interval />;
      case "rate":
        return <Company_rates />;
      default:
        return null;
    }
  };

  return (
    <>
      <Head head_data={headData[activeTab]} onButtonClick={handleButtonClick} />
      <div className="tabs is-boxed">
        <ul>
          {["company", "certificate", "crop", "payment_interval", "rate"].map(
            (tab) => (
              <li key={tab} className={activeTab === tab ? "is-active" : ""}>
                <a onClick={() => handleTabChange(tab)}>
                  {tab === "company" && "Datos de la empresa"}
                  {tab === "certificate" && "Certificados digitales"}
                  {tab === "crop" && "Tipos de cultivos"}
                  {tab === "payment_interval" && "Intervalo de pago"}
                  {tab === "rate" && "Tarifas"}
                </a>
              </li>
            )
          )}
        </ul>
      </div>
      <div>{renderContent()}</div>
      {showForm && (
        <>
          <Form_add_certificate
            title="Añadir certificado digital"
            onClose={() => setShowForm(false)}
            setShowMessage={setShowMessage}
            setTitleMessage={setTitleMessage}
            setMessage={setMessage}
            setStatus={setStatus}
            updateData={updateData}
          />
        </>
      )}
    </>
  );
};

export default Company;
