import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Confirm_update_info = ({
  onClose,
  onSuccess,
  confirMessage,
  method,
  formData,
  setShowMessage,
  setTitleMessage,
  setMessage,
  setStatus,
  uriPost,
  loading,
  setLoading,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

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

      // setTitleMessage("Modificación exitosa");
      // setMessage("El rol se ha modificado correctamente.");
      // setStatus("is-true");
      // setShowMessage(true);
      // onClose();
      // onSuccess();
      navigate("/dashboard/profile");
    } catch (error) {
      setTitleMessage("Error al actualizar");
      setMessage(
        "Ocurrió un error al guardar la información. Por favor, inténtelo de nuevo."
      );
      setStatus("is-false");
      setShowMessage(true);
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

export default Confirm_update_info;
