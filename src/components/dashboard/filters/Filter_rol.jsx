import { useState, useEffect } from "react";

const Filter_rol = ({
  onClose,
  data,
  filteredData,
  setFilteredData,
  setStatusFilter,
  filters,
  setFilters,
  backupData,
}) => {
  const [status, setStatus] = useState([]);

  useEffect(() => {
    const uniqueStatuses = [...new Set(backupData.map((item) => item.Estado))]
      .map((estado, index) => ({
        id: index + 1,
        nombre: estado,
      }))
      .sort((a, b) => a.nombre.localeCompare(b.nombre));

    setStatus(uniqueStatuses);
  }, [backupData]);

  const handleStatusChange = (event) => {
    const { name, checked } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      estados: {
        ...prevFilters.estados,
        [name]: checked,
      },
    }));
  };

  const handleClear = () => {
    setFilters({ estados: {} });
    setFilteredData(filteredData);
    setStatusFilter(true);
  };

  const applyFilters = () => {
    const selectedStates = Object.keys(filters.estados).filter(
      (estado) => filters.estados[estado]
    );

    if (selectedStates.length === 0) {
      setFilteredData(backupData);
      return;
    }

    const filtered = backupData.filter((item) =>
      selectedStates.includes(item.Estado)
    );

    setFilteredData(filtered);
  };

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onClose}></div>
      <div className="view-filter">
        <h2 className="has-text-centered title is-4">Filtros</h2>

        {/* Contenedor de Filtros */}
        <div className="view-filter-body">
          {/* Estados */}
          <div className="field mt-5">
            <label className="label">Lista de estados</label>
            <div className="container-status">
              {status.map((estado) => (
                <div className="control" key={estado.id}>
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      name={estado.nombre}
                      checked={filters.estados[estado.nombre] || false}
                      onChange={handleStatusChange}
                    />{" "}
                    {estado.nombre}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="view-filter-buttons">
          <button
            className="button is-fullwidth is-light mr-2"
            onClick={handleClear}
          >
            Limpiar
          </button>
          <button
            className="button is-fullwidth color-hover"
            onClick={applyFilters}
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filter_rol;
