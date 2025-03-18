import { useState } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaChevronRight, FaChevronLeft } from "react-icons/fa";
import Option_user from "./dashboard/Option_user";
import Icon from "../assets/icons/DisRiego.svg";
import { jwtDecode } from "jwt-decode";

const Sidebar = ({ handleOptionChange, selectedOption }) => {
  const token = localStorage.getItem("token");
  const storedSidebarState = localStorage.getItem("sidebarState");
  const initialState = storedSidebarState
    ? JSON.parse(storedSidebarState)
    : false;
  const [isCollapsed, setIsCollapsed] = useState(initialState);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("sidebarState", JSON.stringify(newState));
  };

  const decoded = jwtDecode(token);
  console.log(decoded.name);

  return (
    <>
      <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-logo">
          <a className="navbar-item" to="/">
            <span className="icon">
              <img src={Icon} alt="Logo de la Empresa" />
            </span>
            {!isCollapsed && (
              <span className="is-size-5 has-text-weight-bold">Dis Riego</span>
            )}
          </a>
        </div>
        <Option_user
          handleOptionChange={handleOptionChange}
          selectedOption={selectedOption}
          isCollapsed={isCollapsed}
        />
        <div className="sidebar-user">
          <Link
            className="navbar-item"
            onClick={() => handleOptionChange("profile")}
            to="/dashboard/profile"
          >
            <span className="icon">
              <FaUser />
            </span>
            {!isCollapsed && <span>{decoded.name}</span>} 
            {!isCollapsed && <span>Usuario</span>}
          </Link>
        </div>
        <button className="toggle-btn" onClick={toggleSidebar}>
          {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>
    </>
  );
};

export default Sidebar;
