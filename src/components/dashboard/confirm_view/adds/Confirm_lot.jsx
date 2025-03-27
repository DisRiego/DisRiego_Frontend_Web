import { useState } from "react";
import axios from "axios";

const Confirm_lot = ({
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
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response);
      if (typeForm === "create_lot") {
        setTitleMessage("Lote creado exitosamente");
        setMessage("El lote se ha creado correctamente.");
        setStatus("is-true");
        setShowMessage(true);
        onClose();
        onSuccess();
        updateData();
      } else {
        if (typeForm === "edit_lot" || typeForm === "edit_user") {
          setTitleMessage("Lote actualizado exitosamente");
          setMessage("El lote ha sido actualizado correctamente.");
          setStatus("is-true");
          setShowMessage(true);
          onClose();
          onSuccess();
          updateData();
        }
      }
    } catch (error) {
      console.log(error);
      if (typeForm === "create_lot") {
        setTitleMessage("Error al crear el lote");
        setMessage("No se pudo crear el lote. Por favor, inténtelo de nuevo.");
        setStatus("is-false");
        setShowMessage(true);
      } else {
        if (typeForm === "edit_lot" || typeForm === "edit_user") {
          setTitleMessage("Error al actualizar el lote");
          setMessage(
            "No se pudo actualizar el lote. Por favor, inténtelo de nuevo."
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

export default Confirm_lot;
