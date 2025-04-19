import React, { useState } from "react";
import axios from "axios";

/*
  Componente Confirm_modal:
  Muestra una ventana de confirmación antes de ejecutar una acción para luego enviar los datos al backend.

  @param {string} confirMessage - Mensaje principal que se muestra dentro del modal.
  @param {Function} onClose - Función que se ejecuta al cerrar el modal.
  @param {string} method - Método HTTP para la petición (POST, PUT, etc).
  @param {string} uriPost - URL del endpoint al que se hace la solicitud.
  @param {Object} formData - Datos a enviar en la petición.
  @param {string} token - Token de autenticación para el header Authorization.
  @param {string} loading - Clase que indica si el botón está cargando.
  @param {Function} setLoading - Función que actualiza el estado de carga.
  @param {string} typeForm - Tipo de acción ("create", "edit" u otros).
  @param {Object} feedbackMessages - Mensajes personalizados para éxito o error.

  @param {Function} setTitleMessage - Actualiza el título del mensaje.
  @param {Function} setMessage - Actualiza el contenido del mensaje.
  @param {Function} setStatus - Cambia el estado visual del mensaje (is-true o is-false).
  @param {Function} setShowMessage - Muestra el mensaje en pantalla.

  @param {Function} onSuccess - Función que permite cerrar la ventana de confirmación si se obtiene un status 200.
  @param {Function} updateData - Función que actualiza los datos del componente padre si se obtiene un status 200.
*/
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
  const [isProcessing, setIsProcessing] = useState(false); // Evita repetir la acción mientras está en proceso

  /*
    Ejecuta la solicitud al backend cuando el usuario hace clic en "Sí, confirmar".
    Muestra mensajes de éxito o error según el resultado.
  */
  const handleConfirm = async () => {
    try {
      setLoading("is-loading");
      setIsProcessing(true);

      // Configura los headers según si es multipart y si hay token
      let headers = {};
      if (typeForm?.includes("multipart")) {
        headers["Content-Type"] = "multipart/form-data";
      }
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // Realiza la solicitud al backend
      const response = await axios({
        method,
        url: uriPost,
        data: formData,
        headers,
      });

      // Muestra el mensaje de éxito
      const successMsg = feedbackMessages?.[typeForm]?.successTitle || "Éxito";
      const successText =
        feedbackMessages?.[typeForm]?.successMessage ||
        "Acción realizada correctamente.";

      setTitleMessage?.(successMsg);
      setMessage?.(successText);
      setStatus?.("is-true");
      setShowMessage?.(true);

      onClose(); // Cierra el modal
      onSuccess?.(); // Cierra la ventana de confirmación
      updateData?.(); // Refresca la información si se pasó esta función
    } catch (error) {
      // Muestra el mensaje de error
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
      {/* Cuerpo principal del modal */}
      <div className="modal-card p-5">
        <div className="modal-confirm modal-card-body">
          <p className="title has-text-centered is-5">
            ¿Está seguro de realizar la siguiente acción?
          </p>
          {/* Mensaje personalizado, con soporte para saltos de línea */}
          <p className="text-confirm has-text-centered mt-2">
            {confirMessage.split("\n").map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </p>
          {/* Botones de acción */}
          <div className="buttons is-centered mt-4">
            <div className="buttons">
              {/* Botón para cancelar */}
              <button
                className="button is-danger"
                onClick={!isProcessing ? onClose : undefined}
              >
                No, cancelar
              </button>
              {/* Botón para confirmar la acción */}
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
