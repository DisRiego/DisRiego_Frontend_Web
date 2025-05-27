import { useState, useEffect, useRef } from "react";

const Filter_billing = ({
  onClose,
  filteredData,
  setFilteredData,
  setStatusFilter,
  filters,
  setFilters,
  backupData,
  hasPermission,
  isAdmin,
}) => {
  const [typeInterval, setTypeInterval] = useState([]);
  const [lots, setLots] = useState([]);
  const [status, setStatus] = useState([]);
  const startEmissionRef = useRef(null);
  const endEmissionRef = useRef(null);
  const startExpirationRef = useRef(null);
  const endExpirationRef = useRef(null);

  const handleStartEmissionFocus = () => {
    if (startEmissionRef.current) startEmissionRef.current.showPicker();
  };

  const handleEndEmissionFocus = () => {
    if (endEmissionRef.current) endEmissionRef.current.showPicker();
  };

  const handleStartExpirationFocus = () => {
    if (startExpirationRef.current) startExpirationRef.current.showPicker();
  };

  const handleEndExpirationFocus = () => {
    if (endExpirationRef.current) endExpirationRef.current.showPicker();
  };

  const [openSections, setOpenSections] = useState({
    lote: false,
    intervalo: false,
    fechaEmision: false,
    fechaVencimiento: false,
    estado: false,
  });

  const toggleSection = (name) => {
    setOpenSections((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  useEffect(() => {
    if (!backupData || !Array.isArray(backupData)) return;

    const uniqueInterval = [
      ...new Set(
        backupData.map((item) => item["Intervalo de pago"]).filter(Boolean)
      ),
    ].map((f, i) => ({ id: i + 1, nombre: f }));

    const uniqueLots = [
      ...new Set(
        backupData.map((item) => item["Nombre del lote"]).filter(Boolean)
      ),
    ].map((l, i) => ({ id: i + 1, nombre: l }));

    const uniqueStatuses = [
      ...new Set(backupData.map((item) => item.Estado).filter(Boolean)),
    ].map((estado, i) => ({ id: i + 1, nombre: estado }));

    setTypeInterval(uniqueInterval);
    setLots(uniqueLots);
    setStatus(uniqueStatuses);
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
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleClear = () => {
    setFilters({
      typeInterval: {},
      lot: {},
      startEmission: "",
      endEmission: "",
      startExpiration: "",
      endExpiration: "",
      status: {},
    });
    setFilteredData(backupData);
    setStatusFilter(true);
  };

  const applyFilters = () => {
    let filtered = [...backupData];

    const selectedIntervals = Object.keys(filters.typeInterval).filter(
      (k) => filters.typeInterval[k]
    );
    const selectedLots = Object.keys(filters.lot).filter((k) => filters.lot[k]);
    const selectedStatuses = Object.keys(filters.status).filter(
      (k) => filters.status[k]
    );

    if (selectedIntervals.length > 0) {
      filtered = filtered.filter((item) =>
        selectedIntervals.includes(item["Intervalo de pago"])
      );
    }

    if (!isAdmin && selectedLots.length > 0) {
      filtered = filtered.filter((item) =>
        selectedLots.includes(item["Nombre del lote"])
      );
    }

    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((item) =>
        selectedStatuses.includes(item.Estado)
      );
    }

    if (filters.startEmission) {
      filtered = filtered.filter(
        (item) =>
          new Date(item["Fecha de emisión"]) >= new Date(filters.startEmission)
      );
    }

    if (filters.endEmission) {
      filtered = filtered.filter(
        (item) =>
          new Date(item["Fecha de emisión"]) <= new Date(filters.endEmission)
      );
    }

    if (filters.startExpiration) {
      filtered = filtered.filter(
        (item) =>
          new Date(item["Fecha de vencimiento"]) >=
          new Date(filters.startExpiration)
      );
    }

    if (filters.endExpiration) {
      filtered = filtered.filter(
        (item) =>
          new Date(item["Fecha de vencimiento"]) <=
          new Date(filters.endExpiration)
      );
    }

    setFilteredData(filtered);
    setStatusFilter(true);
  };

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onClose}></div>
      <div className="view-filter">
        <h2 className="has-text-centered title is-4">Filtros</h2>

        <div className="view-filter-body mt-4">
          {!isAdmin && (
            <div className="accordion">
              <div
                className="accordion-header"
                onClick={() => toggleSection("lote")}
              >
                <p className="has-text-weight-bold">Lote</p>
                <span className="icon">{openSections.lote ? "−" : "+"}</span>
              </div>
              <div
                className={`accordion-body ${openSections.lote ? "open" : ""}`}
              >
                {lots.map((lot) => (
                  <div className="control" key={lot.id}>
                    <label className="checkbox">
                      <input
                        type="checkbox"
                        name={lot.nombre}
                        checked={filters.lot?.[lot.nombre] || false}
                        onChange={handleChangeCheckbox("lot")}
                      />{" "}
                      {lot.nombre}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="accordion">
            <div
              className="accordion-header"
              onClick={() => toggleSection("intervalo")}
            >
              <p className="has-text-weight-bold">Intervalo de pago</p>
              <span className="icon">{openSections.intervalo ? "−" : "+"}</span>
            </div>
            <div
              className={`accordion-body ${
                openSections.intervalo ? "open" : ""
              }`}
            >
              {typeInterval.map((tipo) => (
                <div className="control" key={tipo.id}>
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      name={tipo.nombre}
                      checked={filters.typeInterval?.[tipo.nombre] || false}
                      onChange={handleChangeCheckbox("typeInterval")}
                    />{" "}
                    {tipo.nombre}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="accordion">
            <div
              className="accordion-header"
              onClick={() => toggleSection("fechaEmision")}
            >
              <p className="has-text-weight-bold">Fecha de emisión</p>
              <span className="icon">
                {openSections.fechaEmision ? "−" : "+"}
              </span>
            </div>
            <div
              className={`accordion-body ${
                openSections.fechaEmision ? "open" : ""
              }`}
            >
              <div className="field">
                <label className="label">Desde</label>
                <input
                  ref={startEmissionRef}
                  type="date"
                  className="input"
                  name="startEmission"
                  value={filters.startEmission}
                  onChange={handleDateChange}
                  onFocus={handleStartEmissionFocus}
                />
              </div>
              <div className="field">
                <label className="label">Hasta</label>
                <input
                  ref={endEmissionRef}
                  type="date"
                  className="input"
                  name="endEmission"
                  value={filters.endEmission}
                  onChange={handleDateChange}
                  onFocus={handleEndEmissionFocus}
                />
              </div>
            </div>
          </div>

          <div className="accordion">
            <div
              className="accordion-header"
              onClick={() => toggleSection("fechaVencimiento")}
            >
              <p className="has-text-weight-bold">Fecha de vencimiento</p>
              <span className="icon">
                {openSections.fechaVencimiento ? "−" : "+"}
              </span>
            </div>
            <div
              className={`accordion-body ${
                openSections.fechaVencimiento ? "open" : ""
              }`}
            >
              <div className="field">
                <label className="label">Desde</label>
                <input
                  ref={startExpirationRef}
                  type="date"
                  className="input"
                  name="startExpiration"
                  value={filters.startExpiration}
                  onChange={handleDateChange}
                  onFocus={handleStartExpirationFocus}
                />
              </div>
              <div className="field">
                <label className="label">Hasta</label>
                <input
                  ref={endExpirationRef}
                  type="date"
                  className="input"
                  name="endExpiration"
                  value={filters.endExpiration}
                  onChange={handleDateChange}
                  onFocus={handleEndExpirationFocus}
                />
              </div>
            </div>
          </div>

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

export default Filter_billing;
