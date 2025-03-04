import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SlOptionsVertical } from "react-icons/sl";
import Confirm_add_rol from "./confirm_view/confirm_add_rol";
import Icon from "../Icon";

const OptionsButton = ({ onClick }) => (
  <button className="button is-small button-option" onClick={onClick}>
    <SlOptionsVertical />
  </button>
);

const Table = ({ columns, data, options }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [confirMessage, setConfirMessage] = useState();
  const [showConfirm, setShowConfirm] = useState(false);
  const [activeRow, setActiveRow] = useState(null);
  const menuRefs = useRef({});

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
    if (option.name == "Ver detalles") {
      navigate(`${row.ID}`);
    }
    if (id == "rol") {
      if (option.name == "Inhabilitar") {
        setConfirMessage(
          '¿Desea inhabilitar el rol "' + row["Nombre del rol"] + '"?'
        );
        setShowConfirm(true);
      }
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
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns
                .filter((column) => column !== "ID")
                .map((column, colIndex) => (
                  <td key={`${rowIndex}-${colIndex}`}>
                    {column === "Permisos" && Array.isArray(row[column]) ? (
                      row[column].length > 4 ? (
                        <>
                          {row[column].slice(0, 4).map((permiso, index) => (
                            <span key={index}>
                              {permiso.nombre}
                              {index < 3 ? ", " : ""}
                            </span>
                          ))}
                          <span className="icon cont-table">
                            {" "}
                            +{row[column].length - 4}
                          </span>
                        </>
                      ) : (
                        row[column].map((permiso, index) => (
                          <span key={index}>
                            {permiso.nombre}
                            {index < row[column].length - 1 ? ", " : ""}
                          </span>
                        ))
                      )
                    ) : column === "Opciones" ? (
                      <div
                        className="is-relative"
                        ref={(el) => {
                          if (el) menuRefs.current[rowIndex] = el;
                          else delete menuRefs.current[rowIndex];
                        }}
                      >
                        <OptionsButton onClick={() => handleClick(rowIndex)} />
                        {activeRow === rowIndex && (
                          <div className="menu-option">
                            <div className="box">
                              {options.map((option, index) => {
                                const IconComponent = option.icon
                                  ? Icon[option.icon]
                                  : null;
                                return (
                                  <button
                                    key={index}
                                    className="button is-fullwidth"
                                    onClick={() => handleOption(option, row)}
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
                    ) : (
                      row[column] || "-"
                    )}
                  </td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>
      {showConfirm && (
        <>
          <Confirm_add_rol
            title="Filtros de rol"
            confirMessage={confirMessage}
            onClose={() => setShowConfirm(false)}
          />
        </>
      )}
    </div>
  );
};

export default Table;
