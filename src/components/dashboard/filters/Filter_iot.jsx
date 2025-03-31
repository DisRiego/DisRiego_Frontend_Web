import { useState, useEffect } from "react";

const Filter_iot = ({
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
  const [deviceTypes, setDeviceTypes] = useState([]);

  console.log(filters);

  useEffect(() => {
    const uniqueStatuses = [
      ...new Set(backupData.map((item) => item.Estado)),
    ].map((estado, index) => ({
      id: index + 1,
      nombre: estado,
    }));
    setStatus(uniqueStatuses);

    const uniqueTypes = [
      ...new Set(backupData.map((item) => item["Tipo de dispositivo"])),
    ].map((tipo, index) => ({
      id: index + 1,
      nombre: tipo,
    }));
    setDeviceTypes(uniqueTypes);
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

  const handleTypeChange = (event) => {
    const { name, checked } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      type_devices: {
        ...prevFilters.type_devices,
        [name]: checked,
      },
    }));
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      installation_date: {
        ...prevFilters.installation_date,
        [name]: value,
      },
    }));
  };

  const handleClear = () => {
    setFilters({
      estados: {},
      type_devices: {},
      installation_date: {
        from: "",
        to: "",
      },
    });
    setFilteredData(filteredData);
    setStatusFilter(true);
  };

  const applyFilters = () => {
    const selectedStates = Object.keys(filters.estados).filter(
      (estado) => filters.estados[estado]
    );
    const selectedTypes = Object.keys(filters.type_devices).filter(
      (tipo) => filters.type_devices[tipo]
    );
    const fromDate = filters.installation_date?.from;
    const toDate = filters.installation_date?.to;

    let filtered = backupData;

    if (selectedStates.length > 0) {
      filtered = filtered.filter((item) =>
        selectedStates.includes(item.Estado)
      );
    }

    if (selectedTypes.length > 0) {
      filtered = filtered.filter((item) =>
        selectedTypes.includes(item["Tipo de dispositivo"])
      );
    }

    if (fromDate) {
      filtered = filtered.filter(
        (item) => item["Fecha de instalación"] >= fromDate
      );
    }

    if (toDate) {
      filtered = filtered.filter(
        (item) => item["Fecha de instalación"] <= toDate
      );
    }

    setFilteredData(filtered);
  };

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onClose}></div>
      <div className="view-filter">
        <h2 className="has-text-centered title is-4">Filtros</h2>

        {/* Contenedor de Filtros */}
        <div className="view-filter-body">
          {/* Tipos de dispositivos */}
          <div className="field mt-5">
            <label className="label">Tipo de dispositivos</label>
            <div className="container-status height-device">
              {deviceTypes.map((tipo) => (
                <div className="control" key={tipo.id}>
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      name={tipo.nombre}
                      checked={filters.type_devices[tipo.nombre] || false}
                      onChange={handleTypeChange}
                    />{" "}
                    {tipo.nombre}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Fecha de instalación */}
          <div className="field mt-5">
            <label className="label">Fecha de instalación</label>
            <div className="container-status p-0">
              <div className="field">
                <label className="label">Desde</label>
                <div className="control">
                  <input
                    className="input"
                    type="date"
                    name="from"
                    value={filters.installation_date?.from || ""}
                    onChange={handleDateChange}
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Hasta</label>
                <div className="control">
                  <input
                    className="input"
                    type="date"
                    name="to"
                    value={filters.installation_date?.to || ""}
                    onChange={handleDateChange}
                  />
                </div>
              </div>
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

export default Filter_iot;
