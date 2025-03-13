import { Link } from "react-router-dom";
import { MdOutlineWaterDrop } from "react-icons/md";
import { FiUsers } from "react-icons/fi";
import { HiOutlineBell } from "react-icons/hi";
import { TbMapSearch, TbReport, TbLogout } from "react-icons/tb";
import { LuWallet } from "react-icons/lu";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { LuUserCog } from "react-icons/lu";
import { LuUsersRound } from "react-icons/lu";

const Option_user = ({ handleOptionChange, selectedOption, isCollapsed }) => {
  const handleSignUp = async (e) => {
    localStorage.removeItem("token");
  };
  return (
    <>
      <div className="sidebar-options">
        <Link
          className={`navbar-item ${
            selectedOption === "notification" ? "selected" : ""
          }`}
          onClick={() => handleOptionChange("notification")}
          to="/dashboard/notification"
        >
          <span className="icon">
            <HiOutlineBell />
          </span>
          {!isCollapsed && <span>Notificaciones</span>}
        </Link>
        <Link
          className={`navbar-item ${
            selectedOption === "rol" ? "selected" : ""
          }`}
          onClick={() => handleOptionChange("rol")}
          to="/dashboard/rol"
        >
          <span className="icon">
            <LuUserCog />
          </span>
          {!isCollapsed && <span>Gestión de roles</span>}
        </Link>
        <Link
          className={`navbar-item ${
            selectedOption === "user" ? "selected" : ""
          }`}
          onClick={() => handleOptionChange("user")}
          to="/dashboard/user"
        >
          <span className="icon">
            <LuUsersRound />
          </span>
          {!isCollapsed && <span>Gestión de usuarios</span>}
        </Link>
        <Link
          className={`navbar-item ${
            selectedOption === "property" ? "selected" : ""
          }`}
          onClick={() => handleOptionChange("property")}
          to="/dashboard/property"
        >
          <span className="icon">
            <TbMapSearch />
          </span>
          {!isCollapsed && <span>Gestión de predios</span>}
        </Link>
        <Link
          className={`navbar-item ${
            selectedOption === "properties" ? "selected" : ""
          }`}
          onClick={() => handleOptionChange("properties")}
          to="/dashboard/properties"
        >
          <span className="icon">
            <TbMapSearch />
          </span>
          {!isCollapsed && <span>Mis predios y lotes</span>}
        </Link>
        <Link
          className={`navbar-item ${
            selectedOption === "consumption" ? "selected" : ""
          }`}
          onClick={() => handleOptionChange("consumption")}
          to="/dashboard/consumption"
        >
          <span className="icon">
            <MdOutlineWaterDrop />
          </span>
          {!isCollapsed && <span>Mis consumos</span>}
        </Link>
        <Link
          className={`navbar-item ${
            selectedOption === "bill" ? "selected" : ""
          }`}
          onClick={() => handleOptionChange("bill")}
          to="/dashboard/bill"
        >
          <span className="icon">
            <LuWallet />
          </span>
          {!isCollapsed && <span>Mis facturas y pagos</span>}
        </Link>
        <Link
          className={`navbar-item ${
            selectedOption === "report" ? "selected" : ""
          }`}
          onClick={() => handleOptionChange("report")}
          to="/dashboard/report"
        >
          <span className="icon">
            <TbReport />
          </span>
          {!isCollapsed && <span>Mis reportes de fallos</span>}
        </Link>
        <Link
          className={`navbar-item ${
            selectedOption === "profile" ? "selected" : ""
          }`}
          onClick={() => handleOptionChange("profile")}
          to="/dashboard/profile"
        >
          <span className="icon">
            <FiUsers />
          </span>
          {!isCollapsed && <span>Mi cuenta</span>}
        </Link>
        <div className="separator separator-sidebar"></div>
        <Link className="navbar-item" to="/login" onClick={handleSignUp}>
          <span className="icon">
            <RiLogoutBoxRLine />
          </span>
          {!isCollapsed && <span>Cerrar Sesión</span>}
        </Link>
      </div>
    </>
  );
};

export default Option_user;
