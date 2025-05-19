import { IoMdArrowRoundBack } from "react-icons/io";

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    onPageChange(page);
  };

  return (
    <div className="container-pagination">
      <nav className="pagination is-centered" role="navigation" aria-label="pagination">
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
        <ul className="pagination-list">
          {Array.from({ length: totalPages }, (_, index) => (
            <li key={index}>
              <button
                className={`pagination-link ${currentPage === index + 1 ? "has-background-grey	has-text-light" : ""}`}
                onClick={() => handlePageClick(index + 1)}
              >
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
        <button
          className="pagination-next"
          onClick={handleNext}
          disabled={currentPage === totalPages}
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
