import { IoFilterSharp } from "react-icons/io5";

const Filter = () => {
  return (
    <>
      <div className="button">
        <button className="button-filter">
          <span className="icon">
          <IoFilterSharp /></span>
          <span>Filtrar</span>
        </button>
      </div>
    </>
  );
};

export default Filter;
