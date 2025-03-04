import { useState, useEffect } from "react";

const Filter_user = ({ onClose }) => {
  const [permissions, setPermissions] = useState([]);
  const [status, setStatus] = useState([]);
  const [filters, setFilters] = useState({ permisos: {}, estados: {} });
  const [openCategories, setOpenCategories] = useState({});

  console.log(filters);

  useEffect(() => {
    const loadedPermissions = [
      { id: 1, nombre: "Crear usuario", categoria: "usuario" },
      { id: 2, nombre: "Crear rol", categoria: "rol" },
      { id: 3, nombre: "Crear predio", categoria: "predio" },
      { id: 4, nombre: "Editar usuario", categoria: "usuario" },
      { id: 5, nombre: "Inhabilitar usuario", categoria: "usuario" },
      { id: 6, nombre: "Descargar reporte de usuario", categoria: "usuario" },
      { id: 7, nombre: "Ver detalles de un usuario", categoria: "usuario" },
      { id: 8, nombre: "Editar rol", categoria: "rol" },
      { id: 9, nombre: "Editar predio", categoria: "predio" },
    ];

    const loadedStatus = [
      { id: 1, nombre: "Activo" },
      { id: 2, nombre: "Inactivo" },
    ];

    setPermissions(loadedPermissions);
    setStatus(loadedStatus);
  }, []);

  const handlePermissionChange = (event) => {
    const { name, checked } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      permisos: {
        ...prevFilters.permisos,
        [name]: checked,
      },
    }));
  };

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
    setFilters({ permisos: {}, estados: {} });
  };

  // Función para alternar categorías abiertas
  const toggleCategory = (categoria) => {
    setOpenCategories((prev) => ({
      ...prev,
      [categoria]: !prev[categoria],
    }));
  };

  // Agrupar permisos por categoría
  const groupedPermissions = permissions.reduce((acc, permiso) => {
    const categoria =
      permiso.categoria.charAt(0).toUpperCase() +
      permiso.categoria.slice(1).toLowerCase();

    if (!acc[categoria]) {
      acc[categoria] = [];
    }
    acc[categoria].push(permiso);
    return acc;
  }, {});
  return (
    <>
      <div className="modal is-active">
        <div className="modal-background" onClick={onClose}></div>
        <div className="view-filter">
          <h2 className="has-text-centered title is-4">Filtros</h2>

          {/* Contenedor de Filtros */}
          <div className="view-filter-body">
            {/* Tipo de documento */}
            <div className="field mt-5">
              <label className="label">Tipo de documento</label>
              <div className="container-status">
                {status.map((estado) => (
                  <div className="control" key={estado.id}>
                    <label className="checkbox">
                      <input
                        type="checkbox"
                        name={estado.id}
                        checked={filters.estados[estado.id] || false}
                        onChange={handleStatusChange}
                      />{" "}
                      {estado.nombre}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="field mt-5">
              <label className="label">Genero</label>
              <div className="container-status">
                {status.map((estado) => (
                  <div className="control" key={estado.id}>
                    <label className="checkbox">
                      <input
                        type="checkbox"
                        name={estado.id}
                        checked={filters.estados[estado.id] || false}
                        onChange={handleStatusChange}
                      />{" "}
                      {estado.nombre}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="field mt-5">
              <label className="label">Rol</label>
              <div className="container-status">
                {status.map((estado) => (
                  <div className="control" key={estado.id}>
                    <label className="checkbox">
                      <input
                        type="checkbox"
                        name={estado.id}
                        checked={filters.estados[estado.id] || false}
                        onChange={handleStatusChange}
                      />{" "}
                      {estado.nombre}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Estados */}
            <div className="field mt-5">
              <label className="label">Estado</label>
              <div className="container-status">
                {status.map((estado) => (
                  <div className="control" key={estado.id}>
                    <label className="checkbox">
                      <input
                        type="checkbox"
                        name={estado.id}
                        checked={filters.estados[estado.id] || false}
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
            <button className="button is-fullwidth color-hover">Aplicar</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Filter_user;
