const Message = ({ onClose, status, message }) => {
  console.log("Mostrando mensaje");
  return (
    <>
      <article className="message">
        <div className={"message-header " + status}>
          <p className="has-text-black">Prueba</p>
          <button
            onClick={onClose}
            className="delete"
            aria-label="delete"
          ></button>
        </div>
        <div className="message-body">{message}</div>
      </article>
    </>
  );
};

export default Message;
