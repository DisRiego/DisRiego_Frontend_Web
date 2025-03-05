import React from "react";

const DetallesRol = ({ role }) => {
  return (
    <div className="rol-detail container mt-5">
      <nav className="rol-detail__breadcrumb breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li><a href="#">Gestión de roles</a></li>
          <li className="is-active"><a href="#" aria-current="page">Detalles del rol #{role.id}</a></li>
        </ul>
      </nav>

      <div>
        <h2 className="rol-detail__title title is-4">Detalles del rol #{role.id}</h2>
        <p className="rol-detail__subtitle subtitle">En esta sección, puedes consultar la información del rol seleccionado.</p>

        {/* Información del rol */}
        <div className="rol-detail__box custom-box">
          <div className="is-flex is-justify-content-space-between is-align-items-center">
            <h3 className="rol-detail__title title is-6">Estado actual</h3>
            <span className="tag is-success">{role.estado}</span>
          </div>
          <h3 className="rol-detail__title title is-6">Nombre del rol</h3>
          <p>{role.nombre}</p>
          <h3 className="rol-detail__title title is-6 mt-3">Descripción</h3>
          <p>{role.descripcion}</p>
        </div>

        {/* Permisos */}
        {role.permisos.map((modulo, index) => (
          <div key={index} className="rol-detail__box custom-box">
            <h3 className="rol-detail__title title is-6">
              Permisos <span className="has-text-grey-light">(Módulo {modulo.nombre})</span>
            </h3>
            <ul>
              {modulo.permisos.map((permiso, idx) => (
                <li key={idx}> - {permiso}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

// Ejemplo de datos para probar con permisos agregados
const roleData = {
  id: 101,
  nombre: "Administrador",
  descripcion: "Tiene acceso total a la plataforma.",
  estado: "Operativo",
  permisos: [
    {
      nombre: "gestión de usuarios",
      permisos: ["Crear usuario", "Editar usuario", "Eliminar usuario"],
    },
    {
      nombre: "gestión de roles",
      permisos: ["Crear rol", "Editar rol", "Asignar permisos"],
    },
  ],
};

const App = () => {
  return <DetallesRol role={roleData} />;
};

export default App;
