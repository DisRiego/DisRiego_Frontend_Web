import { useState } from "react";
import Message from "../../../Message.jsx";
import axios from "axios";

const Confirm_add_rol = ({ confirMessage, onClose, method, formData }) => {
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleConfirm = async () => {
    try {
      const response = await axios({
        method: method,
        url:
          import.meta.env.VITE_URI_BACKEND +
          import.meta.env.VITE_ROUTE_BACKEND_ROL,
        data: formData,
      });
      setMessage("Se creo el rol");
      setStatus("is-true");
      setShowMessage(true);
    } catch (error) {
      setMessage(error.response.data.detail.data);
      setStatus("is-false");
      setShowMessage(true);
    }
  };

  return (
    <>
      <div className="modal is-active">
        <div className="modal-background"></div>
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
                <button className="button is-danger" onClick={onClose}>
                  No, cancelar
                </button>
                <button className="button color-hover" onClick={handleConfirm}>
                  Sí, confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showMessage && (
        <Message
          onClose={() => setShowMessage(false)}
          status={status}
          message={message}
        />
      )}
    </>
  );
};

export default Confirm_add_rol;
