const Modal = ({ title, description, actionButton }) => {
  return (
    <>
      <div className="modal is-active">
        <div className="modal-background" onClick={actionButton}></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">{title}</p>
            <button
              className="delete"
              aria-label="close"
              onClick={actionButton}
            ></button>
          </header>
          <section className="modal-card-body padding-modal">
            <p className="">{description}</p>
          </section>
        </div>
      </div>
    </>
  );
};

export default Modal;
