import { useState, useEffect } from "react";
import Confirm_add_rol from "../../confirm_view/adds/Confirm_add_rol";
import {
  validateText,
  validateTextArea,
} from "../../../../hooks/useValidations";
import axios from "axios";
import { IoMdWarning } from "react-icons/io";

const Form_add_rol = ({
  title,
  onClose,
  setShowMessage,
  setMessage,
  setStatus,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const [openCategories, setOpenCategories] = useState({});
  const [filters, setFilters] = useState({ permisos: {} });
  const [confirMessage, setConfirMessage] = useState();
  const [method, setMethod] = useState();
  const [uriPost, setUriPost] = useState();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: [],
  });
  const [errors, setErrors] = useState({
    name: "",
    description: "",
    permissions: "",
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_URI_BACKEND + "/roles/permissions/"
        );
        setPermissions(response.data);
      } catch (error) {
        console.error("Error al obtener los permisos:", error);
      }
    };

    fetchPermissions();
  }, []);

  console.log(formData);

  const handleSaveClick = () => {
    setSubmitted(true);
    const isNameValid = validateText(formData.name);
    const isDescriptionValid = validateTextArea(formData.description);
    const hasSelectedPermissions = formData.permissions.length > 0;

    setErrors({
      name: isNameValid ? "" : "false",
      description: isDescriptionValid ? "" : "false",
      permissions: hasSelectedPermissions
        ? ""
        : "Debe seleccionar al menos un permiso",
    });

    if (isNameValid && isDescriptionValid && hasSelectedPermissions) {
      setConfirMessage('¿Desea crear el rol "' + formData.name + '"?');
      setMethod("post");
      setShowConfirm(true);
    }
  };

  const handlePermissionChange = (event) => {
    const { name, checked } = event.target;
    const permissionId = Number(name);

    setFilters((prevFilters) => {
      const updatedPermisos = {
        ...prevFilters.permisos,
        [permissionId]: checked,
      };

      const selectedPermissions = Object.keys(updatedPermisos)
        .filter((key) => updatedPermisos[key])
        .map(Number);

      setFormData((prevFormData) => ({
        ...prevFormData,
        permissions: selectedPermissions,
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
      permiso.category.charAt(0).toUpperCase() +
      permiso.category.slice(1).toLowerCase();

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
                    submitted && errors.name ? "is-false" : "is-true"
                  }`}
                  type="text"
                  name="name"
                  placeholder="Nombre del rol"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Descripción</label>
              <div className="control">
                <textarea
                  className={`textarea ${
                    submitted && errors.description ? "is-false" : "is-true"
                  }`}
                  name="description"
                  placeholder="Descripción del rol"
                  value={formData.description}
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
                          {permiso.description}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {submitted && errors.permissions && (
                <div className="is-flex is-flex-direction-row	is-justify-content-center is-align-items-center">
                  <IoMdWarning className="icon login-error mr-3" />
                  <p className="login-error is-6">{errors.permissions}</p>
                </div>
              )}
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
          onClose={() => {
            setShowConfirm(false);
          }}
          onSuccess={onClose}
          confirMessage={confirMessage}
          method={method}
          formData={formData}
          setShowMessage={setShowMessage}
          setMessage={setMessage}
          setStatus={setStatus}
        />
      )}
    </>
  );
};

export default Form_add_rol;
