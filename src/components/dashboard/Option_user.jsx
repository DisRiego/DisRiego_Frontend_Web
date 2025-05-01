import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { MdOutlineWaterDrop } from "react-icons/md";
import { FiUsers } from "react-icons/fi";
import { HiOutlineBell } from "react-icons/hi";
import { TbMapSearch, TbReport, TbLogout } from "react-icons/tb";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { LuUserCog } from "react-icons/lu";
import { LuUsersRound } from "react-icons/lu";
import { IoHomeOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { TbServerBolt } from "react-icons/tb";
import { FiSettings } from "react-icons/fi";
import { TbWallet } from "react-icons/tb";
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
      permission: "Ver notificaciones",
      path: "/dashboard/notification",
      selectoption: "notification",
      icon: <HiOutlineBell />,
      label: "Notificaciones",
    },
    {
      permission: [
        "Ver detalles de la empresa",
        "Ver todos los certificados digitales",
        "Ver todos los tipos de cultivos",
        "Ver todos los intervalos de pagos",
        "Ver todas las tarifas",
      ],
      path: "/dashboard/company",
      selectoption: "company",
      icon: <IoHomeOutline />,
      label: "Gestión de empresa",
    },
    {
      permission: ["Ver todos los roles"],
      path: "/dashboard/rol",
      selectoption: "rol",
      icon: <LuUserCog />,
      label: "Gestión de roles",
    },
    {
      permission: ["Ver todos los usuarios"],
      path: "/dashboard/user",
      selectoption: "user",
      icon: <LuUsersRound />,
      label: "Gestión de usuarios",
    },
    {
      permission: ["Ver todos los predios"],
      path: "/dashboard/property",
      selectoption: "property",
      icon: <TbMapSearch />,
      label: "Gestión de predios",
    },
    {
      permission: "Ver todos los predios de un usuario",
      path: "/dashboard/properties",
      selectoption: "properties",
      icon: <TbMapSearch />,
      label: "Mis predios y lotes",
    },
    {
      permission: "Ver todos los dispositivos",
      path: "/dashboard/device",
      selectoption: "device",
      icon: <TbServerBolt />,
      label: "Gestión de dispositivos",
    },
    {
      permission: [
        "Ver todos los fallos autogenerados por el sistema",
        "Ver todos los fallos autogenerados asignados a un técnico",
        "Ver todos los reportes de fallo",
        "Ver todos los reportes de fallos asignados a un técnico",
      ],
      path: "/dashboard/system",
      selectoption: "system",
      icon: <FiSettings />,
      label: "Gest. mantenimientos",
    },
    {
      permission: [
        "Ver todos los fallos autogenerados para un usuario",
        "Ver todos los reportes de fallos para un usuario",
      ],
      path: "/dashboard/system",
      selectoption: "system",
      icon: <FiSettings />,
      label: "Mis fallos y reportes",
    },
    {
      permission: [""],
      path: "/dashboard/billing",
      selectoption: "billing",
      icon: <TbWallet />,
      label: "Gestión de facturación",
    },
  ];

  const optionsFiltered = optionsMenu.filter((option) => {
    if (Array.isArray(option.permission)) {
      // Solo para Gestión de empresa, exigir Ver detalles de la empresa
      if (option.selectoption === "company") {
        return permissionsUser.includes("Ver detalles de la empresa");
      }
      // Para otras opciones con array, se permite si tiene al menos uno
      return option.permission.some((perm) => permissionsUser.includes(perm));
    } else {
      return permissionsUser.includes(option.permission);
    }
  });

  const getSelectedOption = (pathname) => {
    const companyRelatedOptions = ["certificate", "crop", "payment", "rates"];
    if (companyRelatedOptions.includes(selectedOption)) return "company";

    const notificationdOptions = ["notification", "request"];
    if (notificationdOptions.includes(selectedOption)) return "notification";

    const maintenanceOptions = ["system", "report"];
    if (maintenanceOptions.includes(selectedOption)) return "system";

    const billingOptions = ["billing", "transaction"];
    if (billingOptions.includes(selectedOption)) return "billing";

    const propertyRegex = /^\/dashboard\/property(\/\d+)?(\/lot\/\d+)?$/;
    if (propertyRegex.test(pathname)) return "property";

    return selectedOption;
  };
  return (
    <>
      <div className="sidebar-options">
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
