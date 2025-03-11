import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "bulma/css/bulma.min.css";

const PropertyDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("consumo");

  return (
    <div className="container mt-5">
      {/* Encabezado */}
      <div className="is-flex is-justify-content-space-between is-align-items-center mb-4">
        <div>
          <h1 className="title">Detalles del predio #{id}</h1>
          <p className="subtitle">
            En esta sección podrás visualizar información detallada sobre el predio #{id}.
          </p>
        </div>
        <div>
          <button className="button is-success mr-2">Añadir lote</button>
          <button className="button is-light">Descargar reporte</button>
        </div>
      </div>

      {/* Botones de Consumo y Producción */}
      <div className="is-flex is-justify-content-space-between is-align-items-center mb-4">
        <div>
          <p className="title">Visualiza las gráficas</p>
        </div>
        <div className="buttons has-addons">
          <button
            className={`button ${activeTab === "consumo" ? "is-success" : ""}`}
            onClick={() => setActiveTab("consumo")}
          >
            Consumo
          </button>
          <button
            className={`button ${activeTab === "produccion" ? "is-success" : ""}`}
            onClick={() => setActiveTab("produccion")}
          >
            Producción
          </button>
        </div>
      </div>

      {/* Tarjetas de métricas */}
      <div className="columns">
        <div className="column">
          <div className="box has-text-centered">
            <p className="title is-5">Consumo promedio de energía</p>
            <p className="subtitle is-4 has-text-warning">155 kWh</p>
          </div>
        </div>
        <div className="column">
          <div className="box has-text-centered">
            <p className="title is-5">Consumo actual de energía</p>
            <p className="subtitle is-4 has-text-danger">132 kWh</p>
          </div>
        </div>
        <div className="column">
          <div className="box has-text-centered">
            <p className="title is-5">Consumo promedio de agua</p>
            <p className="subtitle is-4 has-text-info">245 m³</p>
          </div>
        </div>
        <div className="column">
          <div className="box has-text-centered">
            <p className="title is-5">Consumo actual de agua</p>
            <p className="subtitle is-4 has-text-primary">265 m³</p>
          </div>
        </div>
      </div>

      {/* Sección de detalles del usuario y Nombre del predio en la misma fila */}
      <div className="columns">
        <div className="column">
          <div className="box">
            <h2 className="title is-4">Detalles del usuario</h2>
            <table className="table is-fullwidth">
              <tbody>
                <tr>
                  <td><strong>Nombre del cliente</strong></td>
                  <td>[Nombre del cliente]</td>
                </tr>
                <tr>
                  <td><strong>Tipo de documento</strong></td>
                  <td>[Tipo de documento]</td>
                </tr>
                <tr>
                  <td><strong>Número de documento</strong></td>
                  <td>[Número de documento]</td>
                </tr>
                <tr>
                  <td><strong>Fecha de expedición</strong></td>
                  <td>[Fecha de expedición]</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="column">
          <div className="box">
            <h2 className="title is-4">Nombre del predio</h2>
            <table className="table is-fullwidth">
              <tbody>
                <tr>
                  <td><strong>Folio de matricula inmobiliaria</strong></td>
                  <td>[Matricula inmobiliaria]</td>
                </tr>
                <tr>
                  <td><strong>Extensión del predio</strong></td>
                  <td>[Extensión m2]</td>
                </tr>
                <tr>
                  <td><strong>Longitud</strong></td>
                  <td>[Longitud]</td>
                </tr>
                <tr>
                  <td><strong>Latitud</strong></td>
                  <td>[Latitud]</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* anexos del predio */}

      <div className="box">
  <h2 className="title is-5">Ver anexos del predio</h2>
  <div className="columns">
    {/* Escritura pública */}
    <div className="column">
      <div className="box">
        <strong>Escritura pública</strong>
        <div className="file is-boxed is-info">
          <span className="icon"><i className="fas fa-file-alt"></i></span>
          <span>EscrituraPublica.pdf</span>
          <span>· <a href="#">Preview</a></span>
          <span>5.7MB</span>
          <button className="delete"></button>
        </div>
      </div>
    </div>
    
    {/* Certificado de tradición y libertad */}
    <div className="column">
      <div className="box">
        <strong>Certificado de tradición y libertad (CTL)</strong>
        <div className="file is-boxed is-info">
          <span className="icon"><i className="fas fa-file-alt"></i></span>
          <span>CTL.pdf</span>
          <span>· <a href="#">Preview</a></span>
          <span>5.7MB</span>
          <button className="delete"></button>
        </div>
      </div>
    </div>
  </div>
</div>

      {/* Tabla de lotes vinculados */}
      <div className="box">
        <h2 className="title is-4">Lotes vinculados</h2>
        <table className="table is-fullwidth is-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre del lote</th>
              <th>Extensión (m²)</th>
              <th>Latitud</th>
              <th>Longitud</th>
              <th>Tipo de cultivo</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{id}</td>
              <td>[Nombre del lote]</td>
              <td>[Extensión]</td>
              <td>[Latitud]</td>
              <td>[Longitud]</td>
              <td>[Tipo de cultivo]</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PropertyDetail;
