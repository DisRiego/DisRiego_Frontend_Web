import { IoFilterSharp } from "react-icons/io5";

/*
  Componente Filter:
  Muestra un botón con ícono para aplicar filtros.

  @param {Function} onFilterClick - Función que se llama al hacer clic en el botón.
  @param {boolean} buttonDisabled - Si es true, el botón no debería funcionar (aunque el div no soporta disabled).
*/
const Filter = ({ onFilterClick, buttonDisabled }) => {
  return (
    <>
      {/* Botón que muestra el ícono y el texto "Filtros" */}
      <div className="button" onClick={onFilterClick} disabled={buttonDisabled}>
        <button className="button-filter" disabled={buttonDisabled}>
          {/*Evita ejecutar si está desactivado*/}
          <span className="icon">
            <IoFilterSharp />
          </span>
          <span>Filtros</span>
        </button>
      </div>
    </>
  );
};

export default Filter;
