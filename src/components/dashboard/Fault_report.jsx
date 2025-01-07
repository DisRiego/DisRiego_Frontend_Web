import Head from "./Head";
import Search from "./Search";
import Filter from "./Filter";

const Fault_report = () => {
    const data = {
        title: "Reportes de fallos",
        description: "En esta sección puedes visualizar y generar reportes de fallos.",
        buttons: {
          button1: {
            icon: "FaPlus",
            class: "color-hover",
            text: "Reportar fallo",
          },
          button2: {
            icon: "LuDownload",
            class: "",
            text: "Descargar reporte",
          }
        },
      };
      return (
        <>
          <Head data={data} />
          <Search/>
          <Filter/>
        </>
      );
}

export default Fault_report