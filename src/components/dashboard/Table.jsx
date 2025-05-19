import { useEffect, useRef, useState } from "react";
import { SlOptionsVertical } from "react-icons/sl";
import Icon from "../Icon";

const OptionsButton = ({ onClick }) => (
  <button className="button is-small button-option" onClick={onClick}>
    <SlOptionsVertical />
  </button>
);

const Table = ({ columns, data, options }) => {
  const [activeRow, setActiveRow] = useState(null);
  const menuRefs = useRef({});

  useEffect(() => {
    const handleOutsideClick = (event) => {
      const clickedOutside =
        !Object.values(menuRefs.current).some(
          (ref) => ref && ref.contains(event.target)
        ) &&
        !event.target.closest(".button-option"); // Incluye el botón en la validación

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
    console.log(`Option selected: ${option.name}`, row);
  };

  return (
    <div className="table-container">
      <table className="table is-fullwidth is-striped is-hoverable">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, colIndex) => (
                <td key={`${rowIndex}-${colIndex}`}>
                  {column === "Opciones" ? (
                    <div
                      className="is-relative"
                      ref={(el) => {
                        if (el) menuRefs.current[rowIndex] = el;
                        else delete menuRefs.current[rowIndex]; // Limpia referencias obsoletas
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
    </div>
  );
};

export default Table;
