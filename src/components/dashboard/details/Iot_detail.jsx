import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Head from "../Head";
import { TbPointFilled } from "react-icons/tb";

const Iot_detail = () => {
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
        import.meta.env.VITE_URI_BACKEND_IOT +
          import.meta.env.VITE_ROUTE_BACKEND_DEVICES +
          id
      );
      const backupDate = response.data.data;
      console.log(backupDate);
      setData(backupDate);
    } catch (error) {
      console.log("Error al obtener el dispositivo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const head_data = {
    title: "Detalles del Dispositivo #" + id,
    description: `En esta sección, puedes consultar la información del dispositivo seleccionado.`,
  };

  // Agrupar permisos por categoría
  const permisosPorCategoria = data?.permissions?.reduce((acc, permiso) => {
    if (!acc[permiso.category]) {
      acc[permiso.category] = [];
    }
    acc[permiso.category].push(permiso.name);
    return acc;
  }, {});

  const toTitleCase = (str) => {
    if (typeof str !== "string") return str; // Evita errores con números u otros tipos
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const toLabel = (str) => {
    const UNITS = [
      "Ah",
      "A",
      "W",
      "V",
      "VAC",
      "VDC",
      "Hz",
      "VA",
      "kWh",
      "kW",
      "mA",
    ];

    return str
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => {
        // Detecta si es tipo "(ah)" o "(vdc)"
        const matchParens = word.match(/^\((.+)\)$/);
        if (matchParens) {
          const inner = matchParens[1];
          const matchedUnit = UNITS.find(
            (unit) => unit.toLowerCase() === inner.toLowerCase()
          );
          if (matchedUnit) return `(${matchedUnit})`;
        }

        // Detecta palabra completa que es unidad
        const matchedUnit = UNITS.find(
          (unit) => unit.toLowerCase() === word.toLowerCase()
        );
        if (matchedUnit) return matchedUnit;

        // Capitaliza palabra normal
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
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
          <div className="rol-detail">
            <div className="is-flex is-justify-content-space-between is-align-items-center">
              <h3 className="title is-6 mb-0">Estado actual</h3>
              <span className={`button detail-status status-${data.status}`}>
                <TbPointFilled />
                {data?.device_status_name}
              </span>
            </div>
            {data?.lot_id && (
              <div className="columns mt-0">
                <div className="column">
                  <h3 className="title is-6 mb-2">Información del predio</h3>
                  <p>
                    <strong>ID del Predio: </strong>
                    {data?.property_id}
                  </p>
                  <p>
                    <strong>Nombre del Predio: </strong>
                    {data?.property_name}
                  </p>
                </div>
                <div className="column">
                  <h3 className="title is-6 mb-2">Información del lote</h3>
                  <p>
                    <strong>ID del lote: </strong>
                    {data?.lot_id}
                  </p>
                  <p>
                    <strong>Nombre del lote: </strong>
                    {data?.lot_name}
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="rol-detail">
            <div className="columns">
              <div className="column">
                <h3 className="title is-6 mb-2">ID del dispositivo</h3>
                <p>{data?.id}</p>
              </div>
              <div className="column">
                <h3 className="title is-6 mb-2">Tipo de dispositivo</h3>
                <p>{data?.device_type_name}</p>
              </div>
            </div>
            <div className="columns">
              <div className="column">
                <h3 className="title is-6 mb-2">Número de serie</h3>
                <p>{data?.serial_number}</p>
              </div>
              <div className="column">
                <h3 className="title is-6 mb-2">Modelo</h3>
                <p>{data?.model}</p>
              </div>
            </div>
            {data?.installation_date && (
              <div className="columns">
                <div className="column">
                  <h3 className="title is-6 mb-2">Fecha de instalación</h3>
                  <p>{data?.installation_date?.slice(0, 10)}</p>
                </div>
                <div className="column">
                  <h3 className="title is-6 mb-2">
                    Fecha estimada de mantenimiento
                  </h3>
                  <p>{data?.estimated_maintenance_date?.slice(0, 10)}</p>
                </div>
              </div>
            )}
            {Object.entries(data.price_device)
              .filter(
                ([key]) =>
                  key !== "sensor_value" &&
                  key !== "cantidad_de_polos" &&
                  !key.startsWith("polo_")
              )
              .reduce((acc, curr, index, arr) => {
                if (index % 2 === 0) {
                  acc.push(arr.slice(index, index + 2));
                }
                return acc;
              }, [])
              .map((pair, idx) => (
                <div className="columns" key={idx}>
                  {pair.map(([key, value], subIdx) => (
                    <div className="column" key={subIdx}>
                      <p>
                        <strong>{toLabel(key)}</strong>
                      </p>
                      <p>{value}</p>
                    </div>
                  ))}
                  {pair.length === 1 && <div className="column"></div>}
                </div>
              ))}
          </div>

          {/* Campos de polos */}
          {Object.keys(data.price_device).some((key) =>
            key.startsWith("polo_")
          ) && (
            <div className="rol-detail">
              <h3 className="title is-6 mb-2">Tensión máxima por polo (V)</h3>
              {Object.entries(data.price_device)
                .filter(([key]) => key.startsWith("polo_"))
                .reduce((acc, curr, index, arr) => {
                  if (index % 2 === 0) {
                    acc.push(arr.slice(index, index + 2));
                  }
                  return acc;
                }, [])
                .map((pair, idx) => (
                  <div className="columns is-mobile" key={idx}>
                    {pair.map(([key, value], subIdx) => (
                      <div className="column" key={subIdx}>
                        <p>
                          <strong>{toLabel(key)}</strong>
                        </p>
                        <p>{value}</p>
                      </div>
                    ))}
                    {pair.length === 1 && <div className="column"></div>}
                  </div>
                ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Iot_detail;
