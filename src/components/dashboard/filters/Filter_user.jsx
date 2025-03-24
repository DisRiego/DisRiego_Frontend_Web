import { useState, useEffect } from "react";

const Filter_user = ({
  onClose,
  filteredData,
  setFilteredData,
  setStatusFilter,
  filters,
  setFilters,
  backupData,
}) => {
  const [status, setStatus] = useState([]);
  const [roles, setRoles] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]); // Estado para tipos de documento

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

    // Obtener roles únicos
    const uniqueRoles = [
      ...new Set(
        backupData
          .filter((item) => item.Rol)
          .flatMap((item) => item.Rol.split(",").map((rol) => rol.trim()))
      ),
    ].map((rol, index) => ({
      id: index + 1,
      nombre: rol,
    }));

    setRoles(uniqueRoles);

    // Obtener tipos de documento únicos
    const uniqueDocumentTypes = [
      ...new Set(
        backupData
          .filter((item) => item["Tipo de documento"])
          .map((item) => item["Tipo de documento"])
      ),
    ].map((tipo, index) => ({
      id: index + 1,
      nombre: tipo,
    }));

    setDocumentTypes(uniqueDocumentTypes);
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

  const handleRoleChange = (event) => {
    const { name, checked } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      roles: {
        ...prevFilters.roles,
        [name]: checked,
      },
    }));
  };

  const handleDocumentTypeChange = (event) => {
    const { name, checked } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      tiposDocumento: {
        ...prevFilters.tiposDocumento,
        [name]: checked,
      },
    }));
  };

  const handleClear = () => {
    setFilters({ estados: {}, roles: {}, tiposDocumento: {} });
    setFilteredData(backupData);
    setStatusFilter(true);
  };

  const applyFilters = () => {
    const selectedStates = Object.keys(filters.estados).filter(
      (estado) => filters.estados[estado]
    );

    const selectedRoles = Object.keys(filters.roles).filter(
      (rol) => filters.roles[rol]
    );

    const selectedDocumentTypes = Object.keys(filters.tiposDocumento).filter(
      (tipo) => filters.tiposDocumento[tipo]
    );

    let filtered = [...backupData];

    if (
      selectedDocumentTypes.length > 0 ||
      selectedStates.length > 0 ||
      selectedRoles.length > 0
    ) {
      filtered = filtered.filter(
        (item) =>
          (selectedDocumentTypes.length === 0 ||
            selectedDocumentTypes.includes(item["Tipo de documento"])) &&
          (selectedStates.length === 0 ||
            selectedStates.includes(item.Estado)) &&
          (selectedRoles.length === 0 ||
            selectedRoles.some((rol) =>
              item.Rol
                ? item.Rol.split(",")
                    .map((r) => r.trim())
                    .includes(rol)
                : false
            ))
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
          {/* Tipos de documento */}
          <div className="field mt-5">
            <label className="label">Tipo de documento</label>
            <div className="container-status">
              {documentTypes.map((tipo) => (
                <div className="control" key={tipo.id}>
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      name={tipo.nombre}
                      checked={filters.tiposDocumento?.[tipo.nombre] || false}
                      onChange={handleDocumentTypeChange}
                    />{" "}
                    {tipo.nombre}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Roles */}
          <div className="field mt-5">
            <label className="label">Lista de roles</label>
            <div className="container-status">
              {roles.map((rol) => (
                <div className="control" key={rol.id}>
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      name={rol.nombre}
                      checked={filters.roles?.[rol.nombre] || false}
                      onChange={handleRoleChange}
                    />{" "}
                    {rol.nombre}
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

export default Filter_user;
