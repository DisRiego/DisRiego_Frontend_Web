import React, { useState } from "react";
import "../../styles/index.css";


const ViewFilter = ({ title, onClose }) => {
  const [filters, setFilters] = useState({
    tipoDocumento: "",
    tipoPersona: "",
    genero: "",
    rol: "",
    estadoActivo: false,
    estadoInactivo: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleClear = () => {
    setFilters({
      tipoDocumento: "",
      tipoPersona: "",
      genero: "",
      rol: "",
      estadoActivo: false,
      estadoInactivo: false,
    });
  };

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onClose}></div>
      <div className="view-filter">
        <h2 className="view-filter-title">Filtros</h2>

        {/* Contenedor de Filtros */}
        <div className="view-filter-body">
          {/* Tipo de documento */}
          <div className="view-filter-field">
            <label className="view-filter-label">Tipo de documento</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select name="tipoDocumento" value={filters.tipoDocumento} onChange={handleChange}>
                  <option value="">Selecciona una opción</option>
                  <option value="CC">Cédula de Ciudadanía</option>
                  <option value="TI">Tarjeta de Identidad</option>
                  <option value="CE">Cédula de Extranjería</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tipo de persona */}
          <div className="view-filter-field">
            <label className="view-filter-label">Tipo de persona</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select name="tipoPersona" value={filters.tipoPersona} onChange={handleChange}>
                  <option value="">Selecciona una opción</option>
                  <option value="natural">Natural</option>
                  <option value="juridica">Jurídica</option>
                </select>
              </div>
            </div>
          </div>

          {/* Género */}
          <div className="view-filter-field">
            <label className="view-filter-label">Género</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select name="genero" value={filters.genero} onChange={handleChange}>
                  <option value="">Selecciona una opción</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
            </div>
          </div>

          {/* Rol */}
          <div className="view-filter-field">
            <label className="view-filter-label">Rol</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select name="rol" value={filters.rol} onChange={handleChange}>
                  <option value="">Selecciona el rol</option>
                  <option value="admin">Administrador</option>
                  <option value="usuario">Usuario</option>
                  <option value="editor">Editor</option>
                </select>
              </div>
            </div>
          </div>

          {/* Estado */}
          <div className="view-filter-field">
            <label className="view-filter-label">Estado</label>
            <div className="control">
              <label className="checkbox">
                <input type="checkbox" name="estadoActivo" checked={filters.estadoActivo} onChange={handleChange} /> Activo
              </label>
            </div>
            <div className="control">
              <label className="checkbox">
                <input type="checkbox" name="estadoInactivo" checked={filters.estadoInactivo} onChange={handleChange} /> Inactivo
              </label>
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="view-filter-buttons">
          <button className="button is-light" onClick={handleClear}>Limpiar</button>
          <button className="button is-success">Aplicar</button>
        </div>
      </div>
    </div>
  );
};

export default ViewFilter;
