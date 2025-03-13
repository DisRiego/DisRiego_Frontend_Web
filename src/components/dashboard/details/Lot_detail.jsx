import React, { useState } from "react";
import { useParams } from "react-router-dom";

const metrics = [
  { title: "Consumo promedio de energía", value: "155 kWh", className: "warning" },
  { title: "Consumo actual de energía", value: "132 kWh", className: "danger" },
  { title: "Consumo promedio de agua", value: "245 m³", className: "info" },
  { title: "Consumo actual de agua", value: "265 m³", className: "primary" }
];

const attachments = [
  { name: "Escritura pública", file: "EscrituraPublica.pdf", size: "5.7MB" },
  { name: "Certificado de tradición y libertad (CTL)", file: "CTL.pdf", size: "5.7MB" }
];

const PropertyDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("consumo");
  const [tableTab, setTableTab] = useState("energia");
  
  const handleDownloadReport = () => {
    alert("Reporte descargado exitosamente.");
  };

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1>Lote vinculado #{id}</h1>
          <p>En esta sección podrá consultar los detalles del lote vinculado al predio. #{id}</p>
        </div>
        <div>
          <button className="btn success">Apertura de valvula</button>
          <button className="btn light" onClick={handleDownloadReport}>Descargar reporte</button>
        </div>
      </div>

      <div className="tabs-container">
        <p>Visualiza las gráficas</p>
        <div className="buttons">
          {["consumo", "produccion"].map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? "active" : ""}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="metrics">
        {metrics.map((metric, index) => (
          <div className="metric-box" key={index}>
            <p className="title">{metric.title}</p>
            <p className={`value ${metric.className}`}>{metric.value}</p>
          </div>
        ))}
      </div>

      <div className="details">
        <DetailsBox title="Detalle del predio vinculado" data={{ 
          "ID predio": "[ID predio]", 
          "NNombre del predio": "[NNombre del predio]", 
          "Folio de matricula inmobiliaria": "[Matricula inmobiliaria]", 
          "Extensión del predio": "[Extensión m²]",
          "Longitud": "[Longitud]", 
          "Latitud": "[Latitud]"
        }} />
        
        <DetailsBox title="Nombre del Lote" data={{ 
          "Folio de matricula inmobiliaria": "[Matricula inmobiliaria]", 
          "Extensión del predio": "[Extensión m²]",
          "Ubicacion del lote": "[Longitud, Latitud]", 
          "Tipo de cultivo": "[Tipo de cultivo]",
          "Fecha estimada de cosecha": "[Fecha estimada]",
          "intervalo de pago": "[Tipo de cultiivo]",
          "Ubicacion de caseta": "[Longitud, Latitud]" 

        }} />
      </div>

      <div className="attachments">
        <h2>Ver anexos del predio</h2>
        <div className="attachment-list">
          {attachments.map((attachment, index) => (
            <AnexoBox key={index} attachment={attachment} />
          ))}
        </div>
      </div>

      <div className="tabs">
        <ul>
        <li className={tableTab === "energia" ? "active" : ""}>
        {() => setTableTab("energia")}
        </li>
        {tableTab === "energia" && <EnergiaTable />}
        </ul>
      </div>
    </div>
  );
};

const DropdownButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="dropdown is-up">
      <button className="btn dropdown-toggle" onClick={() => setIsOpen(!isOpen)}>
        ...
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          <button className="dropdown-item">Ver</button>
          <button className="dropdown-item">Editar</button>
          <button className="dropdown-item">Inhabilitar</button>
        </div>
      )}
    </div>
  );
};
const EnergiaTable = () => (
  <div className="table-container">
    <table className="custom-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Tipo de dispositivo</th>
          <th>Modelo</th>
          <th>Fecha de instalación</th>
          <th>Fecha estimada de mantenimiento</th>
          <th>Estado</th>
          <th>Opciones</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>Sensor de flujo</td>
          <td>XG-200</td>
          <td>2024-01-15</td>
          <td>2025-01-15</td>
          <td>
          <span class="tag is-success is-light">
      <span class="dot dot-green"></span> Operativo
    </span>
          </td>
          <td><DropdownButton /></td>
        </tr>
        <tr>
          <td>1</td>
          <td>Sensor de flujo</td>
          <td>XG-200</td>
          <td>2024-01-15</td>
          <td>2025-01-15</td>
          <td>
          <span class="tag is-success is-light">
      <span class="dot dot-green"></span> Operativo
    </span>
          </td>
          <td><DropdownButton /></td>
        </tr>
        <tr>
          <td>1</td>
          <td>Sensor de flujo</td>
          <td>XG-200</td>
          <td>2024-01-15</td>
          <td>2025-01-15</td>
          <td>
          <span class="tag is-success is-light">
      <span class="dot dot-green"></span> Operativo
    </span>
          </td>
          <td><DropdownButton /></td>
        </tr>
        <tr>
          <td>1</td>
          <td>Sensor de flujo</td>
          <td>XG-200</td>
          <td>2024-01-15</td>
          <td>2025-01-15</td>
          <td><span class="tag is-success is-light">
      <span class=".dot-gray"></span> No Operativo
    </span>
          </td>
          <td><DropdownButton /></td>
        </tr>
      </tbody>
    </table>
  </div>
);

const DetailsBox = ({ title, data }) => (
  <div className="details-box">
    <h2>{title}</h2>
    <table>
      <tbody>
        {Object.entries(data).map(([key, value], index) => (
          <tr key={index}>
            <th>{key}</th>
            <td>{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const AnexoBox = ({ attachment }) => (
  <div className="anexo-box">
    <strong>{attachment.name}</strong>
    <p>{attachment.file} - {attachment.size}</p>
  </div>
);

export default PropertyDetail;
