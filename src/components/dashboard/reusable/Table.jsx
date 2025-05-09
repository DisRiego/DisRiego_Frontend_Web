import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SlOptionsVertical } from "react-icons/sl";
import Icon from "../../Icon";
import { TbPointFilled } from "react-icons/tb";
import { IoDocument } from "react-icons/io5";

const OptionsButton = ({ onClick }) => (
  <button className="button is-small button-option" onClick={onClick}>
    <SlOptionsVertical />
  </button>
);

/**
  Componente Table:
  Muestra una tabla dinámica con opciones según el modulo en donde se encuentra (roles, usuarios, dispositivos, etc).

  @param {Array} columns - Columnas a mostrar en la tabla.
  @param {Array} data - Datos que se renderizan por fila.
  @param {Array} options - Opciones disponibles por fila (Editar, Habilitar, etc).
  @param {boolean} loadingTable - Indica si se está cargando la tabla.
  @param {Function} setId - Establece el ID del registro seleccionado.
  @param {Function} setIdTechnician - Establece el ID del técnico asignado.
  @param {Function} setTitle - Cambia el título del modal.
  @param {Function} setShowEdit - Abre el modal de edición.
  @param {Function} setShowEditUser - Abre el modal de edición del lote por parte de un usuario normal.
  @param {Function} setShowAssign - Abre modal para asignar dispositivos.
  @param {Function} setShowChangeStatus - Abre modal para cambiar estado.
  @param {Function} setShowFormReject - Abre formulario de rechazo de solicitud.
  @param {Function} setShowFinalize - Abre formulario de finalizar mantenimiento.
  @param {Function} setShowEditFinalize - Abre formulario de editar mantenimiento finalizado.
  @param {Function} setConfirMessage - Establece mensaje de confirmación.
  @param {Function} setTypeForm - Define el tipo de acción (editar, habilitar, etc).
  @param {string} parentComponent - Define el modulo en donde se encuentra (lote, user, etc).
  @param {string} route - Ruta actual (ej. property).
  @param {Function} setTypeAction - Define el tipo de acción para el modulo de dispositivos ("Asignar" o "Reasignar").
*/
const Table = ({
  columns,
  data,
  options,
  loadingTable,
  setId,
  setIdTechnician,
  setStatusName,
  setTitle,
  setShowEdit,
  setShowEditUser,
  setShowAssign,
  setShowChangeStatus,
  setShowFormReject,
  setShowFinalize,
  setShowEditFinalize,
  setConfirMessage,
  setTypeForm,
  parentComponent,
  route,
  setTypeAction,
  // setValveID
}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeRow, setActiveRow] = useState(null); // Almacena los datos de la fila en donde se hace clic (menú de opciones)
  const menuRefs = useRef({}); // Referencias para detectar clics fuera
  const [dots, setDots] = useState(""); // puntos de carga animados (...)

  /**
    Muestra puntos de carga animados mientras loadingTable está activo.
  */
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

  /**
    Cierra el menú de opciones si se hace clic fuera del componente.
  */
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

  /**
    Cambia la fila activa al hacer clic en el botón de opciones.
  */
  const handleClick = (rowIndex) => {
    setActiveRow((prevRow) => (prevRow === rowIndex ? null : rowIndex));
  };

  /**
    Maneja la lógica de cada opción según el modulo actual.
    Además, permite navegar, abrir modales o establecer mensajes según el caso.
  */
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
      setTitle("Denegar solicitud");
      setShowFormReject(true);
    }

    //Fallos autogenerados
    if (id === "system" && option.name === "Asignar responsable") {
      setTitle("Asignar responsable");
      setShowAssign(true);
    }
    if (id === "system" && option.name === "Editar responsable") {
      setTitle("Editar responsable");
      setTypeAction("edit");
      setShowAssign(true);
    }
    if (id === "system" && option.name === "Finalizar mantenimiento") {
      setTitle("Finalizar mantenimiento");
      // setIdTechnician(row["ID del responsable"]);
      setStatusName(row["Estado"]);
      setShowFinalize(true);
    }
    if (id === "system" && option.name === "Editar mantenimiento") {
      setTitle("Editar mantenimiento");
      // setIdTechnician(row["ID del responsable"]);
      setTypeAction("edit");
      setShowEditFinalize(true);
    }

    //Reportes de fallos
    if (id === "report" && option.name === "Editar reporte") {
      setTitle("Editar reporte");
      setShowEdit(true);
    }
    if (id === "report" && option.name === "Asignar responsable") {
      setTitle("Asignar responsable");
      setShowAssign(true);
    }
    if (id === "report" && option.name === "Editar responsable") {
      setTitle("Editar responsable");
      setTypeAction("edit");
      setShowAssign(true);
    }
    if (id === "report" && option.name === "Finalizar mantenimiento") {
      setTitle("Finalizar mantenimiento");
      // setIdTechnician(row["ID del responsable"]);
      setStatusName(row["Estado"]);
      setShowFinalize(true);
    }
    if (id === "report" && option.name === "Editar mantenimiento") {
      setTitle("Editar mantenimiento");
      // setIdTechnician(row["ID del responsable"]);
      setTypeAction("edit");
      setShowEditFinalize(true);
    }

    //Facturación
    if (id === "billing" && option.name === "Pagar") {
      navigate("pay/" + row.ID);
    }
  };

  /**
    Normaliza el estado de algunos dispositivos para mostrar en formato legible.
  */
  const getNormalizedStatus = (status) => {
    if (!status) return "";

    const normalized = status.toLowerCase();

    if (["en espera", "cerrada"].includes(normalized)) return "No operativo";
    if (normalized === "abierta") return "Operativo";

    return status;
  };

  return (
    <div className="table-container">
      <table className="table is-fullwidth is-striped is-hoverable">
        <thead>
          {/** Muestra todas las columnas excepto la que tenga el nombre "ID" */}
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
            // Si se está cargando la tabla, se muestra un loader animado
            <tr>
              <td colSpan={columns.length - 1} className="loader-cell">
                <div className="loader"></div>
                <p className="loader-text">Cargando información{dots}</p>
              </td>
            </tr>
          ) : data.length === 0 ? (
            // Si no hay datos, se muestra un mensaje indicando que no hay registros
            <tr>
              <td
                colSpan={columns.length /*- 1*/}
                className="no-data-cell has-text-centered is-vcentered"
              >
                No hay datos disponibles.
              </td>
            </tr>
          ) : (
            // Si hay datos, se renderizan las filas una por una
            data?.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns
                  .filter((column) => !["ID", "ID Predio"].includes(column))
                  .map((column, colIndex) => (
                    <td key={`${rowIndex}-${colIndex}`}>
                      {column === "Permisos" ? (
                        /**
                          Si la columna es "Permisos", se muestran hasta 4 permisos,
                          luego un contador indicando cuántos más hay.
                        */
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
                        /**
                          Si la columna es "Opciones", se muestra un botón con menú desplegable
                          con acciones específicas para ese modulo (las opciones pueden variar según la fila).
                        */
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
                          {activeRow === rowIndex &&
                            (() => {
                              const visibleOptions = options.filter(
                                (option) => {
                                  return true;
                                }
                              );

                              if (visibleOptions.length === 0) return null;

                              return (
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

                                        // Mostrar solo "Reasignar" si hay ID Lote
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
                                            // "Rechazada",
                                          ];
                                          if (
                                            !allowedStates.includes(
                                              row["Estado"]
                                            )
                                          )
                                            return false;
                                        }

                                        if (option.name === "Denegar") {
                                          const allowedStates = [
                                            "Pendiente",
                                            // "Aprobada",
                                          ];
                                          if (
                                            !allowedStates.includes(
                                              row["Estado"]
                                            )
                                          )
                                            return false;
                                        }

                                        const statesAllowingEditFault = [
                                          "Sin asignar",
                                        ];
                                        if (
                                          option.name === "Editar reporte" &&
                                          !statesAllowingEditFault.includes(
                                            row["Estado"]
                                          )
                                        ) {
                                          return false;
                                        }

                                        const statesAllowingEditAassignFault = [
                                          "Sin asignar",
                                        ];
                                        if (
                                          option.name ===
                                            "Asignar responsable" &&
                                          !statesAllowingEditAassignFault.includes(
                                            row["Estado"]
                                          )
                                        ) {
                                          return false;
                                        }

                                        const statesAllowingReassignFault = [
                                          "Pendiente",
                                        ];
                                        if (
                                          option.name ===
                                            "Editar responsable" &&
                                          !statesAllowingReassignFault.includes(
                                            row["Estado"]
                                          )
                                        ) {
                                          return false;
                                        }

                                        if (
                                          option.name ===
                                          "Finalizar mantenimiento"
                                        ) {
                                          const allowedStates = [
                                            "Pendiente",
                                            // "Rechazada",
                                          ];
                                          if (
                                            !allowedStates.includes(
                                              row["Estado"]
                                            )
                                          )
                                            return false;
                                        }

                                        const statesAllowingEditFinalize = [
                                          "Finalizado",
                                        ];
                                        if (
                                          option.name ===
                                            "Editar mantenimiento" &&
                                          !statesAllowingEditFinalize.includes(
                                            row["Estado"]
                                          )
                                        ) {
                                          return false;
                                        }

                                        const statesPay = [
                                          "Vencida",
                                          "Pendiente",
                                        ];
                                        if (
                                          option.name === "Pagar" &&
                                          !statesPay.includes(row["Estado"])
                                        ) {
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
                              );
                            })()}
                        </div>
                      ) : column === "Estado" ? (
                        (() => {
                          const displayedStatus = getNormalizedStatus(
                            row[column]
                          );
                          const className = `status-${displayedStatus
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`;

                          return (
                            <td
                              key={`${rowIndex}-${colIndex}`}
                              className={className}
                            >
                              <button className={`button ${className}`}>
                                <TbPointFilled className="mr-1" />
                                <p className="mr-1">{displayedStatus}</p>
                              </button>
                            </td>
                          );
                        })()
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
