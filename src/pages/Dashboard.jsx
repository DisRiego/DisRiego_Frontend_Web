import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Head from "../components/dashboard/Head";
import Sidebar from "../components/Sidebar";
import Rol from "../components/dashboard/Rol";

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
      case "rol":
        return <Rol />;
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
