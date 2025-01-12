import { IoSearch } from "react-icons/io5";

const Search = () => {
  return (
    <>
      <p class="control search has-icons-left">
        <span class="icon is-small is-left">
          <IoSearch />
        </span>
        <input class="input" type="text" placeholder="Búsqueda" />
      </p>
    </>
  );
};

export default Search;
