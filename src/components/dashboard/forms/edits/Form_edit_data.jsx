import React, { useState } from "react";

const EditarDatos = () => {
  const [formData, setFormData] = useState({
    nombreComercial: "",
    nitEmpresa: "",
    certificadoDigital: "",
    logoEmpresa: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, logoEmpresa: e.target.files[0] });
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
          <p className="modal-card-title">Editar datos</p>
          <button className="delete" aria-label="close"></button>
        </header>
        <section className="modal-card-body">
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="label">Nombre comercial</label>
              <div className="control">
                <input
                  type="text"
                  className="input"
                  name="nombreComercial"
                  placeholder="Nombre de la empresa"
                  value={formData.nombreComercial}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Nit de la empresa</label>
              <div className="control">
                <input
                  type="text"
                  className="input"
                  name="nitEmpresa"
                  placeholder="Nit"
                  value={formData.nitEmpresa}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Certificado digital</label>
              <div className="control">
                <div className="select is-fullwidth">
                  <select name="certificadoDigital" value={formData.certificadoDigital} onChange={handleChange}>
                    <option value="">Seleccione una opción</option>
                    <option value="cert1">Certificado 1</option>
                    <option value="cert2">Certificado 2</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="field">
              <label className="label">Logo de la empresa</label>
              <div className="file has-name is-boxed">
                <label className="file-label">
                  <input className="file-input" type="file" name="logoEmpresa" onChange={handleFileChange} />
                  <span className="file-cta">
                    <span className="file-icon">
                      <i className="fas fa-upload"></i>
                    </span>
                    <span className="file-label">Haga clic o arrastre y suelte el archivo</span>
                  </span>
                  {formData.logoEmpresa && <span className="file-name">{formData.logoEmpresa.name}</span>}
                </label>
              </div>
              <p className="help">(Tamaño máx. del archivo: 1MB)</p>
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

export default EditarDatos;