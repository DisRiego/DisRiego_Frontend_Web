import React, { useState } from "react";
import { validateEmail, validatePhone } from "../../../../hooks/useValidations";
import Confirm_modal from "../../reusable/Confirm_modal";

const Form_edit_company_contact = ({
  title,
  onClose,
  data,
  setShowMessage,
  setTitleMessage,
  setMessage,
  setStatus,
  loading,
  setLoading,
  updateData,
}) => {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirMessage, setConfirMessage] = useState();
  const [method, setMethod] = useState();
  const [uriPost, setUriPost] = useState("");
  const [typeForm, setTypeForm] = useState("");
  const [newData, setNewData] = useState(null);

  const feedbackMessages = {
    update_contact: {
      successTitle: "Actualización exitosa",
      successMessage:
        "La información de contacto ha sido actualizada correctamente.",
      errorTitle: "Error al actualizar",
      errorMessage: `No se pudo actualizar la información de contacto.
        \n Por favor, inténtelo de nuevo.`,
    },
  };

  const [formData, setFormData] = useState({
    email: data?.email || "",
    phone: data?.phone || "",
  });

  const [errors, setErrors] = useState({
    email: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    setHasSubmitted(true);
    const isEmailValid = validateEmail(formData.email);
    const isPhoneValid = validatePhone(formData.phone);

    setErrors({
      email: isEmailValid ? "" : "false" && "Correo electrónico inválido",
      phone: isPhoneValid ? "" : "false" && "Número de celular inválido",
    });

    if (isEmailValid && isPhoneValid) {
      const formDataToSend = new FormData();
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);

      setNewData(formDataToSend);

      setConfirMessage(
        '¿Desea actualizar la información de contacto de "' + data.name + '"?'
      );
      setMethod("patch");
      setUriPost(
        import.meta.env.VITE_URI_BACKEND +
          import.meta.env.VITE_ROUTE_BACKEND_COMPANY_EDIT_CONTACT
      );
      setTypeForm("update_contact");
      setShowConfirm(true);
    }
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
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label className="label">Correo</label>
                <div className="control">
                  <input
                    type="email"
                    className={`input ${
                      hasSubmitted ? (errors.email ? "is-false" : "") : ""
                    }`}
                    name="email"
                    placeholder="Ingrese el nuevo correo electrónico de la empresa"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                {errors.email && <p className="input-error">{errors.email}</p>}
              </div>

              <div className="field">
                <label className="label">Telefono</label>
                <div className="control">
                  <input
                    type="number"
                    className={`input ${
                      hasSubmitted ? (errors.phone ? "is-false" : "") : ""
                    }`}
                    name="phone"
                    placeholder="Ingresa el nuevo número de la empresa"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                {errors.phone && <p className="input-error">{errors.phone}</p>}
              </div>
            </form>
          </section>
          <footer className="modal-card-foot is-flex is-justify-content-center">
            <div className="buttons">
              <button className="button" onClick={onClose}>
                Cancelar
              </button>
              <button className="button color-hover" onClick={handleSubmit}>
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

export default Form_edit_company_contact;
