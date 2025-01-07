import Icon from "../Icon";

const Head = ({ data }) => {
  const renderButtons = () => {
    if (!data.buttons || Object.keys(data.buttons).length === 0) {
      return null;
    }

    return Object.keys(data.buttons).map((key) => {
      const button = data.buttons[key];
      const IconComponent = Icon[button.icon];

      return (
        <button key={key} className={"button " + button.class}>
          {IconComponent && <IconComponent />}
          {button.text}
        </button>
      );
    });
  };

  return (
    <>
      <div className="container-head">
        <div className="container-text">
        <p className="title">{data.title}</p>
        {data.description ? <p>{data.description}</p> : ""}
        </div>
        <div className="buttons">{renderButtons()}</div>
      </div>
    </>
  );
};

export default Head;
