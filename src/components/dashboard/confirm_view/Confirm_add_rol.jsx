import { useState } from "react";

const Confirm_add_rol = ({ onCancel }) => {
  console.log("Hola");
  return (
    <>
      <div className="modal" id="confirmationModal">
        <div className="modal-background"></div>
        <div className="modal-card">
          <section className="modal-card-body">
            <p className="has-text-weight-semibold is-size-5">
              ¿Está seguro de realizar la siguiente acción?
            </p>
            <p className="mt-2">
              ¿Desea crear el rol con los siguientes permisos:{" "}
              <strong>[permisos]</strong>?
            </p>
            <div className="buttons is-centered mt-4">
              <button
                className="button btn-cancel"
                id="cancelBtn"
                onClick={onCancel}
              >
                No, cancelar
              </button>
              <button className="button btn-confirm" id="confirmBtn">
                Sí, confirmar
              </button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Confirm_add_rol;
