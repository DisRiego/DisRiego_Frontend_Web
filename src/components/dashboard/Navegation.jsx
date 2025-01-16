import { useNavigate, useLocation } from "react-router-dom";
import Names_navegation from "./Names_navegation";

const Navegation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const pathSegments = location.pathname.split("/").filter(Boolean);

  // Si solo hay un segmento o si la ruta es simplemente "dashboard", no mostramos nada
  if (pathSegments.length === 1 || (pathSegments[0] === "dashboard" && pathSegments.length === 2)) {
    return null;
  }

  const breadcrumb = [];
  let pathAccumulator = "/dashboard"; // Para construir las rutas dinámicas

  // Recorremos todos los segmentos de la ruta
  for (let i = 0; i < pathSegments.length; i++) {
    const segment = pathSegments[i];
    
    // Si hay un módulo principal (ej: "property", "lot"), lo agregamos
    if (Names_navegation[segment]) {
      breadcrumb.push({
        name: Names_navegation[segment].name,
        path: `${pathAccumulator}/${segment}`,
      });
      pathAccumulator += `/${segment}`;
    }

    // Si hay un submódulo (ej: "detail", "lot"), lo agregamos
    if (Names_navegation[segment]?.submodules) {
      const subModuleName = Names_navegation[segment].submodules[pathSegments[i + 1]]; // Usamos el siguiente segmento como submódulo
      if (subModuleName) {
        const idSegment = pathSegments[i + 2]; // ID del elemento (como el #1)
        const formattedSubModuleName = subModuleName.includes("#")
          ? subModuleName.replace("#", `#${idSegment || ""}`)
          : subModuleName;

        breadcrumb.push({
          name: formattedSubModuleName,
          path: `${pathAccumulator}/${pathSegments[i + 1]}${idSegment ? `/${idSegment}` : ""}`,
        });
      }
    }
  }

  return (
    <div className="navigation">
      {breadcrumb.map((item, index) => (
        <span key={index} className="breadcrumb">
          {/* Comprobamos si es el último elemento o si el breadcrumb es "Mis Lotes" */}
          {index === breadcrumb.length - 1 || item.name === "Mis Lotes" ? (
            // Si es el último o "Mis Lotes", solo mostramos el nombre sin hacerlo clickeable
            <span>{item.name}</span>
          ) : (
            // Si no es el último, mostramos un botón para navegar
            <button onClick={() => navigate(item.path)}>{item.name}</button>
          )}
          {index < breadcrumb.length - 1 && " > "}
        </span>
      ))}
    </div>
  );
};

export default Navegation;
