import { useEffect, useState } from "react";
import axios from "axios";
import {
  validateDescriptionReject,
  validatePhone,
  validateText,
} from "../../../../hooks/useValidations";
import Confirm_modal from "../../reusable/Confirm_modal";

const Form_concept = ({
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
  token,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirMessage, setConfirMessage] = useState();
  const [method, setMethod] = useState();
  const [uriPost, setUriPost] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [typeForm, setTypeForm] = useState();

  const [formData, setFormData] = useState({});

  const feedbackMessages = {
    create: {
      successTitle: "Cultivo creado exitosamente",
      successMessage: "El cultivo ha sido creado correctamente.",
      errorTitle: "Error al crear el cultivo",
      errorMessage:
        "No se pudo crear el cultivo. Por favor, inténtelo de nuevo.",
    },
    edit: {
      successTitle: "Modificación exitosa",
      successMessage: "El cultivo ha sido modificado correctamente.",
      errorTitle: "Modificación fallida",
      errorMessage:
        "No se pudo modificar el cultivo. Por favor, inténtelo de nuevo.",
    },
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
                  <label className="label">Nombre</label>
                  <div className="control">
                    <input
                      className={`input`}
                      type="text"
                      name="name"
                      placeholder="Ingrese el nombre del concepto"
                      //   value={formData.name}
                      //   onChange={handleChange}
                      //   disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="container-input">
              <div className="columns">
                <div className="column">
                  <div className="field">
                    <label className="label">Descripción</label>
                    <div className="control">
                      <textarea
                        className={`textarea`}
                        name="description_failure"
                        placeholder="Ingrese la descripción del concepto"
                        //   value={formData.description_failure}
                        //   onChange={handleChange}
                        //   disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="container-input">
              <div className="columns">
                <div className="column">
                  <div className="field">
                    <label className="label">Valor</label>
                    <div className="control">
                      <input
                        className={`input`}
                        type="number"
                        name="description"
                        placeholder="Ingrese el valor"
                        //   value={formData.description_failure}
                        //   onChange={handleChange}
                        //   disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>
                <div className="column">
                  <div className="field">
                    <label className="label">Tipo</label>
                    <div className="control">
                      <div class="select ">
                        <select>
                          <option value="" disabled>
                            Seleccione una opción
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="container-input">
              <div className="columns">
                <div className="column">
                  <div className="field">
                    <label className="label">Alcance</label>
                    <div className="control">
                      <div class="select ">
                        <select>
                          <option value="" disabled>
                            Seleccione una opción
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <footer className="modal-card-foot is-flex is-justify-content-center">
            <div className="buttons">
              <button className="button" onClick={onClose}>
                Cancelar
              </button>
              <button className="button color-hover">Guardar</button>
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
          formData={formData}
          setShowMessage={setShowMessage}
          setTitleMessage={setTitleMessage}
          setMessage={setMessage}
          setStatus={setStatus}
          updateData={updateData}
          uriPost={uriPost}
          token={token}
          loading={loading}
          setLoading={setLoading}
          typeForm={typeForm}
          setTypeForm={setTypeForm}
          feedbackMessages={feedbackMessages}
        />
      )}
    </>
  );
};

export default Form_concept;
