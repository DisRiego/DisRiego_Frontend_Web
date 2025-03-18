import React, { useState } from "react";

const ModalAñadirCultivo = ({ isOpen, onClose }) => {
  const [cultivo, setCultivo] = useState({
    nombre: "",
    tiempo: "",
    intervalo: "",
  });

  const handleChange = (e) => {
    setCultivo({ ...cultivo, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos del cultivo:", cultivo);
    onClose(); // Cierra el modal después de enviar
  };

  if (!isOpen) return null;

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Añadir tipo de cultivo</p>
          <button className="delete" aria-label="close" onClick={onClose}></button>
        </header>

        <section className="modal-card-body">
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="label">Nombre del cultivo</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="nombre"
                  placeholder="Nombre del lote"
                  value={cultivo.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Tiempo estimado de cosecha</label>
              <div className="control">
                <input
                  className="input"
                  type="number"
                  name="tiempo"
                  placeholder="Tiempo estimado"
                  value={cultivo.tiempo}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Intervalo de pago</label>
              <div className="control">
                <div className="select is-fullwidth">
                  <select name="intervalo" value={cultivo.intervalo} onChange={handleChange} required>
                    <option value="">Selecciona una opción</option>
                    <option value="Mensual">Mensual</option>
                    <option value="Trimestral">Trimestral</option>
                    <option value="Semestral">Semestral</option>
                    <option value="Octamestral">Octamestral</option>
                  </select>
                </div>
              </div>
            </div>
          </form>
        </section>

        <footer className="modal-card-foot" style={{ justifyContent: "center" }}>
          <button className="button is-danger" onClick={onClose}>Cancelar</button>
          <button className="button is-success" onClick={handleSubmit}>Confirmar</button>
        </footer>
      </div>
    </div>
  );
};

export default ModalAñadirCultivo;
