import { useNavigate, useLocation } from "react-router-dom";
import Names_navegation from "./Names_navegation";

const Navegation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Divide la ruta en segmentos y elimina vacíos
  const pathSegments = location.pathname.split("/").filter(Boolean);

  // Si la ruta no tiene suficientes segmentos para un breadcrumb, no se muestra
  if (pathSegments.length < 3) {
    return null; // No mostrar si no hay submódulos o detalles
  }

  const breadcrumb = [];
  let currentPath = "";

  pathSegments.forEach((segment, index) => {
    // Construir el camino actual de la ruta
    currentPath += `/${segment}`;

    if (index === 0 || segment === "dashboard") {
      // Ignorar el primer segmento o "dashboard"
      return;
    }

    const isNumber = !isNaN(segment); // Verificar si el segmento actual es un número
    const parentSegment = pathSegments[index - 1]; // Segmento anterior (módulo padre)
    const parentModule = Names_navegation[parentSegment]; // Buscar el módulo padre en la configuración

    // Agregar el módulo principal al breadcrumb
    if (index === 1 && Names_navegation[segment]) {
      breadcrumb.push({
        name: Names_navegation[segment].name,
        path: currentPath,
      });
      return;
    }

    // Agregar submódulos dinámicos (detalles con IDs)
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
      {breadcrumb.map((item, index) => (
        <span key={index} className="breadcrumb">
          {location.pathname === item.path ? (
            <span>{item.name}</span>
          ) : (
            <button onClick={() => navigate(item.path)}>{item.name}</button>
          )}
          {index < breadcrumb.length - 1 && " > "}
        </span>
      ))}
    </div>
  );
};

export default Navegation;
