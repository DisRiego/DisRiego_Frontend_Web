import { IoFilterSharp } from "react-icons/io5";

const Filter = ({ onFilterClick }) => {
  return (
    <>
      <div className="button" onClick={onFilterClick}>
        <button className="button-filter">
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
