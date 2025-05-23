import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaChevronRight, FaChevronLeft } from "react-icons/fa";
import Option_user from "./dashboard/Option_user";
import Icon from "../assets/icons/DisRiego.svg";
import { jwtDecode } from "jwt-decode";

const Sidebar = ({ handleOptionChange, selectedOption }) => {
  const navigate = useNavigate();
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
  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      try {
        const decoded = jwtDecode(token);
      } catch (error) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  }, [token, navigate]);

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
