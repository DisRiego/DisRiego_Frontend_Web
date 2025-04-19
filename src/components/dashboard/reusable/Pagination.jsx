import { IoMdArrowRoundBack } from "react-icons/io";

/*
  Componente Pagination:
  Muestra botones para moverse entre páginas de datos.

  @param {number} totalItems - Total de elementos.
  @param {number} itemsPerPage - Cantidad de elementos por página.
  @param {number} currentPage - Página actual.
  @param {Function} onPageChange - Función que se llama cuando se cambia de página.
*/
const Pagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) => {
  // Se calcula el total de páginas dividiendo los elementos por página
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  /*
    Función que va a la página anterior si no estamos en la primera.
  */
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  /*
    Función que va a la página siguiente si no estamos en la última.
  */
  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  /*
    Función que permite cambiar directamente a una página específica.
  */
  const handlePageClick = (page) => {
    onPageChange(page);
  };

  return (
    <div className="container-pagination">
      <nav
        className="pagination is-centered"
        role="navigation"
        aria-label="pagination"
      >
        {/* Botón para ir a la página anterior */}
        <button
          className="pagination-previous"
          onClick={handlePrevious}
          disabled={currentPage === 1}
        >
          <span className="icon">
            <IoMdArrowRoundBack />
          </span>
          <span>Atrás</span>
        </button>
        {/* Lista de botones para cada página */}
        <ul className="pagination-list">
          {Array.from({ length: totalPages }, (_, index) => (
            <li key={index}>
              <button
                className={`pagination-link ${
                  currentPage === index + 1
                    ? "has-background-grey	has-text-light"
                    : ""
                }`}
                onClick={() => handlePageClick(index + 1)}
              >
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
        {/* Botón para ir a la página siguiente */}
        <button
          className="pagination-next"
          onClick={handleNext}
          disabled={currentPage === totalPages} // Se desactiva si ya estamos en la última
        >
          <span>Siguiente</span>
          <span className="icon">
            <IoMdArrowRoundBack style={{ rotate: "180deg" }} />
          </span>
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
