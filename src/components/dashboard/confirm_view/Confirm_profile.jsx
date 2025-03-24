import { useState } from "react";
import axios from "axios";

const Confirm_profile = ({
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
  token,
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
          Authorization: `Bearer ${token}`,
        },
      });
      if (typeForm === "update_password") {
        setTitleMessage("Actualización exitosa");
        setMessage("La contraseña se ha actualizado correctamente.");
        setStatus("is-true");
        setShowMessage(true);
        onClose();
        onSuccess();
        updateData();
      } else {
        if (typeForm === "update_picture") {
          setTitleMessage("Actualización exitosa");
          setMessage("La foto de perfil se ha actualizado correctamente.");
          setStatus("is-true");
          setShowMessage(true);
          onClose();
          onSuccess();
          updateData();
        } else {
          if (typeForm === "update_data") {
            setTitleMessage("Actualización exitosa");
            setMessage("La información ha sido actualizada correctamente.");
            setStatus("is-true");
            setShowMessage(true);
            onClose();
            onSuccess();
            updateData();
          }
        }
      }
    } catch (error) {
      console.log(error);
      if (typeForm === "update_password") {
        setTitleMessage("Error al actualizar");
        setMessage(
          "No se pudo actualizar la contraseña. Por favor, inténtelo de nuevo."
        );
        setStatus("is-false");
        setShowMessage(true);
      } else {
        if (typeForm === "update_picture") {
          setTitleMessage("Error al actualizar");
          setMessage(
            "No se pudo actualizar la foto de perfil. Por favor, inténtelo de nuevo."
          );
          setStatus("is-false");
          setShowMessage(true);
        } else {
          if (typeForm === "update_data") {
            setTitleMessage("Error al actualizar");
            setMessage(
              "No se pudo actualizar la información. Por favor, inténtelo de nuevo."
            );
            setStatus("is-false");
            setShowMessage(true);
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

export default Confirm_profile;
