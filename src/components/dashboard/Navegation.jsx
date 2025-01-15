import { useNavigate, useLocation } from "react-router-dom";
import Names_navegation from "./Names_navegation";

const Navegation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const pathSegments = location.pathname.split("/").filter(Boolean);

  if (
    pathSegments.length === 1 ||
    (pathSegments[0] === "dashboard" && pathSegments.length === 2)
  ) {
    return null;
  }

  const mainModule = pathSegments[1];
  const subModule = pathSegments[2];
  const breadcrumb = [];

  if (mainModule) {
    const mainModuleName = Names_navegation[mainModule]
      ? Names_navegation[mainModule][0]
      : mainModule;
    breadcrumb.push({ name: mainModuleName, path: `/dashboard/${mainModule}` });
  }

  if (subModule) {
    const subModuleName = Names_navegation[subModule]
      ? Names_navegation[subModule][0]
      : subModule;
    breadcrumb.push({
      name: subModuleName,
      path: `/dashboard/${mainModule}/${subModule}`,
    });
  }

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
