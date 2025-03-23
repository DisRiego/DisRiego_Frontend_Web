import { useEffect, useState } from "react";
import Head from "./Head";
import Company_data from "./company/Company_data";
import Company_certificate from "./company/Company_certificate";
import Company_crop from "./company/Company_crop";
import Company_payment_interval from "./company/Company_payment_interval";
import Company_rates from "./company/Company_rates";
import Message from "../Message";

const Company = () => {
  const [activeTab, setActiveTab] = useState("company");
  const [showForm, setShowForm] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [titleMessage, setTitleMessage] = useState(false);
  const [message, setMessage] = useState(false);
  const [status, setStatus] = useState(false);

  const handleButtonClick = (buttonText) => {
    if (buttonText === "Añadir certificado") {
      setShowForm(true);
    }
  };

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  const headData = {
    company: {
      title: "Gestión de empresa",
      description:
        "En esta sección podrás gestionar y visualizar la información de la empresa.",
    },
    certificate: {
      title: "Gestión de empresa",
      description:
        "En esta sección podrás gestionar los certificados digitales de la empresa.",
      buttons: {
        button1: {
          icon: "FaPlus",
          class: "color-hover",
          text: "Añadir certificado",
        },
      },
    },
    crop: {
      title: "Gestión de empresa",
      description:
        "En esta sección podrás administrar los tipos de cultivos de la empresa.",
      buttons: {
        button1: {
          icon: "FaPlus",
          class: "color-hover",
          text: "Añadir cultivo",
        },
      },
    },
    payment_interval: {
      title: "Gestión de empresa",
      description:
        "En esta sección podrás configurar los intervalos de pago de la empresa.",
      buttons: {
        button1: {
          icon: "FaPlus",
          class: "color-hover",
          text: "Añadir intervalo",
        },
      },
    },
    rate: {
      title: "Gestión de empresa",
      description:
        "En esta sección podrás gestionar las tarifas de consumo de agua de la empresa.",
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
        return (
          <Company_data
            setShowMessage={setShowMessage}
            setStatus={setStatus}
            setTitleMessage={setTitleMessage}
            setMessage={setMessage}
          />
        );
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
      <>
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
      </>
      {/* {showForm && (
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

export default Company;
