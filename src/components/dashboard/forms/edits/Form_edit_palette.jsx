import React, { useState } from "react";

const FormEditPalette = ({ cerrarModal }) => {
  const [nombrePaleta, setNombrePaleta] = useState("Predeterminado");
  const [colores, setColores] = useState({
    primario: "#2A6041",
    secundario: "#C2E96A",
    terciario: "#E0F4B4",
    textoPrimario: "#292929",
    textoSecundario: "#959595",
    fondo: "#F3F3F7",
    bordes: "#EAECF0",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setColores({ ...colores, [name]: value });
  };

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={cerrarModal}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Editar paleta de color</p>
          <button className="delete" onClick={cerrarModal}></button>
        </header>
        <section className="modal-card-body">
          {/* Nombre de la paleta */}
          <div className="field">
            <label className="label">Nombre paleta de color</label>
            <div className="control">
              <input className="input" type="text" value={nombrePaleta} readOnly />
            </div>
          </div>

          {/* Selección de colores */}
          <div className="field">
            <label className="label">Selecciona los colores</label>
            {Object.entries(colores).map(([key, value]) => (
              <div className="field is-flex is-align-items-center" key={key}>
                <label className="label is-small" style={{ minWidth: "150px" }}>
                  {key
                    .replace("Primario", " primario")
                    .replace("Secundario", " secundario")
                    .replace("Terciario", " terciario")
                    .replace("texto", "Texto ")
                    .replace("fondo", "Color de fondo")
                    .replace("bordes", "Color de bordes")}
                </label>
                
                {/* Input de color */}
                <input
                  className="input is-small has-text-centered"
                  type="text"
                  value={value}
                  readOnly
                  style={{ width: "80px", marginRight: "10px", cursor: "pointer" }}
                  onClick={(e) => e.target.nextSibling.click()} // Al hacer clic en el texto, abre el selector de color
                />

                <input
                  type="color"
                  name={key}
                  value={value}
                  onChange={handleChange}
                  style={{
                    width: "40px",
                    height: "30px",
                    border: "none",
                    cursor: "pointer",
                  }}
                />
              </div>
            ))}
          </div>
        </section>

        <footer className="modal-card-foot">
          <button className="button is-danger" onClick={cerrarModal}>
            Cancelar
          </button>
          <button className="button" style={{ backgroundColor: "#C2E96A" }}>
            Confirmar
          </button>
        </footer>
      </div>
    </div>
  );
};

export default FormEditPalette;
