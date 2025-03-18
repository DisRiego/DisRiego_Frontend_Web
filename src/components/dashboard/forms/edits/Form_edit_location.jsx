import React from "react";

const EditarUbicacion = ({ cerrarModal }) => {
  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={cerrarModal}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Editar ubicación</p>
          <button className="delete" aria-label="close" onClick={cerrarModal}></button>
        </header>
        <section className="modal-card-body">
          <div className="field">
            <label className="label">País</label>
            <div className="control">
              <input className="input" type="text" placeholder="País" />
            </div>
          </div>
          <div className="field">
            <label className="label">Departamento</label>
            <div className="control">
              <input className="input" type="text" placeholder="Departamento" />
            </div>
          </div>
          <div className="field">
            <label className="label">Ciudad</label>
            <div className="control">
              <input className="input" type="text" placeholder="Ciudad" />
            </div>
          </div>
          <div className="field">
            <label className="label">Dirección</label>
            <div className="control">
              <input className="input" type="text" placeholder="Dirección" />
            </div>
          </div>
        </section>
        <footer className="modal-card-foot" style={{ justifyContent: "center" }}>
          <button className="button is-danger">Cancelar</button>
          <button className="button" style={{ backgroundColor: "#D8F2B1", color: "black" }}>
            Confirmar
          </button>
        </footer>
      </div>
    </div>
  );
};

export default EditarUbicacion;
