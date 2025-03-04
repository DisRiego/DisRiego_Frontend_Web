import { useState, useEffect } from "react";
import Confirm_add_rol from "../../confirm_view/adds/Confirm_add_rol";
import {
  validateText,
  validateTextArea,
} from "../../../../hooks/useValidations";

const Form_add_rol = ({ title, onClose }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const [openCategories, setOpenCategories] = useState({});
  const [filters, setFilters] = useState({ permisos: {} });
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    permisos: [{}],
  });
  const [errors, setErrors] = useState({ nombre: "", descripcion: "" });
  const [submitted, setSubmitted] = useState(false);

  console.log(formData);

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
    setPermissions(loadedPermissions);
  }, []);

  const handleSaveClick = () => {
    setSubmitted(true);
    const isNombreValid = validateText(formData.nombre);
    const isDescripcionValid = validateTextArea(formData.descripcion);

    setErrors({
      nombre: isNombreValid ? "" : "false",
      descripcion: isDescripcionValid ? "" : "false",
    });

    if (isNombreValid && isDescripcionValid) {
      setShowConfirm(true);
    }
  };

  const handleCancelConfirm = () => {
    setShowConfirm(false);
  };

  const handlePermissionChange = (event) => {
    const { name, checked } = event.target;

    setFilters((prevFilters) => {
      const updatedPermisos = { ...prevFilters.permisos, [name]: checked };

      const selectedPermissions = Object.keys(updatedPermisos)
        .filter((key) => updatedPermisos[key])
        .map((id) => Number(id));

      setFormData((prevFormData) => ({
        ...prevFormData,
        permisos: selectedPermissions,
      }));

      return { ...prevFilters, permisos: updatedPermisos };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const toggleCategory = (categoria) => {
    setOpenCategories((prev) => ({
      ...prev,
      [categoria]: !prev[categoria],
    }));
  };

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
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">{title}</p>
            <button
              className="delete"
              aria-label="close"
              onClick={onClose}
            ></button>
          </header>
          <section className="modal-card-body">
            <div className="field">
              <label className="label">Nombre</label>
              <div className="control">
                <input
                  className={`input ${
                    submitted && (errors.nombre ? "is-false" : "is-true")
                  }`}
                  type="text"
                  name="nombre"
                  placeholder="Nombre del rol"
                  value={formData.nombre}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Descripción</label>
              <div className="control">
                <textarea
                  className={`textarea ${
                    submitted && (errors.descripcion ? "is-false" : "is-true")
                  }`}
                  name="descripcion"
                  placeholder="Descripción del rol"
                  value={formData.descripcion}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Permisos</label>
              {Object.keys(groupedPermissions).map((categoria) => (
                <div key={categoria} className="accordion">
                  <div
                    className="accordion-header"
                    onClick={() => toggleCategory(categoria)}
                  >
                    <p className="has-text-weight-bold">{categoria}</p>
                    <span className="icon">
                      {openCategories[categoria] ? "−" : "+"}
                    </span>
                  </div>
                  <div
                    className={`accordion-body ${
                      openCategories[categoria] ? "open" : ""
                    }`}
                  >
                    {groupedPermissions[categoria].map((permiso) => (
                      <div className="control" key={permiso.id}>
                        <label className="checkbox">
                          <input
                            type="checkbox"
                            name={permiso.id}
                            checked={filters.permisos[permiso.id] || false}
                            onChange={handlePermissionChange}
                          />{" "}
                          {permiso.nombre}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
          <footer className="modal-card-foot is-flex is-justify-content-center">
            <div className="buttons">
              <button className="button" onClick={onClose}>
                Cancelar
              </button>
              <button className="button color-hover" onClick={handleSaveClick}>
                Guardar
              </button>
            </div>
          </footer>
        </div>
      </div>
      {showConfirm && (
        <Confirm_add_rol
          onCancel={handleCancelConfirm}
          selectedPermissions={filters.permisos}
        />
      )}
    </>
  );
};

export default Form_add_rol;
