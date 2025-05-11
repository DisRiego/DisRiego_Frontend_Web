import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navegation from "../components/dashboard/reusable/Navegation";
import Notification from "../components/dashboard/Notification";
import Property from "../components/dashboard/Property";
import Property_user from "../components/dashboard/Property_user";
import Property_detail from "../components/dashboard/details/Property_detail";
import Lot_detail from "../components/dashboard/details/Lot_detail";
import Rol from "../components/dashboard/Rol";
import Rol_detail from "../components/dashboard/details/Rol_detail";
import User from "../components/dashboard/User";
import User_detail from "../components/dashboard/details/User_detail";
import Company_data from "../components/dashboard/company/Company_data";
import Company_certificate from "../components/dashboard/company/Company_certificate";
import Company_crop from "../components/dashboard/company/Company_crop";
import Company_payment_interval from "../components/dashboard/company/Company_payment_interval";
import Company_concept from "../components/dashboard/company/Company_concept";
import Device from "../components/dashboard/Device";
import Device_detail from "../components/dashboard/details/Device_detail";
import Profile from "../components/dashboard/Profile";
import Request from "../components/dashboard/Request";
import Request_detail from "../components/dashboard/details/Request_detail";
import Fault_report from "../components/dashboard/Fault_report";
import Fault_report_detail from "../components/dashboard/details/Fault_report_detail";
import System_fault from "../components/dashboard/System_fault";
import System_report_detail from "../components/dashboard/details/System_report_detail";
import Billing from "../components/dashboard/Billing";
import Billing_detail from "../components/dashboard/details/Billing_detail";
import Form_pay from "../components/dashboard/forms/adds/Form_pay";
import Transaction from "../components/dashboard/Transaction";

const Dashboard = () => {
  const { id } = useParams();
  const location = useLocation();
  const [selectedOption, setSelectedOption] = useState(id);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    if (!isNaN(id)) {
      const segments = location.pathname.split("/").filter(Boolean);
      const length = segments.length;
      const penultimate_segment = segments[length - 2];
      const last_segment = segments[length - 1];

      setSelectedOption(`${penultimate_segment}/${last_segment}`);
    } else {
      setSelectedOption(id);
    }
  }, [id, location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const renderSelectedComponent = () => {
    switch (selectedOption) {
      case "notification":
        return <Notification />;
      case "request":
        return <Request />;
      case `request/${id}`:
        return <Request_detail />;
      case "rol":
        return <Rol />;
      case `rol/${id}`:
        return <Rol_detail />;
      case "user":
        return <User />;
      case `user/${id}`:
        return <User_detail />;
      case "property":
        return <Property />;
      case `property/${id}`:
        return <Property_detail />;
      case "properties":
        return <Property_user />;
      case `properties/${id}`:
        return <Property_detail />;
      case `lot/${id}`:
        return <Lot_detail />;
      case `device`:
        return <Device />;
      case `device/${id}`:
        return <Device_detail />;
      case "system":
        return <System_fault />;
      case `system/${id}`:
        return <System_report_detail />;
      case "report":
        return <Fault_report />;
      case `report/${id}`:
        return <Fault_report_detail />;
      case `billing`:
        return <Billing />;
      case `billing/${id}`:
        return <Billing_detail />;
      case `transaction`:
        return <Transaction />;
      case `transaction/${id}`:
        return <Billing_detail />;
      case `pay/${id}`:
        return <Form_pay />;
      case "company":
        return <Company_data />;
      case `certificate`:
        return <Company_certificate />;
      case `crop`:
        return <Company_crop />;
      case `payment`:
        return <Company_payment_interval />;
      case `concept`:
        return <Company_concept />;
      case `profile`:
        return <Profile />;
    }
  };

  return (
    <>
      <div className="columns dashboard">
        <div className="column is-narrow">
          <Sidebar
            handleOptionChange={handleOptionChange}
            selectedOption={selectedOption}
          />
        </div>
        <div className="column column-option">
          <Navegation />
          {renderSelectedComponent()}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
