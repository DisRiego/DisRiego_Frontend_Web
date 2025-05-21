import { useEffect, useState } from "react";
import axios from "axios";

const Change_status_request = ({
  onClose,
  onSuccess,
  id,
  confirMessage,
  setShowMessage,
  setTitleMessage,
  setMessage,
  setStatus,
  updateData,
  typeForm,
  loading,
  setLoading,
}) => {
  const [formData, setFormData] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // console.log(typeForm);
    if (typeForm === "open" || typeForm === "closed")
      setFormData({
        device_id: id,
      });
  }, [typeForm]);

  const handleConfirm = async () => {
    try {
      setLoading("is-loading");
      setIsProcessing(true);
      if (typeForm === "open") {
        const response = await axios.post(
          import.meta.env.VITE_URI_BACKEND_IOT +
            import.meta.env.VITE_ROUTE_BACKEND_IOT_OPEN_VALVE,
          formData
        );
      } else {
        if (typeForm === "closed") {
          const response = await axios.post(
            import.meta.env.VITE_URI_BACKEND_IOT +
              import.meta.env.VITE_ROUTE_BACKEND_IOT_CLOSED_VALVE,
            formData
          );
        }
      }

      if (typeForm === "open") {
        setTitleMessage("Apertura exitosa");
        setMessage("La válvula se abrio correctamente.");
        setStatus("is-true");
        setShowMessage(true);
      } else {
        if (typeForm === "closed") {
          setTitleMessage("Cerrar exitosa");
          setMessage("La válvula se cerró correctamente.");
          setStatus("is-true");
          setShowMessage(true);
        }
      }

      onClose();
      onSuccess();
      updateData();
    } catch (error) {
      console.log(error);
      if (typeForm === "open") {
        setTitleMessage("Apertura fallida");
        setMessage(
          "No se pudo abrir la válvula. Por favor, inténtelo de nuevo."
        );
        setStatus("is-false");
      } else {
        if (typeForm === "closed") {
          setTitleMessage("Cerrar fallida");
          setMessage(
            "No se pudo cerrar la válvula. Por favor, inténtelo de nuevo."
          );
          setStatus("is-false");
        }
      }

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

export default Change_status_request;
