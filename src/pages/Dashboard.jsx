import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Head from "../components/dashboard/Head";
import Sidebar from "../components/Sidebar";
import Rol from "../components/dashboard/Rol";
import Notification from "../components/dashboard/Notification";

const Dashboard = () => {
  const { id } = useParams();
  const [selectedOption, setSelectedOption] = useState(id);

  useEffect(() => {
    setSelectedOption(id);
  }, [id]);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const renderSelectedComponent = () => {
    switch (selectedOption) {
      case "notification":
        return <Notification />;
      case "rol":
        return 1;
    }
  };

  return (
    <>
      <div className="columns">
        <div className="column">
          <Sidebar
            handleOptionChange={handleOptionChange}
            selectedOption={selectedOption}
          />
        </div>
        <div className="column">{renderSelectedComponent()}</div>
      </div>
    </>
  );
};

export default Dashboard;
