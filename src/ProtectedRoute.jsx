import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useMemo } from "react";
import { useAuth } from "./AuthContext";

const permissionMapModules = {
  notification: ["Ver notificaciones"],
  request: [
    "Ver todas las solicitudes",
    "Ver todas las solicitudes de un usuario",
  ],
  rol: ["Ver todos los roles"],
  user: ["Ver todos los usuarios"],
  property: ["Ver todos los predios"],
  properties: ["Ver todos los predios de un usuario"],
  device: ["Ver todos los dispositivos"],
  report: ["Ver reportes"],
  company: ["Ver detalles de la empresa"],
  profile: [], // no requiere permisos
};

const permissionMapDetails = {
  request: ["Ver detalles de una solicitud"],
  rol: ["Ver detalles de un rol"],
  user: ["Ver detalles de un usuario"],
  property: ["Ver detalles de un predio"],
  properties: [
    "Ver detalles del predio de un usuario",
    "Ver detalles de un predio",
  ],
  device: [
    "Ver detalles de un dispositivo",
    "Ver detalles de los dispositivos del lote de un usuario",
  ],
  report: ["Ver detalles de un reporte"],
  company: ["Ver detalles de la empresa"],
};

const ProtectedRoute = ({ requiredPermissions = [] }) => {
  const { token, permissions, isLoading } = useAuth();
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  const isDashboardRoot = location.pathname === "/dashboard";
  const isProfileRoute = location.pathname === "/dashboard/profile";

  const moduleSegment = pathSegments.find((segment) =>
    Object.keys(permissionMapModules).includes(segment)
  );

  const isDetailView =
    !isDashboardRoot && !isProfileRoute && pathSegments.length >= 3;

  const permissionList = useMemo(() => {
    if (requiredPermissions.length) return requiredPermissions;
    return isDetailView
      ? permissionMapDetails[moduleSegment] || []
      : permissionMapModules[moduleSegment] || [];
  }, [requiredPermissions, isDetailView, moduleSegment]);

  if (isLoading) return null;

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (permissionList.length === 0) {
    return <Outlet />;
  }

  const hasPermission = permissionList.some((perm) =>
    permissions.includes(perm)
  );

  return hasPermission ? (
    <Outlet />
  ) : (
    <Navigate to="/dashboard/profile" replace />
  );
};

export default ProtectedRoute;
