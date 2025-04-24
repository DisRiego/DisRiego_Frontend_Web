import { useEffect, useRef, useState } from "react";
import axios from "axios";

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
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [dataReport, setDataReport] = useState([]);
  const [dataTechnician, setDataTechnician] = useState([]);
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

  useEffect(() => {
    getReportByID();
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
      console.log(sortedData);
      setDataReport(sortedData);
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
      console.log(sortedData);
      setDataTechnician(sortedData);
      setIsLoading(false);
    } catch (error) {}
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSaveClick = () => {
    setSubmitted(true);
    console.log(formData);
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
                      value={dataReport?.property_id}
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
                      value={dataReport?.lot_id}
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
                            {technician.name}
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
                          ? errors.open_date
                            ? "is-false"
                            : "is-true"
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
                            : "is-true"
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
    </>
  );
};

export default Form_assign_maintenance;
