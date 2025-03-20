import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SlOptionsVertical } from "react-icons/sl";
import Form_edit_user from "./forms/edits/Form_edit_user";
import Form_edit_property from "./forms/edits/Form_edit_property";
import Form_edit_property_user from "./forms/edits/Form_edit_property_user";
import Form_edit_company_certificate from "./forms/edits/Form_edit_company_certificate";
import Change_status_rol from "./Status/Change_status_rol";
import Form_rol from "./forms/adds/Form_rol";
import Icon from "../Icon";

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
  setShowMessage,
  setTitleMessage,
  setMessage,
  setStatus,
  updateData,
  setId,
  title,
  setTitle,
  loading,
  setLoading,
  setShowChangeStatus,
  setConfirMessage,
  setTypeForm,
}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeRow, setActiveRow] = useState(null);
  const menuRefs = useRef({});
  const [showEditUser, setShowEditUser] = useState();
  const [showEditProperty, setShowEditProperty] = useState();
  const [showEditPropertyUser, setShowEditPropertyUser] = useState();
  const [showEditCertificate, setShowEditCertificate] = useState();
  const [idRow, setIdRow] = useState();
  const [selectedCertificate, setSelectedCertificate] = useState(null);
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
    setIdRow(row.ID);
    // setId(row.ID);
    if (option.name === "Ver detalles") {
      console.log("Entro tabla id");
      navigate(`${row.ID}`);
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
    if (id === "rol" && option.name === "Editar") {
      setTitle("Editar rol");
      setShowEditRol(true);
    }
    if (id === "user" && option.name === "Editar") {
      setShowEditUser(true);
    }
    if (id === "property" && option.name === "Editar") {
      setShowEditProperty(true);
    }
    if (id === "properties" && option.name === "Editar") {
      setShowEditPropertyUser(true);
    }
    if (id === "certificate" && option.name === "Editar") {
      setShowEditCertificate(true);
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
      {/* Usuarios */}
      {showEditUser && (
        <Form_edit_user
          title="Editar usuario"
          onClose={() => setShowEditUser(false)}
          idRow={idRow}
        />
      )}
      {showEditProperty && (
        <Form_edit_property
          title="Editar predio"
          onClose={() => setShowEditProperty(false)}
        />
      )}
      {showEditPropertyUser && (
        <Form_edit_property_user
          title="Editar predio"
          onClose={() => setShowEditPropertyUser(false)}
        />
      )}
      {showEditCertificate && (
        <Form_edit_company_certificate
          title="Editar certificado digital"
          onClose={() => setShowEditCertificate(false)}
        />
      )}
    </div>
  );
};

export default Table;
