import { useState } from "react";
import axios from "axios";

const Disable_status_rol = ({
  onClose,
  onSuccess,
  idRow,
  confirMessage,
  setShowMessage,
  setTitleMessage,
  setMessage,
  setStatus,
  updateData,
}) => {
  const formData = {
    rol_id: idRow,
    new_status: 2,
  };

  const handleConfirm = async () => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_URI_BACKEND +
          import.meta.env.VITE_ROUTE_BACKEND_ROL_DISABLE,
        formData
      );
      console.log(response);
      setTitleMessage("Inhabilitación exitosa");
      setMessage("Se ha inhabilitado el rol correctamente.");
      setStatus("is-true");
      setShowMessage(true);
      onClose();
      onSuccess();
      updateData();
    } catch (error) {
      console.log(error);
      setTitleMessage("Inhabilitación fallida");
      setMessage(
        "No se pudo inhabilitar el rol. Por favor, inténtelo de nuevo."
      );
      setStatus("is-false");
      setShowMessage(true);
    }
  };

  return (
    <>
      <div className="modal is-active">
        <div className="modal-background" onClick={onClose}></div>
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

export default Disable_status_rol;
