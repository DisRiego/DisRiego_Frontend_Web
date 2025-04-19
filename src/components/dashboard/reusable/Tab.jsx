import { Link, useLocation } from "react-router-dom";

const Tab = ({ tabs = [], activeTab, setActiveTab, useLinks = false }) => {
  const location = useLocation();

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
                <Link to={tab.path}>{tab.label}</Link>
              ) : (
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
