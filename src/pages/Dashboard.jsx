import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Notification from "../components/dashboard/Notification";
import Fault_report from "../components/dashboard/Fault_report";

const Dashboard = () => {
  const { id } = useParams();
  const [selectedOption, setSelectedOption] = useState(id);

  useEffect(() => {
    setSelectedOption(id);
  }, [id]);

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
      case "report":
        return <Fault_report />;
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
        <div className="column column-option">{renderSelectedComponent()}</div>
      </div>
    </>
  );
};

export default Dashboard;
