import { Link } from "react-router-dom";

const Option_user = ({ handleOptionChange, selectedOption }) => {
  return (
    <>
        <div className="sidebar-options">
        <Link
          onClick={() => handleOptionChange("notification")}
          to="/dashboard/notification"
        >
          Notificaciones
        </Link>
        <Link
          onClick={() => handleOptionChange("property")}
          to="/dashboard/property"
        >
          Mis predios y lotes
        </Link>
        <Link
          onClick={() => handleOptionChange("consumption")}
          to="/dashboard/consumption"
        >
          Mis consumos
        </Link>
        <Link
          onClick={() => handleOptionChange("bill")}
          to="/dashboard/bill"
        >
          Mis facturas y pagos
        </Link>
        <Link
          onClick={() => handleOptionChange("report")}
          to="/dashboard/report"
        >
          Reporte de fallos
        </Link>
        <Link
          onClick={() => handleOptionChange("profile")}
          to="/dashboard/profile"
        >
          Mi cuenta
        </Link>
        <Link
        >
          Cerrar Sesión
        </Link>
      </div>
    </>
  )
}

export default Option_user