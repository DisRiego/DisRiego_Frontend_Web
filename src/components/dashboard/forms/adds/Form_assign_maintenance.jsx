import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  validateDate,
  validatePhone,
  validateTime,
} from "../../../../hooks/useValidations";
import Confirm_modal from "../../reusable/Confirm_modal";

const Form_assign_maintenance = ({
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
  typeAction,
  parentComponent,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [newData, setNewData] = useState();
  const [dataReport, setDataReport] = useState([]);
  const [dataTechnician, setDataTechnician] = useState([]);
  const [nameTechnician, setNameTechnician] = useState([]);
  const [disabled, setDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [submittedProperty, setSubmittedProperty] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [confirMessage, setConfirMessage] = useState();
  const [method, setMethod] = useState();
  const [uriPost, setUriPost] = useState("");
  const [typeForm, setTypeForm] = useState("");
  const dateInputRef = useRef(null);
  const hourRef = useRef(null);

  const handleDateFocus = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker();
    }
  };

  const handleHourFocus = () => {
    if (hourRef.current) {
      hourRef.current.showPicker();
    }
  };

  const [formData, setFormData] = useState({
    user_id: "",
    assignment_date: "",
    assignment_hour: "",
  });

  const [errors, setErrors] = useState({
    user_id: "",
    assignment_date: "",
    assignment_hour: "",
  });

  const feedbackMessages = {
    create_report: {
      successTitle: "Asignación exitosa",
      successMessage:
        "La asignación del técnico ha sido realizada correctamente.",
      errorTitle: "Error al asignar el ténico",
      errorMessage:
        "No se pudo asignar el técnico. Por favor, inténtelo de nuevo.",
    },
    edit_report: {
      successTitle: "Asignación actualizada exitosamente",
      successMessage: "La asignación ha sido modificada correctamente.",
      errorTitle: "Error al actualizar la asignación",
      errorMessage:
        "No se pudo editar la asignación. Por favor, inténtelo de nuevo.",
    },
  };

  useEffect(() => {
    if (parentComponent === "report") {
      getReportByID();
    } else {
      if (parentComponent === "system") {
        getSystemByID();
      }
    }

    getTechnician();
  }, []);

  const getReportByID = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND_MAINTENANCE +
          import.meta.env.VITE_ROUTE_BACKEND_REPORT +
          id +
          import.meta.env.VITE_ROUTE_BACKEND_REPORT_DETAIL
      );
      const sortedData = response.data.data;
      if (typeAction == "edit") {
        setDataReport(sortedData);
        setFormData({
          user_id: sortedData?.technician_id,
          assignment_date: sortedData?.assignment_date?.slice(0, 10),
          assignment_hour: sortedData?.assignment_date?.slice(11, 16),
        });
      } else {
        setDataReport(sortedData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getSystemByID = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND_MAINTENANCE +
          import.meta.env.VITE_ROUTE_BACKEND_SYSTEM_FAULT +
          id +
          import.meta.env.VITE_ROUTE_BACKEND_SYSTEM_DETAIL
      );
      const sortedData = response.data.data;
      if (typeAction == "edit") {
        setDataReport(sortedData);
        setFormData({
          user_id: sortedData?.technician_id,
          assignment_date: sortedData?.assignment_date?.slice(0, 10),
          assignment_hour: sortedData?.assignment_date?.slice(11, 16),
        });
      } else {
        setDataReport(sortedData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getTechnician = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND_MAINTENANCE +
          import.meta.env.VITE_ROUTE_BACKEND_GET_TECHNICIAN
      );
      const sortedData = response.data.data.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setDataTechnician(sortedData);
      setIsLoading(false);
    } catch (error) {}
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "user_id") {
      // Buscar el objeto completo por el ID seleccionado
      const selectedType = dataTechnician.find(
        (technician) => String(technician.id) === value
      );

      // Actualizar el nombre también si se encontró
      if (selectedType) {
        setNameTechnician(selectedType.name);
      }
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSaveClick = () => {
    setSubmitted(true);

    const isTechnicianValid = validatePhone(formData.user_id);
    const isDateValid = validateDate(formData.assignment_date);
    const isHourValid = validateTime(formData.assignment_hour);

    setErrors({
      user_id: isTechnicianValid ? "" : "Debe seleccionar una opción",
      assignment_date: isDateValid ? "" : "Fecha inválida",
      assignment_hour: isHourValid ? "" : "Hora inválida",
    });

    if (isTechnicianValid && isDateValid && isHourValid) {
      const dateLocal = new Date(
        `${formData.assignment_date}T${formData.assignment_hour}:00`
      );

      const timestamp = toLocalISOString(dateLocal);

      const dataToSend = {
        user_id: formData.user_id,
        assignment_date: timestamp,
      };
      setNewData(dataToSend);

      if (typeAction == "edit") {
        setMethod("put");
        if (parentComponent === "report") {
          setConfirMessage(
            `¿Desea editar la asignación del reporte con ID "${id}"?`
          );
          setUriPost(
            import.meta.env.VITE_URI_BACKEND_MAINTENANCE +
              import.meta.env.VITE_ROUTE_BACKEND_REPORT +
              id +
              import.meta.env.VITE_ROUTE_BACKEND_REPORT_ASSIGN_TECHNICIAN
          );
        } else {
          setConfirMessage(
            `¿Desea editar la asignación del fallo con ID "${id}"?`
          );
          if (parentComponent === "system") {
            setUriPost(
              import.meta.env.VITE_URI_BACKEND_MAINTENANCE +
                import.meta.env.VITE_ROUTE_BACKEND_SYSTEM_FAULT +
                id +
                import.meta.env.VITE_ROUTE_BACKEND_SYSTEM_ASSIGN_TECHNICIAN
            );
          }
        }

        setTypeForm("edit_report");
        setShowConfirm(true);
      } else {
        setMethod("post");
        if (parentComponent === "report") {
          setConfirMessage(
            `¿Desea asignar al técnico "${toTitleCase(
              nameTechnician
            )}" para el reporte con ID "${id}"?`
          );

          setUriPost(
            import.meta.env.VITE_URI_BACKEND_MAINTENANCE +
              import.meta.env.VITE_ROUTE_BACKEND_REPORT +
              id +
              import.meta.env.VITE_ROUTE_BACKEND_REPORT_ASSIGN_TECHNICIAN
          );
        } else {
          if (parentComponent === "system") {
            setConfirMessage(
              `¿Desea asignar al técnico "${toTitleCase(
                nameTechnician
              )}" para el fallo con ID "${id}"?`
            );

            setUriPost(
              import.meta.env.VITE_URI_BACKEND_MAINTENANCE +
                import.meta.env.VITE_ROUTE_BACKEND_SYSTEM_FAULT +
                id +
                import.meta.env.VITE_ROUTE_BACKEND_SYSTEM_ASSIGN_TECHNICIAN
            );
          }
        }
        setTypeForm("create_report");
        setShowConfirm(true);
      }
    }
  };

  function toLocalISOString(date) {
    const pad = (n) => String(n).padStart(2, "0");

    return (
      date.getFullYear() +
      "-" +
      pad(date.getMonth() + 1) +
      "-" +
      pad(date.getDate()) +
      "T" +
      pad(date.getHours()) +
      ":" +
      pad(date.getMinutes()) +
      ":" +
      pad(date.getSeconds())
    );
  }

  const toTitleCase = (str) => {
    if (typeof str !== "string") return str;
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

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
            <div className="columns">
              <div className="column">
                <div className="field">
                  <label className="label">Predio afectado</label>
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      disabled
                      value={dataReport?.property_name}
                    />
                  </div>
                </div>
              </div>
              <div className="column">
                <div className="field">
                  <label className="label">Lote afectado</label>
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      disabled
                      value={dataReport?.lot_name}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="columns">
              <div className="column">
                <div className="field">
                  <label className="label">Técnico encargado</label>
                  <div className="control">
                    <div
                      className={`select ${
                        submitted && errors.user_id ? "is-false" : ""
                      }`}
                    >
                      <select
                        name="user_id"
                        value={formData.user_id}
                        onChange={handleChange}
                        disabled={isLoading}
                      >
                        <option value="" disabled>
                          Seleccione una opción
                        </option>
                        {dataTechnician.map((technician) => (
                          <option key={technician.id} value={technician.id}>
                            {toTitleCase(technician.name)}
                          </option>
                        ))}
                      </select>
                    </div>
                    {submitted && errors.user_id && (
                      <p className="input-error">{errors.user_id}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="columns">
              <div className="column">
                <div className="field">
                  <label className="label">Fecha de revisión</label>
                  <div className="control">
                    <input
                      ref={dateInputRef}
                      className={`input ${
                        submitted
                          ? errors.assignment_date
                            ? "is-false"
                            : ""
                          : ""
                      }`}
                      type="date"
                      name="assignment_date"
                      placeholder="Ingrese la fecha de revisión"
                      value={formData.assignment_date}
                      onChange={handleChange}
                      onFocus={handleDateFocus}
                      disabled={isLoading}
                    />
                  </div>
                  {submitted && errors.assignment_date && (
                    <p className="input-error">{errors.assignment_date}</p>
                  )}
                </div>
              </div>
              <div className="column">
                <div className="field">
                  <label className="label">Hora de revisión</label>
                  <div className="control">
                    <input
                      ref={hourRef}
                      className={`input ${
                        submitted
                          ? errors.assignment_hour
                            ? "is-false"
                            : ""
                          : ""
                      }`}
                      type="time"
                      name="assignment_hour"
                      placeholder="Ingrese la hora de apertura"
                      value={formData.assignment_hour}
                      onChange={handleChange}
                      onFocus={handleHourFocus}
                      // disabled={isLoading}
                    />
                  </div>
                  {submitted && errors.assignment_hour && (
                    <p className="input-error">{errors.assignment_hour}</p>
                  )}
                </div>
              </div>
            </div>
          </section>
          <footer className="modal-card-foot is-flex is-justify-content-center">
            <div className="buttons">
              <button className="button" onClick={onClose}>
                Cancelar
              </button>
              <button
                className="button is-primary button-login"
                onClick={handleSaveClick}
              >
                Guardar
              </button>
            </div>
          </footer>
        </div>
      </div>
      {showConfirm && (
        <Confirm_modal
          onClose={() => {
            setShowConfirm(false);
          }}
          onSuccess={onClose}
          confirMessage={confirMessage}
          method={method}
          formData={newData}
          setShowMessage={setShowMessage}
          setTitleMessage={setTitleMessage}
          setMessage={setMessage}
          setStatus={setStatus}
          uriPost={uriPost}
          typeForm={typeForm}
          loading={loading}
          setLoading={setLoading}
          updateData={updateData}
          feedbackMessages={feedbackMessages}
        />
      )}
    </>
  );
};

export default Form_assign_maintenance;
