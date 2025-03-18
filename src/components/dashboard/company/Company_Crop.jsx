import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import Form_edit_crop from "../forms/edits/Form_edit_crop";

const CultivosTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cultivoSeleccionado, setCultivoSeleccionado] = useState(null);

  const cultivos = [
    { id: 1, nombre: "Maíz", tiempo: "90", intervalo: "Mensual" },
    { id: 2, nombre: "Trigo", tiempo: "120", intervalo: "Trimestral" },
    { id: 3, nombre: "Arroz", tiempo: "150", intervalo: "Semestral" },
    { id: 4, nombre: "Cebada", tiempo: "180", intervalo: "Octamestral" },
  ];

  const abrirModal = (cultivo) => {
    setCultivoSeleccionado(cultivo);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="box">
        <table className="table is-fullwidth is-hoverable is-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre del cultivo</th>
              <th>Tiempo estimado de cosecha (días)</th>
              <th>Intervalo de pago</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            {cultivos.map((cultivo) => (
              <tr key={cultivo.id}>
                <td>{cultivo.id}</td>
                <td className="has-text-grey">{cultivo.nombre}</td>
                <td className="has-text-grey">{cultivo.tiempo}</td>
                <td className="has-text-grey">{cultivo.intervalo}</td>
                <td>
                  <button
                    className="button is-small is-info"
                    onClick={() => abrirModal(cultivo)}
                  >
                    <FaEdit /> Editar
                  </button>
                  <button className="button is-small is-danger ml-3">
                    <FaTrash /> Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <nav
        className="pagination is-centered"
        role="navigation"
        aria-label="pagination"
      >
        <button className="button is-light">← Atrás</button>
        <ul className="pagination-list">
          <li>
            <a className="pagination-link is-current">1</a>
          </li>
          <li>
            <a className="pagination-link">2</a>
          </li>
          <li>
            <a className="pagination-link">3</a>
          </li>
          <li>
            <span className="pagination-ellipsis">&hellip;</span>
          </li>
          <li>
            <a className="pagination-link">10</a>
          </li>
        </ul>
        <button className="button is-light">Siguiente →</button>
      </nav>

      {/* Modal para editar cultivo */}
      {isModalOpen && (
        <Form_edit_crop
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          cultivoData={cultivoSeleccionado}
          onSave={(cultivoActualizado) => {
            console.log("Cultivo actualizado:", cultivoActualizado);
            setIsModalOpen(false);
          }}
        />
      )}
    </>
  );
};

export default CultivosTable;
