import Icon from "../../Icon";
/**
  Componente Head:
  Renderiza un encabezado con título, descripción y botones interactivos.
  
  @param {Object} props.head_data - Contiene título, descripción y botones.
  @param {Function} props.onButtonClick - Función llamada al hacer clic en un botón.
  @param {boolean} props.loading - Indica si hay una acción en carga (como descarga de reporte).
  @param {boolean} props.buttonDisabled - Deshabilita los botones si es verdadero.
*/
const Head = ({ head_data, onButtonClick, loading, buttonDisabled }) => {
  /**
    Función que genera los botones definidos en head_data.
    Si no hay botones definidos o el objeto está vacío, no se renderiza nada.
  */
  const renderButtons = () => {
    if (!head_data.buttons || Object.keys(head_data.buttons).length === 0) {
      return null;
    }

    /**
      Se itera sobre cada botón definido en head_data.buttons.
      Por cada uno, se obtiene su ícono correspondiente y se evalúa si debe estar en estado "loading".
    */
    return Object.keys(head_data.buttons).map((key) => {
      const button = head_data.buttons[key];
      const IconComponent = Icon[button.icon];
      /**
        Condición: si el botón es "Descargar reporte", se le aplica la clase de carga.
      */
      const isLoading = button.text === "Descargar reporte" ? loading : "";

      /**  Deshabilita  el botón si dice Descargar reporte o Solicitar apertura */
      const shouldDisable =
        (button.text === "Descargar reporte" ||
          button.text === "Solicitar apertura") &&
        buttonDisabled;

      return (
        <button
          key={key}
          className={`button ${button.class} ${isLoading}`}
          onClick={() => onButtonClick(button.text)}
          disabled={shouldDisable}
        >
          {IconComponent ? (
            /** Si existe ícono, se muestra junto al texto */
            <>
              <span className="icon">
                <IconComponent />
              </span>
              <span>{button.text}</span>
            </>
          ) : (
            /** Si no hay ícono, solo se muestra el texto */
            <span>{button.text}</span>
          )}
        </button>
      );
    });
  };

  return (
    <>
      <div className="container-head">
        <div className="container-text">
          <p className="title">{head_data.title}</p>
          {head_data.description ? <p>{head_data.description}</p> : ""}
        </div>
        <div className="container-button">{renderButtons()}</div>
      </div>
    </>
  );
};

export default Head;
