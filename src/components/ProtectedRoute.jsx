import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children, requiredPermissions }) => {
  const token = localStorage.getItem("token");

  console.log("Renderizando ProtectedRoute para:", requiredPermissions);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const permisosUsuario = decoded.rol[0].permisos.map(
      (permiso) => permiso.name
    );

    const hasPermission = requiredPermissions.some((permiso) =>
      permisosUsuario.includes(permiso)
    );

    return hasPermission ? children : <Navigate to="/login" replace />;
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
