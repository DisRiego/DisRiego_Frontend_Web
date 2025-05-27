import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiUsers } from "react-icons/fi";
import { HiOutlineBell } from "react-icons/hi";
import { TbMapSearch, TbReport, TbLogout } from "react-icons/tb";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { LuUserCog } from "react-icons/lu";
import { LuUsersRound } from "react-icons/lu";
import { IoHomeOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { TbServerBolt } from "react-icons/tb";
import { HiOutlineWrenchScrewdriver } from "react-icons/hi2";
import { TbWallet } from "react-icons/tb";
import { MdOutlineWaterDrop } from "react-icons/md";
import { jwtDecode } from "jwt-decode";

const Option_user = ({ handleOptionChange, selectedOption, isCollapsed }) => {
  const location = useLocation();
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
      icon: <HiOutlineWrenchScrewdriver />,
      label: "Gestión de mantenimiento",
    },
    {
      permission: [
        "Ver todos los fallos autogenerados para un usuario",
        "Ver todos los reportes de fallos para un usuario",
      ],
      path: "/dashboard/systems",
      selectoption: "systems",
      icon: <HiOutlineWrenchScrewdriver />,
      label: "Mis fallos y reportes",
    },
    {
      permission: ["Ver todas las facturas", "Ver todas las transacciones"],
      path: "/dashboard/invoice",
      selectoption: "invoice",
      icon: <TbWallet />,
      label: "Gestión de facturación",
    },
    {
      permission: ["Ver todas las facturas de un usuario"],
      path: "/dashboard/invoices",
      selectoption: "invoices",
      icon: <TbWallet />,
      label: "Mis facturas y pagos",
    },
    {
      permission: ["Ver todos los consumos"],
      path: "/dashboard/consumption",
      selectoption: "consumption",
      icon: <MdOutlineWaterDrop />,
      label: "Gestión de consumo",
    },
    {
      permission: ["Ver todos los consumos de un usuario"],
      path: "/dashboard/consumptions",
      selectoption: "consumptions",
      icon: <MdOutlineWaterDrop />,
      label: "Mis consumo",
    },
    {
      permission: ["Ver todos los eventos"],
      path: "/dashboard/audit",
      selectoption: "audit",
      icon: <TbReport />,
      label: "Auditoria",
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

  const getSelectedOption = () => {
    const path = location.pathname;

    if (path.startsWith("/dashboard/notification")) return "notification";
    if (path.startsWith("/dashboard/company")) return "company";
    if (path.startsWith("/dashboard/rol")) return "rol";
    if (path.startsWith("/dashboard/user")) return "user";
    if (path.startsWith("/dashboard/property")) return "property";
    if (path.startsWith("/dashboard/properties")) return "properties";
    if (path.startsWith("/dashboard/device")) return "device";
    if (path.startsWith("/dashboard/systems")) return "systems";
    if (path.startsWith("/dashboard/reports")) return "systems";
    if (path.startsWith("/dashboard/system")) return "system";
    if (path.startsWith("/dashboard/report")) return "system";
    if (path.startsWith("/dashboard/invoices")) return "invoices";
    if (path.startsWith("/dashboard/invoice")) return "invoice";
    if (path.startsWith("/dashboard/transaction")) return "invoice";
    if (path.startsWith("/dashboard/consumptions")) return "consumptions";
    if (path.startsWith("/dashboard/consumption")) return "consumption";
    if (path.startsWith("/dashboard/audit")) return "audit";
    if (path.startsWith("/dashboard/profile")) return "profile";

    return null;
  };

  return (
    <>
      <div className="sidebar-options">
        {optionsFiltered.map((option, index) => (
          <Link
            key={index}
            className={`navbar-item ${
              getSelectedOption(location.pathname) === option.selectoption
                ? "selected"
                : ""
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
