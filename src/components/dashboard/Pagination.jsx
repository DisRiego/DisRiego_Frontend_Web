import { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { GrFormNextLink } from "react-icons/gr";

const Pagination = () => {
  return (
    <>
      <div className="container-pagination">
        <nav
          class="pagination is-centered"
          role="navigation"
          aria-label="pagination"
        >
          <button href="#" class="pagination-previous">
            <span className="icon"><IoMdArrowRoundBack/></span>
            <span>Atrás</span>
          </button>

          <ul class="pagination-list">
            <li>
              <a href="#" class="pagination-link" aria-label="Goto page 1">
                1
              </a>
            </li>
          </ul>
          <button href="#" class="pagination-next">
            <span>Siguiente</span>
            <span className="icon"><IoMdArrowRoundBack style={{rotate: "180deg"}}/></span>
          </button>
        </nav>
      </div>
    </>
  );
};

export default Pagination;
