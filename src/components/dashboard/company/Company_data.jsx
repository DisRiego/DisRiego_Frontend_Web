import React, { useState } from "react";
import Form_edit_company_data from "../forms/edits/Form_edit_company_data";
import Form_edit_contact from "../forms/edits/Form_edit_contact";
import Form_edit_location from "../forms/edits/Form_edit_location";
import Form_edit_palette from "../forms/edits/Form_edit_palette";
import { FaEdit } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";

const Company_data = () => {
  const [showModalData, setShowModalData] = useState(false);
  const [mostrarModalContacto, setMostrarModalContacto] = useState(false);
  const [mostrarModalUbicacion, setMostrarModalUbicacion] = useState(false);
  const [mostrarModalPaleta, setMostrarModalPaleta] = useState(false);

  return (
    <>
      {/* Datos de la empresa */}
      <div className="rol-detail">
        <div className="media is-align-items-center">
          <div className="media-left">
            <figure className="image is-64x64 profile-image">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135768.png"
                alt="Perfil"
                className="is-rounded"
              />
            </figure>
          </div>
          <div className="media-content">
            <div className="content">
              <h2 className="title is-5 margin-bottom mt-1">
                <strong>[Nombre de la empresa]</strong>
              </h2>
              <p className="is-5 margin-bottom mt-2">[Nit de la empresa]</p>
              <p className="is-5 margin-bottom">[Certificado de facturación]</p>
            </div>
          </div>
          <div className="level">
            <button className="button" onClick={() => setShowModalData(true)}>
              <FaEdit className="mr-2" /> Editar
            </button>
          </div>
        </div>
      </div>

      {/* Información de contacto */}
      <section className="rol-detail">
        <div className="level">
          <h3 className="title is-5 margin-bottom">Información de contacto</h3>
          <button className="button" onClick={() => setShowModalData(true)}>
            <FaEdit className="mr-2" /> Editar
          </button>
        </div>
        <div className="columns">
          <div className="column">
            <p>Correo electrónico</p>
            <strong>[Correo]</strong>
          </div>
          <div className="column">
            <p>Teléfono</p>
            <strong>[Teléfono]</strong>
          </div>
        </div>
      </section>

      {/* Ubicación */}
      <section className="rol-detail">
        <div className="level">
          <h3 className="title is-5 margin-bottom">Ubicación</h3>
          <button
            className="button"
            onClick={() => setMostrarModalUbicacion(true)}
          >
            <FaEdit className="mr-2" /> Editar
          </button>
        </div>
        <div className="columns">
          <div className="column">
            <p>País</p>
            <strong>[País]</strong>
          </div>
          <div className="column">
            <p>Departamento</p>
            <strong>[Departamento]</strong>
          </div>
        </div>
        <div className="columns">
          <div className="column">
            <p>Ciudad</p>
            <strong>[Ciudad]</strong>
          </div>
          <div className="column">
            <p>Dirección de la empresa</p>
            <strong>[Dirección]</strong>
          </div>
        </div>
      </section>

      <section className="rol-detail">
        <div className="level">
          <h3 className="title is-5 margin-bottom">Paleta de color</h3>
          <button
            className="button"
            onClick={() => setMostrarModalPaleta(true)}
          >
            <FaPlus className="mr-2" /> Añadir
          </button>
        </div>
        <div className="columns">
          <div className="column">
            <div className="rol-detail">
              <div className="level mb-2">
                <h3 className="is-5 margin-bottom">
                  [Nombre de la paleta de color]
                </h3>
                <button
                  className="button"
                  onClick={() => setMostrarModalPaleta(true)}
                >
                  <FaEdit className="mr-2" /> Editar
                </button>
              </div>
              <span
                className="tag"
                style={{ backgroundColor: "#6AA84F" }}
              ></span>
              <span
                className="tag"
                style={{ backgroundColor: "#B6D7A8" }}
              ></span>
              <span
                className="tag"
                style={{ backgroundColor: "#E0E5DA" }}
              ></span>
              <span
                className="tag"
                style={{ backgroundColor: "#6E6E6E" }}
              ></span>
              <span
                className="tag"
                style={{ backgroundColor: "#1D1D1D" }}
              ></span>
            </div>
          </div>
          <div className="column"></div>
        </div>
      </section>

      {/* Modales */}
      {showModalData && (
        <Form_edit_company_data
          title="Editar información de la empresa"
          onClose={() => setShowModalData(false)}
        />
      )}
      {mostrarModalContacto && (
        <Form_edit_contact cerrarModal={() => setMostrarModalContacto(false)} />
      )}
      {mostrarModalUbicacion && (
        <Form_edit_location
          cerrarModal={() => setMostrarModalUbicacion(false)}
        />
      )}
      {mostrarModalPaleta && (
        <Form_edit_palette cerrarModal={() => setMostrarModalPaleta(false)} />
      )}
    </>
  );
};

export default Company_data;
