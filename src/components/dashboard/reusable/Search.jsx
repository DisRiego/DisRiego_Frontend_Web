import { IoSearch } from "react-icons/io5";

/*
  Componente Search:
  Muestra un campo de búsqueda con ícono y envía el texto al escribir.

  @param {Function} onSearch - Función que se llama cada vez que el usuario escribe.
  @param {boolean} buttonDisabled - Si es true, desactiva el campo de búsqueda.
*/
const Search = ({ onSearch, buttonDisabled }) => {
  /*
    Esta función se ejecuta cada vez que el usuario escribe en el input.
    Toma el valor del input y lo envía a la función onSearch.
  */
  const handleInputChange = (event) => {
    onSearch(event.target.value);
  };

  return (
    <div className="control search has-icons-left">
      <span className="icon is-small is-left">
        <IoSearch />
      </span>
      <input
        className="input"
        type="text"
        placeholder="Buscar..."
        onChange={handleInputChange}
        disabled={buttonDisabled} // Si está desactivado, el usuario no puede escribir
      />
    </div>
  );
};

export default Search;
