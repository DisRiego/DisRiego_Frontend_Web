import { useState } from "react";
import axios from "axios";

const Confirm_user = ({
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
  token,
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      console.log(typeForm);
      if (typeForm === "create") {
        setTitleMessage("Usuario creado exitosamente");
        setMessage("El usuario ha sido creado correctamente.");
        setStatus("is-true");
        console.log("Confirm create");
        setShowMessage(true);
        onClose();
        onSuccess();
        updateData();
      } else {
        if (typeForm === "edit") {
          setTitleMessage("Usuario actualizado exitosamente");
          setMessage("El usuario ha sido actualizado correctamente.");
          setStatus("is-true");
          console.log("Confirm edit");
          setShowMessage(true);
          onClose();
          onSuccess();
          updateData();
        }
      }
    } catch (error) {
      console.log(error);
      if (typeForm === "create") {
        setTitleMessage("Error al crear el usuario");
        setMessage(
          "No se pudo crear el usuario, por favor, inténtelo de nuevo."
        );
        setStatus("is-false");
        setShowMessage(true);
      } else {
        if (typeForm === "edit") {
          setTitleMessage("Error al actualizar el usuario");
          setMessage(
            "No se pudo actualizar el usuario, por favor, inténtelo de nuevo."
          );
          setStatus("is-false");
          setShowMessage(true);
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
                  className={"button is-primary  color-hover " + loading}
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

export default Confirm_user;
