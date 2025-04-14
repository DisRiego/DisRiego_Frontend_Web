import Icon from "../Icon";

const Head = ({ head_data, onButtonClick, loading, buttonDisabled }) => {
  const renderButtons = () => {
    if (!head_data.buttons || Object.keys(head_data.buttons).length === 0) {
      return null;
    }

    return Object.keys(head_data.buttons).map((key) => {
      const button = head_data.buttons[key];
      const IconComponent = Icon[button.icon];
      const isLoading = button.text === "Descargar reporte" ? loading : "";

      return (
        <button
          key={key}
          className={`button ${button.class} ${isLoading}`}
          onClick={() => onButtonClick(button.text)}
          disabled={buttonDisabled}
        >
          {IconComponent ? (
            <>
              <span className="icon">
                <IconComponent />
              </span>
              <span>{button.text}</span>
            </>
          ) : (
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
