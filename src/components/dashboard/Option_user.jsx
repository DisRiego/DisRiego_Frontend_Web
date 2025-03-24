import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { MdOutlineWaterDrop } from "react-icons/md";
import { FiUsers } from "react-icons/fi";
import { HiOutlineBell } from "react-icons/hi";
import { TbMapSearch, TbReport, TbLogout } from "react-icons/tb";
import { LuWallet } from "react-icons/lu";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { LuUserCog } from "react-icons/lu";
import { LuUsersRound } from "react-icons/lu";
import { IoHomeOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { jwtDecode } from "jwt-decode";

const Option_user = ({ handleOptionChange, selectedOption, isCollapsed }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [permissionsUser, setPermissionsUser] = useState([]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      navigate("/login");
      return;
    }

    setToken(storedToken);

    try {
      const decoded = jwtDecode(storedToken);
      console.log(decoded);
      const permisos = decoded.rol?.[0]?.permisos?.map((p) => p.name) || [];
      setPermissionsUser(permisos);

      if (permisos.length === 0) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  const handleSignUp = async (e) => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_URI_BACKEND +
          import.meta.env.VITE_ROUTE_BACKEND_LOGOUT,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      if (error.response.status === 400) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  const optionsMenu = [
    {
      permission: [
        "Editar Datos Empresa",
        "Adicionar Certificado",
        "Editar Certificado",
        "Crear Tipo Cultivo",
        "Editar Tipo Cultivo",
        "Inhabilitar Tipo Cultivo",
        "Crear Intervalo Pago",
        "Editar Intervalo Pago",
        "Inhabilitar Intervalo Pago",
      ],
      path: "/dashboard/company",
      selectoption: "company",
      icon: <IoHomeOutline />,
      label: "Gestión de empresa",
    },
    {
      permission: [
        "Crear Rol",
        "Editar Rol",
        "Inhabilitar Rol",
        "Habilitar Rol",
      ],
      path: "/dashboard/rol",
      selectoption: "rol",
      icon: <LuUserCog />,
      label: "Gestión de roles",
    },
    {
      permission: [
        "Crear Usuario",
        "Editar Usuario",
        "Inhabilitar Usuario",
        "Habilitar Usuario",
      ],
      path: "/dashboard/user",
      selectoption: "user",
      icon: <LuUsersRound />,
      label: "Gestión de usuarios",
    },
    {
      permission: [
        "Crear Predio",
        "Editar Predio",
        "Inhabilitar Predio",
        "Habilitar Predio",
      ],
      path: "/dashboard/property",
      selectoption: "property",
      icon: <TbMapSearch />,
      label: "Gestión de predios",
    },
    {
      permission: "Mis predios y lotes",
      path: "/dashboard/properties",
      selectoption: "properties",
      icon: <TbMapSearch />,
      label: "Mis predios y lotes",
    },
  ];

  const optionsFiltered = optionsMenu.filter((option) =>
    Array.isArray(option.permission)
      ? permissionsUser?.length > 0 &&
        option.permission.some((permission) =>
          permissionsUser.includes(permission)
        )
      : permissionsUser?.includes(option.permission)
  );

  return (
    <>
      <div className="sidebar-options">
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

          {optionsFiltered.map((option, index) => (
            <Link
              key={index}
              className={`navbar-item ${
                selectedOption === option.selectoption ? "selected" : ""
              }`}
              onClick={() => handleOptionChange(option.selectoption)}
              to={option.path}
            >
              <span className="icon">{option.icon}</span>
              {!isCollapsed && <span>{option.label}</span>}
            </Link>
          ))}
        </div>
        {/*<Link
          className={`navbar-item ${
            selectedOption === "company" ? "selected" : ""
          }`}
          onClick={() => handleOptionChange("company")}
          to="/dashboard/company"
        >
          <span className="icon">
            <IoHomeOutline />
          </span>
          {!isCollapsed && <span>Gestión de empresa</span>}
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
        </Link> */}
        {/* <Link
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
        </Link> */}
        <Link
          className={`navbar-item ${
            selectedOption === "profile" ? "selected" : ""
          }`}
          onClick={() => handleOptionChange("profile")}
          to="/dashboard/profile"
        >
          <span className="icon">
            <CgProfile />
          </span>
          {!isCollapsed && <span>Mi cuenta</span>}
        </Link>
        <div className="separator separator-sidebar"></div>
        <Link className="navbar-item" onClick={handleSignUp}>
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
