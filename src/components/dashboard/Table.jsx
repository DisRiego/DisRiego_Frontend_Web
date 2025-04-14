import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SlOptionsVertical } from "react-icons/sl";
import Icon from "../Icon";
import { TbPointFilled } from "react-icons/tb";
import { IoDocument } from "react-icons/io5";

const OptionsButton = ({ onClick }) => (
  <button className="button is-small button-option" onClick={onClick}>
    <SlOptionsVertical />
  </button>
);

const Table = ({
  columns,
  data,
  options,
  loadingTable,
  setId,
  setTitle,
  setShowEdit,
  setShowEditUser,
  setShowAssign,
  setShowChangeStatus,
  setConfirMessage,
  setTypeForm,
  parentComponent,
  route,
  setTypeAction,
  // setValveID
}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeRow, setActiveRow] = useState(null);
  const menuRefs = useRef({});
  const [dots, setDots] = useState("");

  useEffect(() => {
    let intervalId;

    if (loadingTable) {
      intervalId = setInterval(() => {
        setDots((prev) => (prev.length < 3 ? prev + "." : ""));
      }, 500);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [loadingTable]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      const clickedOutside =
        !Object.values(menuRefs.current).some(
          (ref) => ref && ref.contains(event.target)
        ) && !event.target.closest(".button-option");

      if (clickedOutside) {
        setActiveRow(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleClick = (rowIndex) => {
    setActiveRow((prevRow) => (prevRow === rowIndex ? null : rowIndex));
  };

  const handleOption = async (option, row) => {
    // setIdRow(row.ID);
    setId(row.ID);

    if (option.name === "Ver detalles" && parentComponent === "lot") {
      navigate(`lot/${row.ID}`);
    } else {
      if (option.name === "Ver detalles" && parentComponent === "device") {
        navigate(`device/${row.ID}`);
      } else {
        if (option.name === "Ver detalles") {
          navigate(`${row.ID}`);
        }
      }
    }

    // Funciones de Rol
    if (id === "rol" && option.name === "Editar") {
      setTitle("Editar rol");
      setShowEdit(true);
    }
    if (id === "rol" && option.name === "Inhabilitar") {
      setConfirMessage(`¿Desea inhabilitar el rol "${row["Nombre del rol"]}"?`);
      setTypeForm("inhabilitar");
      setShowChangeStatus(true);
    }
    if (id === "rol" && option.name === "Habilitar") {
      setConfirMessage(`¿Desea habilitar el rol "${row["Nombre del rol"]}"?`);
      setTypeForm("habilitar");
      setShowChangeStatus(true);
    }

    // Funciones de usuario
    if (id === "user" && option.name === "Editar") {
      setTitle("Editar usuario");
      setShowEdit(true);
    }
    if (id === "user" && option.name === "Inhabilitar") {
      setConfirMessage(`¿Desea inhabilitar el usuario "${row["Nombres"]}"?`);
      setTypeForm("inhabilitar");
      setShowChangeStatus(true);
    }
    if (id === "user" && option.name === "Habilitar") {
      setConfirMessage(`¿Desea habilitar el usuario "${row["Nombres"]}"?`);
      setTypeForm("habilitar");
      setShowChangeStatus(true);
    }

    //Predios
    if (id === "property" && option.name === "Editar") {
      setTitle("Editar predio");
      setShowEdit(true);
    }
    if (id === "property" && option.name === "Inhabilitar") {
      setConfirMessage(`¿Desea inhabilitar el predio "${row["Nombre"]}"?`);
      setTypeForm("inhabilitar");
      setShowChangeStatus(true);
    }
    if (id === "property" && option.name === "Habilitar") {
      setConfirMessage(`¿Desea habilitar el predio "${row["Nombre"]}"?`);
      setTypeForm("habilitar");
      setShowChangeStatus(true);
    }

    //Lotes

    if (route === "properties" && option.name === "Editar") {
      setTitle("Editar usuario");
      setShowEditUser(true);
    } else {
      if (parentComponent === "lot" && option.name === "Editar") {
        setTitle("Editar usuario");
        setShowEdit(true);
      }
    }
    if (parentComponent === "lot" && option.name === "Inhabilitar") {
      setConfirMessage(
        `¿Desea inhabilitar el lote "${row["Nombre del lote"]}"?`
      );
      setTypeForm("inhabilitar");
      setShowChangeStatus(true);
    }
    if (parentComponent === "lot" && option.name === "Habilitar") {
      setConfirMessage(`¿Desea habilitar el lote "${row["Nombre del lote"]}"?`);
      setTypeForm("habilitar");
      setShowChangeStatus(true);
    }

    //Certificados
    if (parentComponent === "certificate" && option.name === "Editar") {
      setTitle("Editar certificado");
      setShowEdit(true);
    }
    if (parentComponent === "certificate" && option.name === "Inhabilitar") {
      setConfirMessage(
        `¿Desea inhabilitar el certificado con número de serie #${row["Numéro de serie"]}?`
      );
      setTypeForm("inhabilitar");
      setShowChangeStatus(true);
    }
    if (parentComponent === "certificate" && option.name === "Habilitar") {
      setConfirMessage(
        `¿Desea habilitar el certificado con número de serie #${row["Numéro de serie"]}?`
      );
      setTypeForm("habilitar");
      setShowChangeStatus(true);
    }

    //Cultivos
    if (parentComponent === "crop" && option.name === "Editar") {
      setTitle("Editar cultivo");
      setShowEdit(true);
    }
    if (parentComponent === "crop" && option.name === "Inhabilitar") {
      setConfirMessage(
        `¿Desea inhabilitar el cultivo "${row["Nombre del cultivo"]}"?`
      );
      setTypeForm("inhabilitar");
      setShowChangeStatus(true);
    }
    if (parentComponent === "crop" && option.name === "Habilitar") {
      setConfirMessage(
        `¿Desea habilitar el cultvio "${row["Nombre del cultivo"]}"?`
      );
      setTypeForm("habilitar");
      setShowChangeStatus(true);
    }

    //Intervalo
    if (parentComponent === "crop" && option.name === "Eliminar") {
      setConfirMessage(
        `¿Desea eliminar el intervalo "${row["Nombre del intervalo"]}"?`
      );
      setTypeForm("eliminar");
      setShowChangeStatus(true);
    }

    //Dispositivos
    if (id === "device" && option.name === "Editar") {
      setTitle("Editar dispositivo");
      setShowEdit(true);
    }
    if (id === "device" && option.name === "Asignar") {
      setTitle("Asignar dispositivo");
      setTypeAction("Asignar");
      setShowAssign(true);
    }
    if (id === "device" && option.name === "Reasignar") {
      setTitle("Resignar dispositivo");
      setTypeAction("Reasignar");
      setShowAssign(true);
    }
    if (id === "device" && option.name === "Redirigir al lote") {
      navigate(`/dashboard/property/${row["ID Predio"]}/lot/${row["ID Lote"]}`);
    }
    if (id === "device" && option.name === "Inhabilitar") {
      setConfirMessage(
        `¿Desea inhabilitar el dispositivo "${row["Tipo de dispositivo"]}" identificado con el ID #${row["ID Dispositivo"]}?`
      );
      setTypeForm("inhabilitar");
      setShowChangeStatus(true);
    }
    if (id === "device" && option.name === "Habilitar") {
      setConfirMessage(
        `¿Desea habilitar el dispositivo "${row["Tipo de dispositivo"]}" identificado con el ID #${row["ID Dispositivo"]}?`
      );
      setTypeForm("habilitar");
      setShowChangeStatus(true);
    }

    //Dispositivos por lote
    if (option.name === "Editar" && parentComponent === "device") {
      setTitle("Editar dispositivo");
      setShowEdit(true);
    }
    if (option.name === "Inhabilitar" && parentComponent === "device") {
      setConfirMessage(
        `¿Desea inhabilitar el dispositivo "${row["Tipo de dispositivo"]}" identificado con el ID #${row.ID}?`
      );
      setTypeForm("inhabilitar");
      setShowChangeStatus(true);
    }
    if (option.name === "Habilitar" && parentComponent === "device") {
      setConfirMessage(
        `¿Desea habilitar el dispositivo "${row["Tipo de dispositivo"]}" identificado con el ID #${row.ID}?`
      );
      setTypeForm("habilitar");
      setShowChangeStatus(true);
    }

    //Solicitudes
    if (id === "request" && option.name === "Aprobar") {
      setConfirMessage(
        `¿Desea aprobar la solicitud con ID "${row["ID de la solicitud"]}"?`
      );
      setTypeForm("aprobar");
      setShowChangeStatus(true);
    }
    if (id === "request" && option.name === "Denegar") {
      setConfirMessage(
        `¿Desea denegar la solicitud con ID "${row["ID de la solicitud"]}"?`
      );
      setTypeForm("denegar");
      setShowChangeStatus(true);
    }
  };

  return (
    <div className="table-container">
      <table className="table is-fullwidth is-striped is-hoverable">
        <thead>
          <tr>
            {columns
              .filter((column) => column !== "ID")
              .map((column) => (
                <th key={column}>{column}</th>
              ))}
          </tr>
        </thead>
        <tbody>
          {loadingTable ? (
            <tr>
              <td colSpan={columns.length - 1} className="loader-cell">
                <div className="loader"></div>
                <p className="loader-text">Cargando información{dots}</p>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length - 1}
                className="no-data-cell has-text-centered is-vcentered"
              >
                No hay datos disponibles.
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns
                  .filter((column) => !["ID", "ID Predio"].includes(column))
                  .map((column, colIndex) => (
                    <td key={`${rowIndex}-${colIndex}`}>
                      {column === "Permisos" ? (
                        (() => {
                          const permisos = Array.isArray(row[column])
                            ? row[column]
                            : row[column].split(", ");

                          return permisos.length > 4 ? (
                            <>
                              {permisos.slice(0, 4).map((permiso, index) => (
                                <span key={index}>
                                  {permiso}
                                  {index < 3 ? ", " : ""}
                                </span>
                              ))}{" "}
                              <span className="icon cont-table">
                                {" "}
                                +{permisos.length - 4}
                              </span>
                            </>
                          ) : (
                            permisos.map((permiso, index) => (
                              <span key={index}>
                                {permiso}
                                {index < permisos.length - 1 ? ", " : ""}
                              </span>
                            ))
                          );
                        })()
                      ) : column === "Opciones" ? (
                        <div
                          className="is-relative"
                          ref={(el) => {
                            if (el) menuRefs.current[rowIndex] = el;
                            else delete menuRefs.current[rowIndex];
                          }}
                        >
                          <OptionsButton
                            onClick={() => handleClick(rowIndex)}
                          />
                          {activeRow === rowIndex && (
                            <div className="menu-option">
                              <div className="box">
                                {options
                                  .filter((option) => {
                                    // Ocultar opción "Habilitar" si ya está habilitado
                                    if (
                                      option.name === "Habilitar" &&
                                      [
                                        "Mantenimiento",
                                        "Pendiente",
                                        "Activo",
                                        "Fallo detectado",
                                        "En mantenimiento",
                                        "Operativo",
                                        "Sin instalar",
                                        "No Operativo",
                                      ].includes(row["Estado"])
                                    ) {
                                      return false;
                                    }

                                    // Estados que permiten inhabilitar
                                    const statesAllowingDisabling = [
                                      "Activo",
                                      "No Operativo",
                                    ];
                                    if (
                                      option.name === "Inhabilitar" &&
                                      !statesAllowingDisabling.includes(
                                        row["Estado"]
                                      )
                                    ) {
                                      return false;
                                    }

                                    // Ocultar "Editar" si está inactivo
                                    if (
                                      option.name === "Editar" &&
                                      row["Estado"] === "Inactivo"
                                    ) {
                                      return false;
                                    }

                                    // Mostrar solo "Asignar" si no hay ID Lote
                                    if (
                                      option.name === "Asignar" &&
                                      row["ID Lote"]
                                    ) {
                                      return false; // ya está asignado, no muestres Asignar
                                    }

                                    // Mostrar solo "Reasignar" si sí hay ID Lote
                                    const statesAllowingReassign = [
                                      "No Operativo",
                                    ];
                                    if (
                                      option.name === "Reasignar" &&
                                      !statesAllowingReassign.includes(
                                        row["Estado"]
                                      )
                                    ) {
                                      return false;
                                    }

                                    if (
                                      option.name === "Redirigir al lote" &&
                                      row["ID Lote"] === null
                                    ) {
                                      return false;
                                    }

                                    //Condiciones para las opciones de aprobar y denegar
                                    if (option.name === "Aprobar") {
                                      const allowedStates = [
                                        "Pendiente",
                                        "Rechazada",
                                      ];
                                      if (
                                        !allowedStates.includes(row["Estado"])
                                      )
                                        return false;
                                    }

                                    if (option.name === "Denegar") {
                                      const allowedStates = [
                                        "Pendiente",
                                        "Aprobada",
                                      ];
                                      if (
                                        !allowedStates.includes(row["Estado"])
                                      )
                                        return false;
                                    }

                                    return true;
                                  })

                                  .map((option, index) => {
                                    const IconComponent = option.icon
                                      ? Icon[option.icon]
                                      : null;
                                    return (
                                      <button
                                        key={index}
                                        className="button is-fullwidth"
                                        onClick={() =>
                                          handleOption(option, row)
                                        }
                                      >
                                        {IconComponent && (
                                          <span className="icon">
                                            <IconComponent />
                                          </span>
                                        )}
                                        <span>{option.name}</span>
                                      </button>
                                    );
                                  })}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : column === "Estado" ? (
                        <td
                          key={`${rowIndex}-${colIndex}`}
                          className={`status-${row[column]
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        >
                          <button
                            className={`button status-${row[column]
                              .toLowerCase()
                              .replace(/\s+/g, "-")}`}
                          >
                            <TbPointFilled className="mr-1" />
                            <p className="mr-1">{row[column]}</p>
                          </button>
                        </td>
                      ) : column === "Anexo" ? (
                        row[column] ? (
                          <div className="is-flex is-align-items-center">
                            <IoDocument className="icon-doc" />
                            <a
                              className="link-doc"
                              href={row[column]}
                              target="_blank"
                            >
                              Ver anexo
                            </a>
                          </div>
                        ) : (
                          "-"
                        )
                      ) : (
                        row[column] || "-"
                      )}
                    </td>
                  ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
