import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import { TbServerBolt } from "react-icons/tb";
import { jwtDecode } from "jwt-decode";

const Option_user = ({ handleOptionChange, selectedOption, isCollapsed }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [permissionsUser, setPermissionsUser] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      navigate("/login");
      return;
    }

    setToken(storedToken);

    try {
      const decoded = jwtDecode(storedToken);
      const permisos =
        decoded.rol?.flatMap((rol) => rol.permisos?.map((p) => p.name) || []) ||
        [];
      setPermissionsUser(permisos);
      console.log(permisos);

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

  const handleSignUp = async () => {
    try {
      await axios.post(
        import.meta.env.VITE_URI_BACKEND +
          import.meta.env.VITE_ROUTE_BACKEND_LOGOUT,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      if (error.response?.status === 400) {
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
      permission: "Editar Predios y Lote",
      path: "/dashboard/properties",
      selectoption: "properties",
      icon: <TbMapSearch />,
      label: "Mis predios y lotes",
    },
  ];

  const optionsFiltered = optionsMenu.filter((option) =>
    Array.isArray(option.permission)
      ? permissionsUser.length > 0 &&
        option.permission.some((perm) => permissionsUser.includes(perm))
      : permissionsUser.includes(option.permission)
  );

  const getSelectedOption = (pathname) => {
    const companyRelatedOptions = ["certificate", "crop", "payment", "rates"];
    if (companyRelatedOptions.includes(selectedOption)) return "company";

    const notificationdOptions = ["notification", "request"];
    if (notificationdOptions.includes(selectedOption)) return "notification";

    const propertyRegex = /^\/dashboard\/property(\/\d+)?(\/lot\/\d+)?$/;
    if (propertyRegex.test(pathname)) return "property";

    return selectedOption;
  };
  return (
    <>
      <div className="sidebar-options">
        <Link
          className={`navbar-item ${
            getSelectedOption() === "notification" ? "selected" : ""
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
              getSelectedOption() === option.selectoption ? "selected" : ""
            }`}
            onClick={() => handleOptionChange(option.selectoption)}
            to={option.path}
          >
            <span className="icon">{option.icon}</span>
            {!isCollapsed && <span>{option.label}</span>}
          </Link>
        ))}

        <Link
          className={`navbar-item ${
            getSelectedOption() === "device" ? "selected" : ""
          }`}
          onClick={() => handleOptionChange("iot")}
          to="/dashboard/device"
        >
          <span className="icon">
            <TbServerBolt />
          </span>
          {!isCollapsed && <span>Gestión de dispositivos</span>}
        </Link>

        <Link
          className={`navbar-item ${
            getSelectedOption() === "profile" ? "selected" : ""
          }`}
          onClick={() => handleOptionChange("profile")}
          to="/dashboard/profile"
        >
          <span className="icon">
            <CgProfile />
          </span>
          {!isCollapsed && <span>Mi perfil</span>}
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
