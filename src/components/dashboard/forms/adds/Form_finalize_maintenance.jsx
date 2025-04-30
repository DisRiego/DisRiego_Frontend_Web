import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  validateDate,
  validateFile,
  validatePhone,
  validateDescriptionReject,
  validateImageEvidence,
} from "../../../../hooks/useValidations";
import Confirm_modal from "../../reusable/Confirm_modal";
import { FaUpload } from "react-icons/fa6";

const Form_finalize_maintenance = ({
  title,
  onClose,
  setShowMessage,
  setTitleMessage,
  setMessage,
  setStatus,
  updateData,
  id,
  idTechnician,
  statusName,
  loading,
  setLoading,
  typeAction,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [step, setStep] = useState(1);
  const [newData, setNewData] = useState();
  const [fileFailure, setFileFailure] = useState(null);
  const [fileFailureName, setFileFailureName] = useState("");
  const [fileSolution, setFileSolution] = useState(null);
  const [fileNameSolution, setFileNameSolution] = useState("");
  const [dataReport, setDataReport] = useState([]);
  const [assignmentID, setAssignmentID] = useState("");
  const [nameTechnician, setNameTechnician] = useState([]);
  const [typeFailure, setTypeFailure] = useState([]);
  const [typeMaintenance, setTypeMaintenance] = useState([]);
  const [typeSolution, setTypeSolution] = useState([]);
  const [disabled, setDisabled] = useState(true);
  const [disabledTypeSolution, setDisabledTypeSolution] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [confirMessage, setConfirMessage] = useState();
  const [method, setMethod] = useState();
  const [uriPost, setUriPost] = useState("");
  const [typeForm, setTypeForm] = useState("");
  const dateInputRef = useRef(null);
  const hourRef = useRef(null);

  const [formData, setFormData] = useState({
    detail_id: "",
    technician_assignment_id: "",
    type_failure_id: "",
    fault_remarks: "",
    type_maintenance_id: "",
    failure_solution_id: "",
    solution_remarks: "",
  });

  const [errors, setErrors] = useState({
    detail_id: "",
    technician_assignment_id: "",
    type_failure_id: "",
    fault_remarks: "",
    type_maintenance_id: "",
    failure_solution_id: "",
    solution_remarks: "",
  });

  const [errorFileFailure, setErrorFileFailure] = useState("");
  const [errorFileSolution, setErrorFileSolution] = useState("");

  const feedbackMessages = {
    create: {
      successTitle: "Finalización exitosa",
      successMessage: "La finalización ha sido realizada correctamente.",
      errorTitle: "Error al finalizar el mantenimiento",
      errorMessage:
        "No se pudo finalizar el mantenimiento. Por favor, inténtelo de nuevo.",
    },
    edit: {
      successTitle: "Mantenimiento actualizado exitosamente",
      successMessage: "El mantenimiento ha sido modificado correctamente.",
      errorTitle: "Error al actualizar el mantenimiento",
      errorMessage:
        "No se pudo editar el mantenimiento. Por favor, inténtelo de nuevo.",
    },
  };

  useEffect(() => {
    getReportByID();
    getFailureType();
    getmMaintenanceType();
  }, []);

  useEffect(() => {
    if (assignmentID) {
      setFormData((prev) => ({
        ...prev,
        technician_assignment_id: assignmentID,
      }));
    }
  }, [assignmentID]);

  useEffect(() => {
    if (formData.type_maintenance_id) {
      getSolutionType();
    }
  }, [formData.type_maintenance_id]);

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
          detail_id: sortedData.detail_id,
          type_failure_id: sortedData.type_failure_id,
          fault_remarks: sortedData.fault_remarks,
          type_maintenance_id: sortedData.type_maintenance_id,
          failure_solution_id: sortedData.failure_solution_id,
          solution_remarks: sortedData.solution_remarks,
        });
      } else {
        setDataReport(sortedData);
      }
      setAssignmentID(sortedData.technician_assignment_id);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(formData);

  const getFailureType = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND_MAINTENANCE +
          import.meta.env.VITE_ROUTE_BACKEND_FAILURE_TYPE
      );
      const sortedData = response.data.data.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      console.log(sortedData);
      setTypeFailure(sortedData);
    } catch (error) {
      console.error("Error al obtener los tipos de fallos:", error);
    }
  };

  const getmMaintenanceType = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND_MAINTENANCE +
          import.meta.env.VITE_ROUTE_BACKEND_GET_TYPE_MAINTENANCE
      );
      const sortedData = response.data.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setTypeMaintenance(sortedData);
    } catch (error) {
      console.error("Error al obtener los tipos de mantenimiento:", error);
    }
  };

  const getSolutionType = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_URI_BACKEND_MAINTENANCE +
          import.meta.env.VITE_ROUTE_BACKEND_GET_TYPE_SOLUTION +
          formData.type_maintenance_id
      );
      const sortedData = response.data.data.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setTypeSolution(sortedData);
      setDisabledTypeSolution(false);
    } catch (error) {
      console.error("Error al obtener los tipos de soluciones:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFailureChange = (event) => {
    const selectedFile = event.target.files[0];
    const validation = validateImageEvidence(selectedFile);

    if (!validation.isValid) {
      setFileFailure(null);
      setFileFailureName("");
      setErrorFileFailure(validation.error);
      return;
    }

    setFileFailure(selectedFile);
    setFileFailureName(selectedFile.name);
    setErrorFileFailure("");
  };

  const handleFileSolutionChange = (event) => {
    const selectedFile = event.target.files[0];
    const validation = validateImageEvidence(selectedFile);

    if (!validation.isValid) {
      setFileSolution(null);
      setFileNameSolution("");
      setErrorFileSolution(validation.error);
      return;
    }

    setFileSolution(selectedFile);
    setFileNameSolution(selectedFile.name);
    setErrorFileSolution("");
  };

  const handleValidateNext = () => {
    setSubmitted(true);
    const isEvidenceOptional = statusName === "Finalizado";

    const isTypeFailureValid = validatePhone(formData.type_failure_id);
    const isFailureRemarksValid = validateDescriptionReject(
      formData.fault_remarks
    );
    const isFileValid = !!fileFailure || isEvidenceOptional;

    setErrors({
      type_failure_id: isTypeFailureValid ? "" : "Debe seleccionar una opción",
      fault_remarks: isFailureRemarksValid ? "" : "Descripción inválida",
    });

    if (!isFileValid) {
      setErrorFileFailure("Debes seleccionar un archivo válido.");
    } else {
      setErrorFileFailure("");
    }

    if (isTypeFailureValid && isFailureRemarksValid && isFileValid) {
      nextStep();
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const isEvidenceOptional = statusName === "Finalizado";

    const isTypeMaintenanceValid = validatePhone(formData.type_maintenance_id);
    const isTypeSolutionValid = validatePhone(formData.failure_solution_id);
    const isSolutionRemarksValid = validateDescriptionReject(
      formData.solution_remarks
    );
    const isFileValid = !!fileSolution || isEvidenceOptional;

    setErrors({
      type_maintenance_id: isTypeMaintenanceValid
        ? ""
        : "Debe seleccionar una opción",
      failure_solution_id: isTypeSolutionValid
        ? ""
        : "Debe seleccionar una opción",
      solution_remarks: isSolutionRemarksValid ? "" : "Descripción inválida",
    });

    if (!isFileValid) {
      setErrorFileSolution("Debes seleccionar un archivo válido.");
    } else {
      setErrorFileSolution("");
    }

    if (
      isTypeMaintenanceValid & isTypeSolutionValid &&
      isSolutionRemarksValid &&
      isFileValid
    ) {
      const formArchive = new FormData();

      if (typeAction == "edit") {
        formArchive.append("type_failure_id", formData.type_failure_id);
        formArchive.append("fault_remarks", formData.fault_remarks);
        formArchive.append("type_maintenance_id", formData.type_maintenance_id);
        formArchive.append("failure_solution_id", formData.failure_solution_id);
        formArchive.append("solution_remarks", formData.solution_remarks);

        if (fileFailure) {
          formArchive.append("evidence_failure", fileFailure);
        }
        if (fileSolution) {
          formArchive.append("evidence_solution", fileSolution);
        }

        setNewData(formArchive);

        setConfirMessage(
          `¿Desea editar el mantenimiento del reporte con ID "${id}"?`
        );

        setMethod("put");
        setUriPost(
          import.meta.env.VITE_URI_BACKEND_MAINTENANCE +
            import.meta.env.VITE_ROUTE_BACKEND_FINALIZE_MAINTENANCE +
            formData.detail_id
        );
        setTypeForm("edit");
        setShowConfirm(true);
      } else {
        formArchive.append(
          "technician_assignment_id",
          formData.technician_assignment_id
        );
        formArchive.append("type_failure_id", formData.type_failure_id);
        formArchive.append("fault_remarks", formData.fault_remarks);
        formArchive.append("type_maintenance_id", formData.type_maintenance_id);
        formArchive.append("failure_solution_id", formData.failure_solution_id);
        formArchive.append("solution_remarks", formData.solution_remarks);

        if (fileFailure) {
          formArchive.append("evidence_failure", fileFailure);
        }
        if (fileSolution) {
          formArchive.append("evidence_solution", fileSolution);
        }

        setNewData(formArchive);

        setConfirMessage(
          `¿Desea finalizar el mantenimiento del reporte con ID "${id}"?`
        );

        setMethod("post");
        setUriPost(
          import.meta.env.VITE_URI_BACKEND_MAINTENANCE +
            import.meta.env.VITE_ROUTE_BACKEND_FINALIZE_MAINTENANCE
        );
        setTypeForm("create");
        setShowConfirm(true);
      }
    }
  };

  const nextStep = () => {
    if (step === 1) {
      setStep(step + 1);
    } else if (step === 2) {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
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
            <div className="bulma-steps">
              <ul className="steps is-horizontal has-content-centered mb-5">
                <li
                  className={`steps-segment ${step === 1 ? "is-active" : ""}`}
                >
                  <span className="steps-marker">1</span>
                  <div className="steps-content">
                    <strong>Detalles del fallo</strong>
                  </div>
                </li>
                <li
                  className={`steps-segment ${step === 2 ? "is-active" : ""}`}
                >
                  <span className="steps-marker">2</span>
                  <div className="steps-content">
                    <strong>Detalles de la solución</strong>
                  </div>
                </li>
              </ul>
            </div>
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
            {step === 1 && (
              <>
                <div className="columns">
                  <div className="column">
                    <div className="field">
                      <label className="label">Fallo detectado</label>
                      <div className="control">
                        <div
                          className={`select ${
                            submitted && errors.type_failure_id
                              ? "is-false"
                              : ""
                          }`}
                        >
                          <select
                            name="type_failure_id"
                            value={formData.type_failure_id}
                            onChange={handleChange}
                            // disabled={isLoading}
                          >
                            <option value="" disabled>
                              Seleccione una opción
                            </option>
                            {typeFailure.map((failure) => (
                              <option key={failure.id} value={failure.id}>
                                {failure.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        {submitted && errors.type_failure_id && (
                          <p className="input-error">
                            {errors.type_failure_id}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="columns">
                  <div className="column">
                    <div className="field">
                      <label className="label">Descripción del fallo</label>
                      <div className="control">
                        <textarea
                          className={`textarea ${
                            submitted
                              ? errors.fault_remarks
                                ? "is-false"
                                : ""
                              : ""
                          }`}
                          name="fault_remarks"
                          placeholder="Observaciones del fallo"
                          value={formData.fault_remarks}
                          onChange={handleChange}
                          //   disabled={isLoading}
                        />
                      </div>
                      {submitted && errors.fault_remarks && (
                        <p className="input-error">{errors.fault_remarks}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="columns">
                  <div className="column">
                    <div className="field">
                      <div className="label">Evidencia del fallo</div>
                      <div
                        className={`file has-name is-fullwidth ${
                          errorFileFailure ? "is-danger" : ""
                        }`}
                      >
                        <label className="file-label">
                          <input
                            className="file-input"
                            type="file"
                            accept="image/png, image/jpeg, image/jpg, image/gif"
                            onChange={handleFailureChange}
                          />
                          <span className="file-cta">
                            <span className="file-icon">
                              <FaUpload />
                            </span>
                            <span className="file-label">Subir archivo…</span>
                          </span>
                          <span className="file-name">
                            {fileFailureName || "Ningún archivo seleccionado"}
                          </span>
                        </label>
                      </div>
                      {errorFileFailure && (
                        <p className="has-text-danger is-6">
                          {errorFileFailure}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <div className="columns">
                  <div className="column">
                    <div className="field">
                      <label className="label">Tipo de mantenimiento</label>
                      <div className="control">
                        <div
                          className={`select ${
                            submitted && errors.type_maintenance_id
                              ? "is-false"
                              : ""
                          }`}
                        >
                          <select
                            name="type_maintenance_id"
                            value={formData.type_maintenance_id}
                            onChange={handleChange}
                            // disabled={isLoading}
                          >
                            <option value="" disabled>
                              Seleccione una opción
                            </option>
                            {typeMaintenance.map((type_maintenanc) => (
                              <option
                                key={type_maintenanc.id}
                                value={type_maintenanc.id}
                              >
                                {type_maintenanc.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        {submitted && errors.type_maintenance_id && (
                          <p className="input-error">
                            {errors.type_maintenance_id}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="column">
                    <div className="field">
                      <label className="label">Tipo de solución</label>
                      <div className="control">
                        <div
                          className={`select ${
                            submitted && errors.failure_solution_id
                              ? "is-false"
                              : ""
                          }`}
                        >
                          <select
                            name="failure_solution_id"
                            value={formData.failure_solution_id}
                            onChange={handleChange}
                            disabled={disabledTypeSolution}
                          >
                            <option value="" disabled>
                              Seleccione una opción
                            </option>
                            {typeSolution.map((type_solution) => (
                              <option
                                key={type_solution.id}
                                value={type_solution.id}
                              >
                                {type_solution.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        {submitted && errors.failure_solution_id && (
                          <p className="input-error">
                            {errors.failure_solution_id}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="columns">
                  <div className="column">
                    <div className="field">
                      <label className="label">
                        Descripción de la solución
                      </label>
                      <div className="control">
                        <textarea
                          className={`textarea ${
                            submitted
                              ? errors.solution_remarks
                                ? "is-false"
                                : ""
                              : ""
                          }`}
                          name="solution_remarks"
                          placeholder="Observaciones del fallo"
                          value={formData.solution_remarks}
                          onChange={handleChange}
                          //   disabled={isLoading}
                        />
                      </div>
                      {submitted && errors.solution_remarks && (
                        <p className="input-error">{errors.solution_remarks}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="columns">
                  <div className="column">
                    <div className="field">
                      <div className="label">Evidencia de la solución</div>
                      <div
                        className={`file has-name is-fullwidth ${
                          errorFileSolution ? "is-danger" : ""
                        }`}
                      >
                        <label className="file-label">
                          <input
                            className="file-input"
                            type="file"
                            accept="image/png, image/jpeg, image/jpg, image/gif"
                            onChange={handleFileSolutionChange}
                          />
                          <span className="file-cta">
                            <span className="file-icon">
                              <FaUpload />
                            </span>
                            <span className="file-label">Subir archivo…</span>
                          </span>
                          <span className="file-name">
                            {fileNameSolution || "Ningún archivo seleccionado"}
                          </span>
                        </label>
                      </div>
                      {errorFileSolution && (
                        <p className="has-text-danger is-6">
                          {errorFileSolution}
                        </p>
                      )}
                    </div>
                  </div>
                </div>{" "}
              </>
            )}
          </section>
          <footer className="modal-card-foot is-flex is-justify-content-center">
            <div className="buttons">
              {step === 1 ? (
                <>
                  <button className="button" onClick={onClose}>
                    Cancelar
                  </button>

                  <button
                    className="button is-primary button-login"
                    onClick={handleValidateNext}
                  >
                    Siguiente
                  </button>
                </>
              ) : (
                <>
                  <button className="button" onClick={prevStep}>
                    Regresar
                  </button>
                  <button
                    className="button is-primary button-login"
                    onClick={handleSubmit}
                  >
                    Guardar
                  </button>
                </>
              )}
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

export default Form_finalize_maintenance;
