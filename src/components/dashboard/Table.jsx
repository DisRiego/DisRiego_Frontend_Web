import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SlOptionsVertical } from "react-icons/sl";
import Icon from "../Icon";
import { TbPointFilled } from "react-icons/tb";

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
  setShowChangeStatus,
  setConfirMessage,
  setTypeForm,
  parentComponent,
}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeRow, setActiveRow] = useState(null);
  const menuRefs = useRef({});
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);
    return () => clearInterval(interval);
  }, []);

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
      if (option.name === "Ver detalles") {
        navigate(`${row.ID}`);
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
    if (parentComponent === "lot" && option.name === "Editar") {
      setTitle("Editar usuario");
      setShowEdit(true);
    }
    if (parentComponent === "lot" && option.name === "Inhabilitar") {
      setConfirMessage(
        `¿Desea inhabilitar el predio "${row["Nombre del lote"]}"?`
      );
      setTypeForm("inhabilitar");
      setShowChangeStatus(true);
    }
    if (parentComponent === "lot" && option.name === "Habilitar") {
      setConfirMessage(
        `¿Desea habilitar el predio "${row["Nombre del lote"]}"?`
      );
      setTypeForm("habilitar");
      setShowChangeStatus(true);
    }

    //Lotes
    if (parentComponent === "certificate" && option.name === "Editar") {
      setTitle("Editar certificado");
      setShowEdit(true);
    }

    //Cultivos
    if (parentComponent === "crop" && option.name === "Editar") {
      setTitle("Editar cultivo");
      setShowEdit(true);
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
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns
                  .filter((column) => column !== "ID")
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
                                    if (
                                      option.name === "Habilitar" &&
                                      row["Estado"] === "Mantenimiento"
                                    ) {
                                      return false;
                                    }
                                    if (
                                      option.name === "Habilitar" &&
                                      row["Estado"] === "Pendiente"
                                    ) {
                                      return false;
                                    }
                                    if (
                                      option.name === "Habilitar" &&
                                      row["Estado"] === "Activo"
                                    ) {
                                      return false;
                                    }
                                    if (
                                      option.name === "Inhabilitar" &&
                                      row["Estado"] !== "Activo"
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
