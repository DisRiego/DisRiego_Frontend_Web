import { useState } from "react";
import Head from "../components/dashboard/Head";

const Dashboard = () => {
  let [date, setDate] = useState({});

  date = {
    title: "Titulo",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas eget vehicula urna. Sed vitae quam eu nunc varius mollis.",
  };

  return (
    <>
      <h1>Dashboard</h1>
        <Head date={date}/>
    </>
  );
};

export default Dashboard;
