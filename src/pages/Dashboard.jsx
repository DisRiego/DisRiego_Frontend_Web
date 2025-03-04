import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navegation from "../components/dashboard/Navegation";
import Notification from "../components/dashboard/Notification";
import Fault_report from "../components/dashboard/Fault_report";
import Invoice_detail from "../components/dashboard/details/Invoice_detail";
import Property from "../components/dashboard/Property";
import Property_detail from "../components/dashboard/details/Property_detail";
import Lot_detail from "../components/dashboard/details/Lot_detail";
import Rol from "../components/dashboard/Rol";
import Rol_detail from "../components/dashboard/details/Rol_detail";
import User from "../components/dashboard/User";
import User_detail from "../components/dashboard/details/User_detail";

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
      case `lot/${id}`:
        return <Lot_detail />;
      case "report":
        return <Fault_report />;
      case `report/${id}`:
        return <Invoice_detail />;
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
