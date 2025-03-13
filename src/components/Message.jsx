const Message = ({ onClose, status, titleMessage, message }) => {
  return (
    <>
      <article className="message">
        <div className={"message-header " + status}>
          <p className="has-text-black">{titleMessage}</p>
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
