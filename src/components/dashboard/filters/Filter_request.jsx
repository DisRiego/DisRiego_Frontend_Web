import { useState, useEffect } from "react";

const Filter_request = ({
  onClose,
  filteredData,
  setFilteredData,
  setStatusFilter,
  filters,
  setFilters,
  backupData,
}) => {
  const [status, setStatus] = useState([]);
  const [apertureTypes, setApertureTypes] = useState([]);

  useEffect(() => {
    if (!backupData || !Array.isArray(backupData)) return;

    // Obtener estados únicos
    const uniqueStatuses = [
      ...new Set(
        backupData.filter((item) => item.Estado).map((item) => item.Estado)
      ),
    ].map((estado, index) => ({
      id: index + 1,
      nombre: estado,
    }));

    setStatus(uniqueStatuses);

    // Obtener tipos de documento únicos
    const uniqueApertureTypes = [
      ...new Set(
        backupData
          .filter((item) => item["Tipo de solicitud"])
          .map((item) => item["Tipo de solicitud"])
      ),
    ].map((tipo, index) => ({
      id: index + 1,
      nombre: tipo,
    }));

    setApertureTypes(uniqueApertureTypes);
  }, [backupData]);

  console.log(apertureTypes);

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

  const handleApertureTypeChange = (event) => {
    const { name, checked } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      tiposApertura: {
        ...prevFilters.tiposApertura,
        [name]: checked,
      },
    }));
  };

  const handleClear = () => {
    setFilters({ estados: {}, roles: {}, tiposApertura: {} });
    setFilteredData(backupData);
    setStatusFilter(true);
  };

  const applyFilters = () => {
    const selectedStates = Object.keys(filters.estados || {}).filter(
      (estado) => filters.estados[estado]
    );

    const selectedApertureTypes = Object.keys(
      filters.tiposApertura || {}
    ).filter((tipo) => filters.tiposApertura[tipo]);

    let filtered = [...backupData];

    if (selectedApertureTypes.length > 0 || selectedStates.length > 0) {
      filtered = filtered.filter(
        (item) =>
          (selectedApertureTypes.length === 0 ||
            selectedApertureTypes.includes(item["Tipo de solicitud"])) &&
          (selectedStates.length === 0 || selectedStates.includes(item.Estado))
      );
    }

    setFilteredData(filtered);
  };

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onClose}></div>
      <div className="view-filter">
        <h2 className="has-text-centered title is-4">Filtros</h2>

        <div className="view-filter-body">
          {/* Tipos de solicitud */}
          <div className="field mt-5">
            <label className="label">Tipo de solicitud</label>
            <div className="container-status">
              {apertureTypes.map((tipo) => (
                <div className="control" key={tipo.id}>
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      name={tipo.nombre}
                      checked={filters.tiposApertura?.[tipo.nombre] || false}
                      onChange={handleApertureTypeChange}
                    />{" "}
                    {tipo.nombre}
                  </label>
                </div>
              ))}
            </div>
          </div>

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
                      checked={filters.estados?.[estado.nombre] || false}
                      onChange={handleStatusChange}
                    />{" "}
                    {estado.nombre}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

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

export default Filter_request;
