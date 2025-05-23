import { useEffect, useState } from "react";
import axios from "axios";

const Change_status_concept = ({
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
  const [typeOperation, setTypeOperation] = useState("");
  // console.log(typeForm);
  // console.log(id);

  useEffect(() => {
    setFormData({
      concept_id: typeForm === "habilitar" ? 27 : 28,
    });

    if (typeForm === "habilitar") {
      setTypeOperation("/enable");
    } else {
      setTypeOperation("/disable");
    }
  }, [typeForm, id]);

  const handleConfirm = async () => {
    try {
      setLoading("is-loading");
      setIsProcessing(true);

      console.log(
        import.meta.env.VITE_URI_BACKEND_FACTURACTION +
          import.meta.env.VITE_ROUTE_BACKEND_CONCEPT +
          id +
          typeOperation
      );
      const response = await axios.patch(
        import.meta.env.VITE_URI_BACKEND_FACTURACTION +
          import.meta.env.VITE_ROUTE_BACKEND_CONCEPT +
          id +
          typeOperation,
        formData
      );

      console.log(response);

      if (typeForm === "habilitar") {
        setTitleMessage("Habilitación exitosa");
        setMessage("Se ha habilitado el concepto correctamente.");
        setStatus("is-true");
        setShowMessage(true);
      } else {
        setTitleMessage("Inhabilitación exitosa");
        setMessage("Se ha inhabilitado el concepto correctamente.");
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
          "No se pudo habilitar el concepto. Por favor, inténtelo de nuevo."
        );
        setStatus("is-false");
      } else {
        setTitleMessage("Inhabilitación fallida");
        setMessage(
          "No se pudo inhabilitar el concepto. Por favor, inténtelo de nuevo."
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

export default Change_status_concept;
