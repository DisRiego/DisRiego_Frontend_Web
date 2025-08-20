import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useMemo } from "react";
import { useAuth } from "./AuthContext";

const permissionMapModules = {
  notification: ["Ver notificaciones"],
  request: [
    "Ver todas las solicitudes",
    "Ver todas las solicitudes de un usuario",
  ],
  company: ["Ver detalles de la empresa"],
  rol: ["Ver todos los roles"],
  user: ["Ver todos los usuarios"],
  property: ["Ver todos los predios"],
  properties: ["Ver todos los predios de un usuario"],
  device: ["Ver todos los dispositivos"],
  system: [
    "Ver todos los fallos autogenerados por el sistema",
    "Ver todos los fallos autogenerados asignados a un técnico",
  ],
  report: [
    "Ver todos los reportes de fallo",
    "Ver todos los reportes de fallos asignados a un técnico",
  ],
  systems: ["Ver todos los fallos autogenerados para un usuario"],
  reports: ["Ver todos los reportes de fallos para un usuario"],
  invoice: ["Ver todas las facturas"],
  invoices: ["Ver todas las facturas de un usuario"],
  consumptions: ["Ver todos los consumos de un usuario"],
  consumption: ["Ver todos los consumos"],
  audit: ["Ver todos los eventos"],
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
  system: ["Ver detalles de un fallo autogenerado"],
  report: ["Ver detalles de un reporte de fallo"],
  systems: ["Ver detalles de un fallo autogenerado para un usuario"],
  reports: ["Ver detalles de un reporte de fallo para un usuario"],
  pay: ["Pagar una factura"],
  payment: ["Pagar una factura de un usuario", "Pagar una factura"],
  invoice: ["Ver detalles de una factura"],
  invoices: ["Ver detalles de una factura de un usuario"],
  transaction: ["Ver detalles de una transacción"],
  consumptions: ["Ver detalles de un consumo de un usuario"],
  consumption: ["Ver detalles de un consumo"],
  audit: ["Ver los detalles de un evento"],
  company: ["Ver detalles de la empresa"],
};

const ProtectedRoute = ({ requiredPermissions = [] }) => {
  const { token, permissions, isLoading } = useAuth();
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  const isDashboardRoot = location.pathname === "/dashboard";
  const isProfileRoute = location.pathname === "/dashboard/profile";

  // Detectar si es vista de detalle tipo /dashboard/module/action/id
  const isDetailView = pathSegments.length >= 4;

  // Extraer segmento relevante del path para detalle o módulo
  const detailSegment = pathSegments[pathSegments.length - 2]; // ej: 'pay' en /dashboard/invoice/pay/63
  const moduleSegment = pathSegments.find((segment) =>
    Object.keys(permissionMapModules).includes(segment)
  );

  const permissionList = useMemo(() => {
    if (requiredPermissions.length > 0) return requiredPermissions;

    if (isDetailView && permissionMapDetails[detailSegment]) {
      return permissionMapDetails[detailSegment];
    }

    return permissionMapModules[moduleSegment] || [];
  }, [requiredPermissions, isDetailView, detailSegment, moduleSegment]);

  if (isLoading) return null;

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Si no se requieren permisos explícitos
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
