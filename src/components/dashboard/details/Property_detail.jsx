import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Head from "../Head";

const Property_detail = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState("");

  const handleButtonClick = (buttonText) => {
    if (buttonText === "Añadir lote") {
      setShowForm(true);
    }

    if (buttonText === "Descargar reporte") {
      setLoading("is-loading");
      generateReport();
    }
  };

  const head_data = {
    title: "Detalles del predio #" + id,
    description:
      "En esta sección podrás visualizar información detallada sobre el predio.",
    buttons: {
      button1: {
        icon: "FaPlus",
        class: "color-hover",
        text: "Añadir lote",
      },
      button2: {
        icon: "LuDownload",
        class: "",
        text: "Descargar reporte",
      },
    },
  };

  return (
    <>
      <Head
        head_data={head_data}
        onButtonClick={handleButtonClick}
        loading={loading}
      />
    </>
  );
};

export default Property_detail;
