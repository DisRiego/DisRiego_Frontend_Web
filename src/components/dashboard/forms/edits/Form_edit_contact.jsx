import React, { useState } from "react";

const EditarContacto = ({ cerrarModal }) => {
  const [formData, setFormData] = useState({
    correo: "",
    telefono: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formulario enviado", formData);
    cerrarModal();
  };

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={cerrarModal}></div>
      <div className="modal-card" style={{ width: "400px" }}>
        <header className="modal-card-head" style={{ borderBottom: "none" }}>
          <p className="modal-card-title" style={{ fontWeight: "bold" }}>
            Editar información de contacto
          </p>
          <button className="delete" aria-label="close" onClick={cerrarModal}></button>
        </header>
        <section className="modal-card-body">
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="label" style={{ fontSize: "14px", fontWeight: "bold" }}>
                Correo electrónico
              </label>
              <div className="control">
                <input
                  type="email"
                  className="input"
                  name="correo"
                  placeholder="Correo electrónico"
                  value={formData.correo}
                  onChange={handleChange}
                  style={{ backgroundColor: "#F5F5F5", borderRadius: "8px" }}
                />
              </div>
            </div>
            <div className="field">
              <label className="label" style={{ fontSize: "14px", fontWeight: "bold" }}>
                Teléfono
              </label>
              <div className="control">
                <input
                  type="tel"
                  className="input"
                  name="telefono"
                  placeholder="Teléfono"
                  value={formData.telefono}
                  onChange={handleChange}
                  style={{ backgroundColor: "#F5F5F5", borderRadius: "8px" }}
                />
              </div>
            </div>
          </form>
        </section>
        <footer className="modal-card-foot" style={{ justifyContent: "center", borderTop: "none" }}>
          <button
            className="button"
            style={{ backgroundColor: "#D9534F", color: "white", borderRadius: "8px", width: "120px" }}
            onClick={cerrarModal}
          >
            Cancelar
          </button>
          <button
            className="button"
            style={{ backgroundColor: "#E5F4C3", color: "black", borderRadius: "8px", width: "120px" }}
            onClick={handleSubmit}
          >
            Confirmar
          </button>
        </footer>
      </div>
    </div>
  );
};

export default EditarContacto;
