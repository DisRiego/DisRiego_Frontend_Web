import React, { useState } from "react";
import axios from "axios";

const Confirm_aperture = ({
  confirMessage,
  onClose,
  method,
  formData,
  setShowMessage,
  setTitleMessage,
  setMessage,
  setStatus,
  onSuccess,
  uriPost,
  typeForm,
  loading,
  setLoading,
  updateData,
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
      if (typeForm === "create") {
        setTitleMessage("Solicitud creada exitosamente");
        setMessage("La solicitud ha sido creado correctamente.");
        setStatus("is-true");
        setShowMessage(true);
        onClose();
        onSuccess();
        updateData();
      }
    } catch (error) {
      console.log(error);
      if (typeForm === "create") {
        setTitleMessage("Error al crear la solicitud");
        setMessage(
          "No se pudo crear la solicitud. Por favor, inténtelo de nuevo."
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
            <p className="has-text-centered">
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
    </>
  );
};

export default Confirm_aperture;
