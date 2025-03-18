import React, { useState } from "react";
import EditarDatos from "./forms/edits/Form_edit_data"; 
import EditarContacto from "./forms/edits/Form_edit_contact"; 
import EditarUbicacion from "./forms/edits/Form_edit_location"; // Importa el nuevo formulario
import FormEditPalette from "./forms/edits/Form_edit_palette";

const DetallesEmpresa = () => {
  const [mostrarModalDatos, setMostrarModalDatos] = useState(false);
  const [mostrarModalContacto, setMostrarModalContacto] = useState(false);
  const [mostrarModalUbicacion, setMostrarModalUbicacion] = useState(false); // Nuevo estado para ubicación
  const [mostrarModalPaleta, setMostrarModalPaleta] = useState(false);

  return (
    <div className="box p-5">
      {/* Datos de la empresa */}
      <div className="media">
        <figure className="media-left">
          <p className="image is-64x64">
            <img src="https://via.placeholder.com/64" alt="Logo" />
          </p>
        </figure>
        <div className="media-content">
          <p className="title is-5">[Nombre de la empresa]</p>
          <p>[NIT de la empresa]</p>
          <p>[Certificado de facturación]</p>
        </div>
        <div className="media-right">
          <button className="button is-light" onClick={() => setMostrarModalDatos(true)}>
            Editar
          </button>
        </div>
      </div>

      {/* Información de contacto */}
      <section className="box p-5 mt-4">
        <h2 className="subtitle">Información de contacto</h2>
        <div className="columns">
          <div className="column">
            <p>Correo electrónico</p>
            <strong>[Correo]</strong>
          </div>
          <div className="column">
            <p>Teléfono</p>
            <strong>[Teléfono]</strong>
          </div>
          <div className="column has-text-right">
            <button className="button is-light" onClick={() => setMostrarModalContacto(true)}>
              Editar
            </button>
          </div>
        </div>
      </section>

      {/* Ubicación */}
      <section className="box p-5 mt-4">
        <h2 className="subtitle">Ubicación</h2>
        <div className="columns">
          <div className="column">
            <p>País</p>
            <strong>[País]</strong>
          </div>
          <div className="column">
            <p>Departamento</p>
            <strong>[Departamento]</strong>
          </div>
          <div className="column">
            <p>Ciudad</p>
            <strong>[Ciudad]</strong>
          </div>
          <div className="column">
            <p>Dirección de la empresa</p>
            <strong>[Dirección]</strong>
          </div>
          <div className="column has-text-right">
            <button className="button is-light" onClick={() => setMostrarModalUbicacion(true)}>
              Editar
            </button>
          </div>
        </div>
      </section>

      {/* Paleta de color */}
      <section className="box p-5 mt-4">
        <h2 className="subtitle">Paleta de color</h2>
        <div className="columns is-vcentered">
          <div className="column is-narrow">
            <p>Predeterminado</p>
          </div>
          <div className="column">
            <div className="tags">
              <span className="tag" style={{ backgroundColor: "#6AA84F" }}></span>
              <span className="tag" style={{ backgroundColor: "#B6D7A8" }}></span>
              <span className="tag" style={{ backgroundColor: "#E0E5DA" }}></span>
              <span className="tag" style={{ backgroundColor: "#6E6E6E" }}></span>
              <span className="tag" style={{ backgroundColor: "#1D1D1D" }}></span>
            </div>
          </div>
          <button className="button is-light" onClick={() => setMostrarModalPaleta(true)}>
            Editar
          </button>
        </div>
        <button className="button is-light mt-3">+ Añadir paleta</button>
      </section>

      {/* Modales */}
      {mostrarModalDatos && <EditarDatos cerrarModal={() => setMostrarModalDatos(false)} />}
      {mostrarModalContacto && <EditarContacto cerrarModal={() => setMostrarModalContacto(false)} />}
      {mostrarModalUbicacion && <EditarUbicacion cerrarModal={() => setMostrarModalUbicacion(false)} />}
      {mostrarModalPaleta && <FormEditPalette cerrarModal={() => setMostrarModalPaleta(false)} />}

    </div>
  );
};

export default DetallesEmpresa;
