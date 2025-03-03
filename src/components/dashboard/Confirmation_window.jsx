const Confirmation_window = () => {
  return (
    <>
      <div class="modal" id="confirmationModal">
        <div class="modal-background"></div>
        <div class="modal-card">
          <section class="modal-card-body">
            <p class="has-text-weight-semibold is-size-5">
              ¿Está seguro de realizar la siguiente acción?
            </p>
            <p class="mt-2">
              ¿Desea crear el rol con los siguientes permisos:{" "}
              <strong>[permisos]</strong>?
            </p>
            <div class="buttons is-centered mt-4">
              <button class="button btn-cancel" id="cancelBtn">
                No, cancelar
              </button>
              <button class="button btn-confirm" id="confirmBtn">
                Sí, confirmar
              </button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Confirmation_window;
