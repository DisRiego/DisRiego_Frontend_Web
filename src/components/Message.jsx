const Message = () => {
  return (
    <>
      <div class="notification-container" id="successNotification">
        <div class="notification is-success is-light p-4">
          <button
            class="delete"
            onclick="hideNotification('successNotification')"
          ></button>
          <div class="media">
            <div class="media-left">
              <span class="icon has-text-success">
                <i class="fas fa-check-circle"></i>
              </span>
            </div>
            <div class="media-content">
              <p class="has-text-weight-bold">Creación de rol con éxito</p>
              <p>Se ha creado el rol correctamente</p>
            </div>
          </div>
        </div>
      </div>

      <div class="notification-container" id="errorNotification">
        <div class="notification is-danger is-light p-4">
          <button
            class="delete"
            onclick="hideNotification('errorNotification')"
          ></button>
          <div class="media">
            <div class="media-left">
              <span class="icon has-text-danger">
                <i class="fas fa-times-circle"></i>
              </span>
            </div>
            <div class="media-content">
              <p class="has-text-weight-bold">Creación de rol fallida</p>
              <p>No se pudo crear el rol, intente de nuevo</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Message;
