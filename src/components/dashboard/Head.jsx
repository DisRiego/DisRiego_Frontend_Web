import Icon from "../Icon";

const Head = ({ head_data }) => {
  const renderButtons = () => {
    if (!head_data.buttons || Object.keys(head_data.buttons).length === 0) {
      return null;
    }

    return Object.keys(head_data.buttons).map((key) => {
      const button = head_data.buttons[key];
      const IconComponent = Icon[button.icon];

      return (
        <button key={key} className={"button " + button.class}>
          <span className="icon">
          {IconComponent && <IconComponent />}</span>
          <span>{button.text}</span>
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
