const Iot_tab = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="tabs is-boxed mb-5">
      <ul className="mt-0">
        {tabs.map((tab) => (
          <li
            key={tab.key}
            className={activeTab === tab.key ? "is-active" : ""}
          >
            <a
              onClick={() => {
                setActiveTab(tab.key);
                tab.onClick();
              }}
            >
              {tab.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Iot_tab;
