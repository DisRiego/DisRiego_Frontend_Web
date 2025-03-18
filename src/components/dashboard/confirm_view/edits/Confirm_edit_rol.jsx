import { useState } from "react";
import axios from "axios";

const Confirm_edit_rol = ({
  confirMessage,
  onClose,
  method,
  formData,
  setShowMessage,
  setTitleMessage,
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
        url: uriPost,
        data: formData,
      });
      setTitleMessage("Modificación exitosa");
      setMessage("Se ha modificado el rol correctamente.");
      setStatus("is-true");
      setShowMessage(true);
      onClose();
      onSuccess();
      updateData();
    } catch (error) {
      setTitleMessage("Modificación fallida");
      setMessage("No se pudo modificar el rol. Por favor, inténtelo de nuevo.");
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

export default Confirm_edit_rol;
