import { useState, useEffect, useRef } from "react";

const Filter_consumption = ({
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
  const [properties, setProperties] = useState([]);
  const [lots, setLots] = useState([]);

  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  const [openSections, setOpenSections] = useState({
    property: false,
    lot: false,
    interval: false,
    date: false,
    consumption: false,
  });

  const toggleSection = (name) => {
    setOpenSections((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  useEffect(() => {
    if (!backupData || !Array.isArray(backupData)) return;

    const uniqueIntervals = [
      ...new Set(
        backupData.map((item) => item["Intervalo de pago"]).filter(Boolean)
      ),
    ].map((f, i) => ({ id: i + 1, name: f }));

    const uniqueProperties = [
      ...new Set(
        backupData.map((item) => item["Nombre del predio"]).filter(Boolean)
      ),
    ].map((p, i) => ({ id: i + 1, name: p }));

    const uniqueLots = [
      ...new Set(
        backupData.map((item) => item["Nombre del lote"]).filter(Boolean)
      ),
    ].map((l, i) => ({ id: i + 1, name: l }));

    setTypeInterval(uniqueIntervals);
    setProperties(uniqueProperties);
    setLots(uniqueLots);
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
      property: {},
      lot: {},
      startDate: "",
      endDate: "",
      consumptionMin: "",
      consumptionMax: "",
    });
    setFilteredData(backupData);
    setStatusFilter(true);
  };

  const applyFilters = () => {
    let filtered = [...backupData];

    const selectedIntervals = Object.keys(filters.typeInterval).filter(
      (k) => filters.typeInterval[k]
    );
    const selectedProperties = Object.keys(filters.property || {}).filter(
      (k) => filters.property[k]
    );
    const selectedLots = Object.keys(filters.lot || {}).filter(
      (k) => filters.lot[k]
    );

    if (selectedIntervals.length > 0) {
      filtered = filtered.filter((item) =>
        selectedIntervals.includes(item["Intervalo de pago"])
      );
    }

    if (!isAdmin && selectedProperties.length > 0) {
      filtered = filtered.filter((item) =>
        selectedProperties.includes(item["Nombre del predio"])
      );
    }

    if (!isAdmin && selectedLots.length > 0) {
      filtered = filtered.filter((item) =>
        selectedLots.includes(item["Nombre del lote"])
      );
    }

    if (filters.startDate) {
      filtered = filtered.filter(
        (item) =>
          new Date(item["Fecha de lectura"]) >= new Date(filters.startDate)
      );
    }

    if (filters.endDate) {
      filtered = filtered.filter(
        (item) =>
          new Date(item["Fecha de lectura"]) <= new Date(filters.endDate)
      );
    }

    if (filters.consumptionMin) {
      filtered = filtered.filter(
        (item) =>
          parseFloat(item["Consumo registrado (m³)"]) >=
          parseFloat(filters.consumptionMin)
      );
    }

    if (filters.consumptionMax) {
      filtered = filtered.filter(
        (item) =>
          parseFloat(item["Consumo registrado (m³)"]) <=
          parseFloat(filters.consumptionMax)
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
            <>
              <div className="accordion">
                <div
                  className="accordion-header"
                  onClick={() => toggleSection("property")}
                >
                  <p className="has-text-weight-bold">Predio</p>
                  <span className="icon">
                    {openSections.property ? "−" : "+"}
                  </span>
                </div>
                <div
                  className={`accordion-body ${
                    openSections.property ? "open" : ""
                  }`}
                >
                  {properties.map((property) => (
                    <div className="control" key={property.id}>
                      <label className="checkbox">
                        <input
                          type="checkbox"
                          name={property.name}
                          checked={filters.property?.[property.name] || false}
                          onChange={handleChangeCheckbox("property")}
                        />{" "}
                        {property.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {Object.values(filters.property || {}).some((v) => v) && (
                <div className="accordion">
                  <div
                    className="accordion-header"
                    onClick={() => toggleSection("lot")}
                  >
                    <p className="has-text-weight-bold">Lote</p>
                    <span className="icon">{openSections.lot ? "−" : "+"}</span>
                  </div>
                  <div
                    className={`accordion-body ${
                      openSections.lot ? "open" : ""
                    }`}
                  >
                    {lots.map((lot) => (
                      <div className="control" key={lot.id}>
                        <label className="checkbox">
                          <input
                            type="checkbox"
                            name={lot.name}
                            checked={filters.lot?.[lot.name] || false}
                            onChange={handleChangeCheckbox("lot")}
                          />{" "}
                          {lot.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          <div className="accordion">
            <div
              className="accordion-header"
              onClick={() => toggleSection("interval")}
            >
              <p className="has-text-weight-bold">Intervalo de pago</p>
              <span className="icon">{openSections.interval ? "−" : "+"}</span>
            </div>
            <div
              className={`accordion-body ${
                openSections.interval ? "open" : ""
              }`}
            >
              {typeInterval.map((tipo) => (
                <div className="control" key={tipo.id}>
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      name={tipo.name}
                      checked={filters.typeInterval?.[tipo.name] || false}
                      onChange={handleChangeCheckbox("typeInterval")}
                    />{" "}
                    {tipo.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="accordion">
            <div
              className="accordion-header"
              onClick={() => toggleSection("date")}
            >
              <p className="has-text-weight-bold">Fecha de lectura</p>
              <span className="icon">{openSections.date ? "−" : "+"}</span>
            </div>
            <div
              className={`accordion-body ${openSections.date ? "open" : ""}`}
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
                  onFocus={() => startDateRef.current?.showPicker()}
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
                  onFocus={() => endDateRef.current?.showPicker()}
                />
              </div>
            </div>
          </div>

          <div className="accordion">
            <div
              className="accordion-header"
              onClick={() => toggleSection("consumption")}
            >
              <p className="has-text-weight-bold">Consumo registrado (m³)</p>
              <span className="icon">
                {openSections.consumption ? "−" : "+"}
              </span>
            </div>
            <div
              className={`accordion-body accordion-columns ${
                openSections.consumption ? "open" : ""
              }`}
            >
              <div className="columns is-mobile">
                <div className="column">
                  <label className="label">Desde</label>
                  <input
                    type="number"
                    className="input"
                    name="consumptionMin"
                    value={filters.consumptionMin || ""}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        consumptionMin: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="column">
                  <label className="label">Hasta</label>
                  <input
                    type="number"
                    className="input"
                    name="consumptionMax"
                    value={filters.consumptionMax || ""}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        consumptionMax: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
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

export default Filter_consumption;
