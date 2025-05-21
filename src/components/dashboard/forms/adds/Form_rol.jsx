import { useState, useEffect } from "react";
import axios from "axios";
import Confirm_modal from "../../reusable/Confirm_modal";
import {
  validateText,
  validateDescriptionReject,
} from "../../../../hooks/useValidations";
import { IoMdWarning } from "react-icons/io";

const Form_add_rol = ({
  title,
  onClose,
  setShowMessage,
  setTitleMessage,
  setMessage,
  setStatus,
  updateData,
  id,
  loading,
  setLoading,
}) => {
  const [data, setData] = useState();
  const [showConfirm, setShowConfirm] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const [openCategories, setOpenCategories] = useState({});
  const [filters, setFilters] = useState({ permisos: {} });
  const [confirMessage, setConfirMessage] = useState();
  const [method, setMethod] = useState();
  const [uriPost, setUriPost] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [typeForm, setTypeForm] = useState("");

  const feedbackMessages = {
    create: {
      successTitle: "Rol creado exitosamente",
      successMessage: "El rol ha sido creado correctamente.",
      errorTitle: "Error al crear el rol",
      errorMessage: "No se pudo crear el rol. Por favor, inténtelo de nuevo.",
    },
    edit: {
      successTitle: "Rol actualizado exitosamente",
      successMessage: "El rol ha sido actualizado correctamente.",
      errorTitle: "Error al actualizar el rol",
      errorMessage:
        "No se pudo actualizar el rol. Por favor, inténtelo de nuevo.",
    },
  };

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
    fetchPermissions();

    if (id != null) {
      fetchRol();
    }
  }, [id]);

  const fetchPermissions = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND +
          import.meta.env.VITE_ROUTE_BACKEND_ROL_PERMISSIONS
      );
      setPermissions(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error al obtener los permisos:", error);
    }
  };

  const fetchRol = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND + "/roles/" + id
      );

      if (response.data.success && response.data.data.length > 0) {
        const rolData = response.data.data[0];

        setData(rolData);

        setFormData({
          name: rolData.name || "",
          description: rolData.description || "",
          permissions: rolData.permissions?.map((p) => p.id) || [],
        });

        setFilters((prevFilters) => ({
          ...prevFilters,
          permisos: rolData.permissions.reduce((acc, permiso) => {
            acc[permiso.id] = true;
            return acc;
          }, {}),
        }));
      } else {
        console.error("El rol no fue encontrado");
      }
    } catch (error) {
      console.log("Error al obtener el rol", error);
    }
  };

  const handleSaveClick = () => {
    setSubmitted(true);
    const isNameValid = validateText(formData.name);
    const isDescriptionValid = validateDescriptionReject(formData.description);
    const hasSelectedPermissions = formData.permissions.length > 0;

    setErrors({
      name: isNameValid ? "" : "false" && "Nombre inválido",
      description: isDescriptionValid ? "" : "false" && "Descripción inválida",
      permissions: hasSelectedPermissions
        ? ""
        : "Debe seleccionar al menos un permiso",
    });

    if (isNameValid && isDescriptionValid && hasSelectedPermissions) {
      if (id != null) {
        setConfirMessage('¿Desea editar el rol "' + formData.name + '"?');
        setMethod("post");
        setUriPost(
          import.meta.env.VITE_URI_BACKEND +
            import.meta.env.VITE_ROUTE_BACKEND_ROL +
            id +
            import.meta.env.VITE_ROUTE_BACKEND_ROL_EDIT
        );
        setTypeForm("edit");
        setShowConfirm(true);
      } else {
        setConfirMessage('¿Desea crear el rol "' + formData.name + '"?');
        setMethod("post");
        setUriPost(
          import.meta.env.VITE_URI_BACKEND +
            import.meta.env.VITE_ROUTE_BACKEND_ROL
        );
        setTypeForm("create");
        setShowConfirm(true);
      }
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

  // Ordenar las categorías alfabéticamente
  const sortedCategories = Object.keys(groupedPermissions).sort((a, b) =>
    a.localeCompare(b)
  );

  // Ordenar permisos dentro de cada categoría
  Object.keys(groupedPermissions).forEach((categoria) => {
    groupedPermissions[categoria].sort((a, b) => a.name.localeCompare(b.name));
  });

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
                    submitted ? (errors.name ? "is-false" : "is-true") : ""
                  }`}
                  type="text"
                  name="name"
                  placeholder="Nombre del rol"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
              {submitted && errors.name && (
                <p className="input-error">{errors.name}</p>
              )}
            </div>
            <div className="field">
              <label className="label">Descripción</label>
              <div className="control">
                <textarea
                  className={`textarea ${
                    submitted
                      ? errors.description
                        ? "is-false"
                        : "is-true"
                      : ""
                  }`}
                  name="description"
                  placeholder="Descripción del rol"
                  value={formData.description}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
              {submitted && errors.description && (
                <p className="input-error">{errors.description}</p>
              )}
            </div>
            <div className="field">
              <label className="label">Lista de permisos</label>
              {sortedCategories.map((categoria) => (
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
                          {permiso.name}
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
        <Confirm_modal
          onClose={() => setShowConfirm(false)}
          onSuccess={onClose}
          confirMessage={confirMessage}
          method={method}
          formData={formData}
          setShowMessage={setShowMessage}
          setTitleMessage={setTitleMessage}
          setMessage={setMessage}
          setStatus={setStatus}
          updateData={updateData}
          uriPost={uriPost}
          typeForm={typeForm}
          loading={loading}
          setLoading={setLoading}
          feedbackMessages={feedbackMessages}
        />
      )}
    </>
  );
};

export default Form_add_rol;
