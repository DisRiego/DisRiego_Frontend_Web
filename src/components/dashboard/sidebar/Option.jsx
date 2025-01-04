import { Link } from "react-router-dom";

const Option = () => {
  return (
    <>
        <div className="sidebar-options">
        <Link
          onClick={() => handleOptionChange("rol")}
          to="/dashboard/rol"
        >
          Rol
        </Link>
        <Link
          onClick={() => handleOptionChange("otro")}
        >
          Otro
        </Link>
      </div>
    </>
  )
}

export default Option