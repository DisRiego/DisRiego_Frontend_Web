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
        <button key={key} className={button.class}>
          {IconComponent && <IconComponent />}
          {button.text}
        </button>
      );
    });
  };

  return (
    <>
      <p className="">{data.title}</p>
      {data.description ? <p>{data.description}</p> : ""}
      <div className="buttons-container">{renderButtons()}</div>
    </>
  );
};

export default Head;
