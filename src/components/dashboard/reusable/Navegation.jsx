import { useNavigate, useLocation } from "react-router-dom";
import Names_navegation from "./Names_navegation";

/**
  Componente Navegation:
  Muestra una ruta de navegación (breadcrumb) según la URL actual.
*/
const Navegation = () => {
  const navigate = useNavigate(); // Para redirigir al hacer clic en los botones
  const location = useLocation(); // Obtiene la ruta actual

  // Divide la URL en partes, eliminando vacíos (por ejemplo, "/dashboard/lote/3" => ["dashboard", "lote", "3"])
  const pathSegments = location.pathname.split("/").filter(Boolean);

  // Si hay menos de 3 segmentos, no se muestra el breadcrumb (por ejemplo, si se está ubicado en "/dashboard")
  if (pathSegments.length < 3) {
    return null;
  }

  const breadcrumb = []; // Arreglo donde se guardan los pasos de navegación
  let currentPath = ""; // Ruta acumulada que se va armando

  pathSegments.forEach((segment, index) => {
    // Agrega este segmento a la ruta actual
    currentPath += `/${segment}`;

    /**
      Ignora el primer segmento o "dashboard" para no mostrarlo como parte del breadcrumb.
    */
    if (index === 0 || segment === "dashboard") {
      return;
    }

    const isNumber = !isNaN(segment); // Verifica si el segmento actual es un número
    const parentSegment = pathSegments[index - 1]; // Segmento anterior (usado para buscar el módulo padre)
    const parentModule = Names_navegation[parentSegment]; // Encuentra el módulo padre desde la configuración

    /**
      Si es el segundo segmento y está registrado en Names_navegation, se añade como módulo principal.
    */
    if (index === 1 && Names_navegation[segment]) {
      breadcrumb.push({
        name: Names_navegation[segment].name,
        path: currentPath,
      });
      return;
    }

    /**
      Si el segmento actual es un número y hay un submódulo tipo "detail",
      se reemplaza el placeholder (#) con el ID actual para mostrar algo como "Ver detalles del lote #3".
    */
    if (parentModule?.submodules?.detail && isNumber) {
      const detailName = parentModule.submodules.detail.replace(
        "#",
        `#${segment}`
      );
      breadcrumb.push({
        name: detailName,
        path: currentPath,
      });
    }
  });

  return (
    <div className="navigation">
      {/** Recorre el breadcrumb generado y lo muestra */}
      {breadcrumb.map((item, index) => (
        <span key={index} className="breadcrumb">
          {/** Si es la ruta actual, muestra el nombre en texto plano */}
          {location.pathname === item.path ? (
            <span>{item.name}</span>
          ) : (
            // Si no es la ruta actual, se puede hacer clic para ir a esa parte
            <button onClick={() => navigate(item.path)}>{item.name}</button>
          )}
          {index < breadcrumb.length - 1 && " > "}
        </span>
      ))}
    </div>
  );
};

export default Navegation;
