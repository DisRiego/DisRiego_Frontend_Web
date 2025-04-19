import React, { useState } from "react";
import axios from "axios";

const Confirm_modal = ({
  confirMessage,
  onClose,
  method,
  uriPost,
  formData,
  token,
  loading,
  setLoading,
  typeForm,
  feedbackMessages,

  setTitleMessage,
  setMessage,
  setStatus,
  setShowMessage,

  onSuccess,
  updateData,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading("is-loading");
      setIsProcessing(true);

      // Determinar los headers según el tipo de formulario
      let headers = {};
      if (typeForm?.includes("multipart")) {
        headers["Content-Type"] = "multipart/form-data";
      }
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await axios({
        method,
        url: uriPost,
        data: formData,
        headers,
      });

      const successMsg = feedbackMessages?.[typeForm]?.successTitle || "Éxito";
      const successText =
        feedbackMessages?.[typeForm]?.successMessage ||
        "Acción realizada correctamente.";

      setTitleMessage?.(successMsg);
      setMessage?.(successText);
      setStatus?.("is-true");
      setShowMessage?.(true);

      onClose();
      onSuccess?.();
      updateData?.();
    } catch (error) {
      console.error(error);

      const errorMsg = feedbackMessages?.[typeForm]?.errorTitle || "Error";
      const errorText =
        feedbackMessages?.[typeForm]?.errorMessage ||
        "Ocurrió un error inesperado.";

      setTitleMessage?.(errorMsg);
      setMessage?.(errorText);
      setStatus?.("is-false");
      setShowMessage?.(true);
    } finally {
      setLoading("");
      setIsProcessing(false);
    }
  };

  return (
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
            {confirMessage.split("\n").map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}
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
  );
};

export default Confirm_modal;
