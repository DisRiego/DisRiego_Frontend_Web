import { Link, useLocation } from "react-router-dom";

/**
  Componente Tab:
  Muestra una lista de pestañas (tabs) que pueden usarse mediante navegación de enlaces o para ejecutar funciones.

  @param {Array} tabs - Lista de pestañas. Cada una debe tener: { key, label, path, onClick }.
  @param {string} activeTab - Clave del tab que está activo.
  @param {Function} setActiveTab - Función para cambiar el tab activo.
  @param {boolean} useLinks - Si es true, usa navegación mediante enlaces. Si es false, se ejecutan funciones.
*/
const Tab = ({ tabs = [], activeTab, setActiveTab, useLinks = false }) => {
  const location = useLocation(); // Guarda la ruta actual del navegador

  return (
    <div className="tabs is-boxed mb-5">
      <ul className="mt-0">
        {tabs.map((tab) => {
          const isActive = useLinks
            ? location.pathname === tab.path
            : activeTab === tab.key;

          return (
            <li key={tab.key} className={isActive ? "is-active" : ""}>
              {useLinks ? (
                /**
                  Si se utiliza navegación mediante enlaces, muestra un <Link> para cambiar de ruta.
                */
                <Link to={tab.path}>{tab.label}</Link>
              ) : (
                /**
                  Si no se utiliza navegación mediante enlaces, 
                  cambia el tab para que se ejecuten funciones al hacer clic.
                */
                <a
                  onClick={() => {
                    setActiveTab(tab.key);
                    if (tab.onClick) tab.onClick();
                  }}
                >
                  {tab.label}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Tab;
