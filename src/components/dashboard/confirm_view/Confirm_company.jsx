import { useState } from "react";
import axios from "axios";

const Confirm_company = ({
  onClose,
  onSuccess,
  confirMessage,
  method,
  formData,
  setShowMessage,
  setTitleMessage,
  setMessage,
  setStatus,
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
        // headers: {
        //   "Content-Type": "multipart/form-data",
        // },
      });
      if (typeForm === "update_logo_profile") {
        setTitleMessage("Actualización exitosa");
        setMessage("El logo de la empresa se ha actualizado correctamente.");
        setStatus("is-true");
        setShowMessage(true);
        onClose();
        onSuccess();
        updateData();
      } else {
        if (typeForm === "update_basic") {
          setTitleMessage("Actualización exitosa");
          setMessage("La información se ha actualizado correctamente.");
          setStatus("is-true");
          setShowMessage(true);
          onClose();
          onSuccess();
          updateData();
        } else {
          if (typeForm === "update_contact") {
            setTitleMessage("Actualización exitosa");
            setMessage(
              "La información de contacto se ha actualizado correctamente."
            );
            setStatus("is-true");
            setShowMessage(true);
            onClose();
            onSuccess();
            updateData();
          } else {
            if (typeForm === "update_location_profile") {
              setTitleMessage("Actualización exitosa");
              setMessage(
                "La ubicación de la empresa se ha actualizado correctamente."
              );
              setStatus("is-true");
              setShowMessage(true);
              onClose();
              onSuccess();
              updateData();
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
      if (typeForm === "update_basic") {
        setTitleMessage("Error al actualizar");
        setMessage(
          "No se pudo actualizar la información de la empresa. Por favor, inténtelo de nuevo."
        );
        setStatus("is-false");
        setShowMessage(true);
      } else {
        if (typeForm === "update_logo_profile") {
          setTitleMessage("Error al actualizar");
          setMessage(
            "No se pudo actualizar el logo de la empresa. Por favor, inténtelo de nuevo."
          );
          setStatus("is-false");
          setShowMessage(true);
        } else {
          if (typeForm === "update_contact") {
            setTitleMessage("Error al actualizar");
            setMessage(
              "No se pudo actualizar la información de contacto. Por favor, inténtelo de nuevo."
            );
            setStatus("is-false");
            setShowMessage(true);
          } else {
            if (typeForm === "update_location_profile") {
              setTitleMessage("Error al actualizar");
              setMessage(
                "No se pudo actualizar la ubicación de la empresa. Por favor, inténtelo de nuevo."
              );
              setStatus("is-false");
              setShowMessage(true);
            }
          }
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

export default Confirm_company;
