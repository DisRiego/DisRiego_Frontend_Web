import { IoSearch } from "react-icons/io5";

const Search = ({ onSearch }) => {
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
        placeholder="Buscar por número de documento"
        onChange={handleInputChange}
      />
    </div>
  );
};

export default Search;
