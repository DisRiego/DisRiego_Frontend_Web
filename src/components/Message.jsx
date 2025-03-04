const Message = ({ onClose }) => {
  console.log("Mostrando mensaje");
  return (
    <>
      <article class="message is-true">
        <div class="message-header is-true">
          <p className="has-text-black">Inhabilitación exitoso</p>
          <button onClick={onClose} class="delete" aria-label="delete"></button>
        </div>
        <div class="message-body">Se ha inhabilitado el rol correctamente</div>
      </article>
    </>
  );
};

export default Message;
