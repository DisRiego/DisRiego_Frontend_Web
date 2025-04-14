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
  // console.log(typeForm);
  console.log(formData);

  useEffect(() => {
    setFormData({
      request_id: id,
    });
  }, [typeForm]);

  const handleConfirm = async () => {
    try {
      setLoading("is-loading");
      setIsProcessing(true);
      const response = await axios.post(
        import.meta.env.VITE_URI_BACKEND_IOT +
          import.meta.env.VITE_ROUTE_BACKEND_REQUEST_CHANGE_STATUS,
        formData
      );

      if (typeForm === "habilitar") {
        setTitleMessage("Habilitación exitosa");
        setMessage("Se ha habilitado el lote correctamente.");
        setStatus("is-true");
        setShowMessage(true);
      } else {
        setTitleMessage("Inhabilitación exitosa");
        setMessage("Se ha inhabilitado el lote correctamente.");
        setStatus("is-true");
        setShowMessage(true);
      }

      onClose();
      onSuccess();
      updateData();
    } catch (error) {
      console.log(error);
      if (typeForm === "habilitar") {
        setTitleMessage("Habilitación fallida");
        setMessage(
          "No se pudo habilitar el lote. Por favor, inténtelo de nuevo."
        );
        setStatus("is-false");
      } else {
        setTitleMessage("Inhabilitación fallida");
        setMessage(
          "No se pudo inhabilitar el lote. Por favor, inténtelo de nuevo."
        );
        setStatus("is-false");
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
