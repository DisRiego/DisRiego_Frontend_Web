import { useState } from "react";
import axios from "axios";

const Confirm_notification = ({
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
  typeForm,
  loading,
  setLoading,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading("is-loading");
      setIsProcessing(true);
      const response = await axios({
        method: method,
        url: uriPost,
        data: formData,
      });
      if (typeForm === "read") {
        // setTitleMessage("Rol creado exitosamente");
        // setMessage("Se ha marcado como leída la notificación correctamente.");
        // setStatus("is-true");
        // setShowMessage(true);
        onClose();
        onSuccess();
        // updateData();
      } else {
        if (typeForm === "read_all") {
          setTitleMessage("Notificaciones marcadas como leídas exitosamente");
          setMessage(
            "Se han marcado como leídas todas las notificaciones correctamente."
          );
          setStatus("is-true");
          setShowMessage(true);
          onClose();
          onSuccess();
          updateData();
        }
      }
    } catch (error) {
      console.log(error);
      if (typeForm === "read") {
        setTitleMessage("Error al marcar como leída la notificación");
        setMessage(
          "No se pudo marcar como leída la notificació. Por favor, inténtelo de nuevo."
        );
        setStatus("is-false");
        setShowMessage(true);
      } else {
        if (typeForm === "read_all") {
          setTitleMessage("Error al marcar como leídas las notificaciones");
          setMessage(
            "No se pudo marcar como leídas las notificaciones. Por favor, inténtelo de nuevo."
          );
          setStatus("is-false");
          setShowMessage(true);
        }
      }
    } finally {
      setLoading("");
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="modal is-active">
        <div
          className="modal-background"
          onClick={!isProcessing ? onClose : undefined}
        ></div>
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
                <button
                  className="button is-danger"
                  onClick={!isProcessing ? onClose : undefined}
                >
                  No, cancelar
                </button>
                <button
                  className={"button is-primary color-hover " + loading}
                  onClick={handleConfirm}
                >
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

export default Confirm_notification;
