import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Head from "../reusable/Head";
import { TbPointFilled } from "react-icons/tb";

const Consumption_detail = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    getDevice();
  }, []);

  const getDevice = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND_FACTURACTION +
          import.meta.env.VITE_ROUTE_BACKEND_GET_CONSUMPTION +
          id
      );
      const backupData = response.data;
      setData(backupData);
    } catch (error) {
      console.log("Error al obtener el dispositivo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // getConsumptionLot();
  }, [data]);

  const getConsumptionLot = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND_FACTURACTION +
          import.meta.env.VITE_ROUTE_BACKEND_GET_CONSUMPTION +
          id
      );
      const backupData = response.data;
      setData(backupData);
    } catch (error) {
      console.log("Error al obtener el dispositivo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const head_data = {
    title: "Detalles del consumo #" + id,
    description: `En esta sección podrás visualizar el consumo de agua registrado del respectivo lote.`,
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const toTitleCase = (str) => {
    if (typeof str !== "string") return str;
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div>
      <Head className="mb-3" head_data={head_data} />

      {isLoading ? (
        <div className="rol-detail">
          <div className="loader-cell">
            <div className="loader cont-loader"></div>
            <p className="loader-text">Cargando información{dots}</p>
          </div>
        </div>
      ) : (
        <>
          {/* Información del rol */}
          <div className="fixed-grid has-2-cols-desktop has-1-cols-mobile mb-0">
            <div className="grid">
              <div className="cell rol-detail">
                <h3 className="title is-6 mb-3">Información del predio</h3>
                <div className="columns is-multiline is-mobile">
                  <div className="column column-p0">ID del predio</div>
                  <div className="column column-p0">{data?.property_id}</div>
                </div>
                <div className="columns is-multiline is-mobile">
                  <div className="column pt-0">Nombre del predio</div>
                  <div className="column pt-0">{data?.property_name}</div>
                </div>
              </div>
              <div className="cell rol-detail">
                <h3 className="title is-6 mb-3">Información del lote</h3>
                <div className="columns is-multiline is-mobile">
                  <div className="column column-p0">ID del lote</div>
                  <div className="column column-p0">{data?.lot_id}</div>
                </div>
                <div className="columns is-multiline is-mobile">
                  <div className="column pt-0">Nombre del lote</div>
                  <div className="column pt-0">{data?.lot_name}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="rol-detail">
            <div className="columns">
              <div className="column column-p0">
                <h3 className="title is-6 mb-1">Consumo registrado</h3>
                <p>{data?.records[0].final_volume} m³</p>
              </div>
              <div className="column column-p0">
                <h3 className="title is-6 mb-1">Consumo proyectado</h3>
                <p>{data?.projected_avg} m³</p>
              </div>
            </div>
            <div className="columns">
              <div className="column">
                <h3 className="title is-6 mb-1">Variación esperada</h3>
                <p>{data?.variation_percent}%</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Consumption_detail;
