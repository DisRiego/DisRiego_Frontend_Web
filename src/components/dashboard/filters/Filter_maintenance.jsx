import { useState, useEffect, useRef } from "react";

const Filter_maintenance = ({
  onClose,
  filteredData,
  setFilteredData,
  setStatusFilter,
  filters,
  setFilters,
  backupData,
  hasPermission,
  isTechnician,
}) => {
  const [typeFailure, setTypeFailure] = useState([]);
  const [nameTechnician, setNameTechnician] = useState([]);
  const [status, setStatus] = useState([]);
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  const handleStartDateFocus = () => {
    if (startDateRef.current) {
      startDateRef.current.showPicker();
    }
  };

  const handleEndOpenFocus = () => {
    if (endDateRef.current) {
      endDateRef.current.showPicker();
    }
  };

  const [openSections, setOpenSections] = useState({
    fallo: false,
    tecnico: false,
    fecha: false,
    estado: false,
  });

  const toggleSection = (name) => {
    setOpenSections((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  useEffect(() => {
    if (!backupData || !Array.isArray(backupData)) return;

    const uniqueFailures = [
      ...new Set(
        hasPermission("Ver detalles de un reporte de fallo")
          ? backupData
              .map((item) => item["Tipo de fallo"])
              .filter((value) => value)
          : backupData
              .map((item) => item["Posible fallo"])
              .filter((value) => value)
      ),
    ].map((f, i) => ({ id: i + 1, nombre: f }));

    const uniqueTechnicians = [
      ...new Set(
        backupData
          .map((item) => item["Técnico responsable"])
          .filter((value) => value)
      ),
    ].map((t, i) => ({ id: i + 1, nombre: t }));

    const uniqueStatuses = [
      ...new Set(backupData.map((item) => item.Estado).filter(Boolean)),
    ].map((estado, i) => ({ id: i + 1, nombre: estado }));

    setTypeFailure(uniqueFailures);
    setNameTechnician(uniqueTechnicians);
    setStatus(uniqueStatuses);

    setOpenSections({
      fallo: hasActiveFilters(filters.typeFailure),
      tecnico: hasActiveFilters(filters.nameTechnician),
      fecha:
        hasActiveFilters(filters.startDate) ||
        hasActiveFilters(filters.endDate),
      estado: hasActiveFilters(filters.status),
    });
  }, [backupData]);

  const handleChangeCheckbox = (field) => (e) => {
    const { name, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [name]: checked,
      },
    }));
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClear = () => {
    setFilters({
      typeFailure: {},
      nameTechnician: {},
      startDate: "",
      endDate: "",
      status: {},
    });
    setFilteredData(backupData);
    setStatusFilter(true);
  };

  const applyFilters = () => {
    let filtered = [...backupData];

    const selectedFailures = Object.keys(filters.typeFailure).filter(
      (k) => filters.typeFailure[k]
    );
    const selectedTechnicians = Object.keys(filters.nameTechnician).filter(
      (k) => filters.nameTechnician[k]
    );
    const selectedStatuses = Object.keys(filters.status).filter(
      (k) => filters.status[k]
    );

    if (selectedFailures.length > 0) {
      filtered = filtered.filter((item) =>
        selectedFailures.includes(item["Tipo de fallo"])
      );
    }

    if (selectedTechnicians.length > 0) {
      filtered = filtered.filter((item) =>
        selectedTechnicians.includes(item["Técnico responsable"])
      );
    }

    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((item) =>
        selectedStatuses.includes(item.Estado)
      );
    }

    if (filters.startDate) {
      filtered = filtered.filter(
        (item) =>
          new Date(item["Fecha de generación del reporte"]) >=
          new Date(filters.startDate)
      );
    }

    if (filters.endDate) {
      filtered = filtered.filter(
        (item) =>
          new Date(item["Fecha de generación del reporte"]) <=
          new Date(filters.endDate)
      );
    }

    setFilteredData(filtered);
    setStatusFilter(true);
  };

  const hasActiveFilters = (obj) =>
    obj && typeof obj === "object" ? Object.values(obj).some((v) => v) : !!obj;

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onClose}></div>
      <div className="view-filter">
        <h2 className="has-text-centered title is-4">Filtros</h2>

        <div className="view-filter-body">
          <div className="accordion mt-4">
            <div
              className="accordion-header"
              onClick={() => toggleSection("fallo")}
            >
              <p className="has-text-weight-bold">
                {hasPermission("Ver detalles de un reporte de fallo")
                  ? "Tipo de fallo"
                  : "Posible fallo"}
              </p>
              <span className="icon">{openSections.fallo ? "−" : "+"}</span>
            </div>
            <div
              className={`accordion-body ${openSections.fallo ? "open" : ""}`}
            >
              {typeFailure.map((tipo) => (
                <div className="control" key={tipo.id}>
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      name={tipo.nombre}
                      checked={filters.typeFailure?.[tipo.nombre] || false}
                      onChange={handleChangeCheckbox("typeFailure")}
                    />{" "}
                    {tipo.nombre}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Técnico responsable */}
          {hasPermission("Ver detalles de un reporte de fallo") &&
            isTechnician === false && (
              <div className="accordion">
                <div
                  className="accordion-header"
                  onClick={() => toggleSection("tecnico")}
                >
                  <p className="has-text-weight-bold">Técnico responsable</p>
                  <span className="icon">
                    {openSections.tecnico ? "−" : "+"}
                  </span>
                </div>
                <div
                  className={`accordion-body ${
                    openSections.tecnico ? "open" : ""
                  }`}
                >
                  {nameTechnician.map((tech) => (
                    <div className="control" key={tech.id}>
                      <label className="checkbox">
                        <input
                          type="checkbox"
                          name={tech.nombre}
                          checked={
                            filters.nameTechnician?.[tech.nombre] || false
                          }
                          onChange={handleChangeCheckbox("nameTechnician")}
                        />{" "}
                        {tech.nombre}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Fecha de generación */}
          <div className="accordion">
            <div
              className="accordion-header"
              onClick={() => toggleSection("fecha")}
            >
              <p className="has-text-weight-bold">Fecha de generación</p>
              <span className="icon">{openSections.fecha ? "−" : "+"}</span>
            </div>
            <div
              className={`accordion-body ${openSections.fecha ? "open" : ""}`}
            >
              <div className="field">
                <label className="label">Desde</label>
                <input
                  ref={startDateRef}
                  type="date"
                  className="input"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleDateChange}
                  onFocus={handleStartDateFocus}
                />
              </div>
              <div className="field">
                <label className="label">Hasta</label>
                <input
                  ref={endDateRef}
                  type="date"
                  className="input"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleDateChange}
                  onFocus={handleEndOpenFocus}
                />
              </div>
            </div>
          </div>

          {/* Estado */}
          <div className="accordion">
            <div
              className="accordion-header"
              onClick={() => toggleSection("estado")}
            >
              <p className="has-text-weight-bold">Estado</p>
              <span className="icon">{openSections.estado ? "−" : "+"}</span>
            </div>
            <div
              className={`accordion-body ${openSections.estado ? "open" : ""}`}
            >
              {status.map((estado) => (
                <div className="control" key={estado.id}>
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      name={estado.nombre}
                      checked={filters.status?.[estado.nombre] || false}
                      onChange={handleChangeCheckbox("status")}
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

export default Filter_maintenance;
