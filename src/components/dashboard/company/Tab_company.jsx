import { Link, useParams } from "react-router-dom";

const Tab_company = () => {
  const { id } = useParams();

  const tabs = [
    {
      key: "company",
      label: "Datos de la empresa",
      path: "/dashboard/company",
    },
    {
      key: "certificate",
      label: "Certificados Digitales",
      path: "/dashboard/company/certificate",
    },
    {
      key: "crop",
      label: "Tipo de cultivos",
      path: "/dashboard/company/crop",
    },
    {
      key: "payment",
      label: "Intervalo de pago",
      path: "/dashboard/company/payment",
    },
    { key: "rates", label: "Tarifas", path: "/dashboard/company/rates" },
  ];

  return (
    <div className="tabs is-boxed">
      <ul className="mt-0">
        {tabs.map((tab) => (
          <li key={tab.key} className={id === tab.key ? "is-active" : ""}>
            <Link to={tab.path}>{tab.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tab_company;
