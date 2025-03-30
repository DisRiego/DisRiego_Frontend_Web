import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navegation from "../components/dashboard/Navegation";
import Notification from "../components/dashboard/Notification";
import Fault_report from "../components/dashboard/Fault_report";
import Invoice_detail from "../components/dashboard/details/Invoice_detail";
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
import Company_rates from "../components/dashboard/company/Company_rates";
import Iot from "../components/dashboard/Iot";
import Profile from "../components/dashboard/Profile";

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
      case `iot`:
        return <Iot />;
      case "report":
        return <Fault_report />;
      case "company":
        return <Company_data />;
      case `certificate`:
        return <Company_certificate />;
      case `crop`:
        return <Company_crop />;
      case `payment`:
        return <Company_payment_interval />;
      case `rates`:
        return <Company_rates />;
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
