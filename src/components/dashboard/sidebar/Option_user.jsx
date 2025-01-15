import { Link } from "react-router-dom";
import { MdOutlineWaterDrop } from "react-icons/md";
import { FiUsers } from "react-icons/fi";
import { HiOutlineBell } from "react-icons/hi";
import { TbMapSearch, TbReport, TbLogout } from "react-icons/tb";
import { LuWallet } from "react-icons/lu";
import { RiLogoutBoxRLine } from "react-icons/ri";

const Option_user = ({ handleOptionChange, selectedOption, isCollapsed }) => {
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
            selectedOption === "property" ? "selected" : ""
          }`}
          onClick={() => handleOptionChange("property")}
          to="/dashboard/property"
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
            selectedOption === "report" || "detail" ? "selected" : ""
          }`}
          onClick={() => handleOptionChange("report")}
          to="/dashboard/report"
        >
          <span className="icon">
            <TbReport />
          </span>
          {!isCollapsed && <span>Reporte de fallos</span>}
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
        <div className="separator"></div>
        <button className="navbar-item">
          <span className="icon">
            <RiLogoutBoxRLine />
          </span>
          {!isCollapsed && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </>
  );
};

export default Option_user;
