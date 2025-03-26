import { useState } from "react";
import axios from "axios";

const Confirm_crop = ({
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
  console.log("Entro!!");

  const handleConfirm = async () => {
    try {
      setLoading("is-loading");
      setIsProcessing(true);
      const response = await axios({
        method: method,
        url: uriPost,
        data: formData,
      });
      if (typeForm === "create") {
        setTitleMessage("Cultivo creado exitosamente");
        setMessage("El cultivo ha sido creado correctamente.");
        setStatus("is-true");
        setShowMessage(true);
        onClose();
        onSuccess();
        updateData();
      } else {
        setTitleMessage("Modificación exitosa");
        setMessage("El cultivo se ha modificado correctamente.");
        setStatus("is-true");
        setShowMessage(true);
        onClose();
        onSuccess();
        updateData();
      }
    } catch (error) {
      if (typeForm === "create") {
        setTitleMessage("Error al crear el cultivo");
        setMessage(
          "No se pudo crear el cultivo. Por favor, inténtelo de nuevo."
        );
        setStatus("is-false");
        setShowMessage(true);
      } else {
        setTitleMessage("Modificación fallida");
        setMessage(
          "No se pudo modificar el cultivo. Por favor, inténtelo de nuevo."
        );
        setStatus("is-false");
        setShowMessage(true);
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

export default Confirm_crop;
