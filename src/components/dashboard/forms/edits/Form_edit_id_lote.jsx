import React, { useState } from "react";

const EditarLote = () => {
  const [formData, setFormData] = useState({
    tipoCultivo: "",
    fechaSiembra: "",
    intervaloCosecha: "",
    intervaloPago: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formulario enviado", formData);
  };

  return (
    <div className="modal is-active">
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Editar [ID lote]</p>
          <button className="delete" aria-label="close"></button>
        </header>
        <section className="modal-card-body">
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="label">Tipo de cultivo</label>
              <div className="control">
                <div className="select is-fullwidth">
                  <select name="tipoCultivo" value={formData.tipoCultivo} onChange={handleChange}>
                    <option value="">Seleccione una opción</option>
                    <option value="maiz">Maíz</option>
                    <option value="trigo">Trigo</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="field">
              <label className="label">Fecha de siembra</label>
              <div className="control">
                <input
                  type="date"
                  className="input"
                  name="fechaSiembra"
                  value={formData.fechaSiembra}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Intervalo de cosecha</label>
              <div className="control">
                <div className="select is-fullwidth">
                  <select name="intervaloCosecha" value={formData.intervaloCosecha} onChange={handleChange}>
                    <option value="">Seleccione una opción</option>
                    <option value="mensual">Mensual</option>
                    <option value="trimestral">Trimestral</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="field">
              <label className="label">Intervalo de pago</label>
              <div className="control">
                <div className="select is-fullwidth">
                  <select name="intervaloPago" value={formData.intervaloPago} onChange={handleChange}>
                    <option value="">Seleccione una opción</option>
                    <option value="mensual">Mensual</option>
                    <option value="trimestral">Trimestral</option>
                  </select>
                </div>
              </div>
            </div>
          </form>
        </section>
        <footer className="modal-card-foot">
          <button className="button is-danger">Cancelar</button>
          <button className="button is-success" onClick={handleSubmit}>Confirmar</button>
        </footer>
      </div>
    </div>
  );
};

export default EditarLote;
