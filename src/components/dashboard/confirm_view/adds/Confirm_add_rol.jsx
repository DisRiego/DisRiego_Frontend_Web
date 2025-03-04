import { useState } from "react";
import Message from "../../../Message.jsx";

const Confirm_add_rol = ({ confirMessage, onClose, onConfirm }) => {
  const [showMessage, setShowMessage] = useState(false);

  const handleConfirm = () => {
    setShowMessage(true);
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
      {showMessage && <Message onClose={() => setShowMessage(false)} />}
    </>
  );
};

export default Confirm_add_rol;
