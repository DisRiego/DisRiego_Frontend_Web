import { useState } from "react";
import axios from "axios";

const Confirm_add_rol = ({
  confirMessage,
  onClose,
  method,
  formData,
  setShowMessage,
  setMessage,
  setStatus,
  onSuccess,
  updateData,
  uriPost,
}) => {
  const handleConfirm = async () => {
    try {
      const response = await axios({
        method: method,
        url: import.meta.env.VITE_URI_BACKEND + uriPost,
        data: formData,
      });
      setMessage("Se creo el rol");
      setStatus("is-true");
      setShowMessage(true);
      onClose();
      onSuccess();
      updateData();
    } catch (error) {
      setMessage(error.response.data.detail.data);
      setStatus("is-false");
      setShowMessage(true);
    }
  };

  return (
    <>
      <div className="modal is-active">
        <div className="modal-background"></div>
        <div className="modal-card p-5">
          <div className="modal-confirm modal-card-body">
            <p className="title has-text-centered is-5">
              ¿Está seguro de realizar la siguiente acción?
            </p>
            <p className="text-confirm has-text-centered mt-2">
              {confirMessage}
            </p>
            <div className="buttons is-centered mt-4">
              <div className="buttons">
                <button className="button is-danger" onClick={onClose}>
                  No, cancelar
                </button>
                <button className="button color-hover" onClick={handleConfirm}>
                  Sí, confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Confirm_add_rol;
