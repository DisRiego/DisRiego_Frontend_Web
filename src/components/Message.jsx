import React from "react";

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
        <div className="message-body custom-message-body">
          {message.split("\n").map((line, index) => (
            <span key={index} className="message-line">
              {line}
            </span>
          ))}
        </div>
      </article>
    </>
  );
};

export default Message;
