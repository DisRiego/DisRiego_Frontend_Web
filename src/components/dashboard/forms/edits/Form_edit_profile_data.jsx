const Form_edit_profile_data = ({ title, onClose }) => {
  return (
    <>
      <div className="modal is-active">
        <div className="modal-background" onClick={onClose}></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">{title}</p>
            <button
              className="delete"
              aria-label="close"
              onClick={onClose}
            ></button>
          </header>
          <section className="modal-card-body">
            <div className="field">
              <label className="label">Genero</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="genero"
                  placeholder="Ingresa tu genero"
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Dirección de residencia</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="address"
                  placeholder="Ingresa tu dirección de residencia"
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Número de celular</label>
              <div className="control">
                <input
                  className="input"
                  type="number"
                  name="number_phone"
                  placeholder="Ingresa tu número de celular"
                />
              </div>
            </div>
          </section>
          <footer className="modal-card-foot is-flex is-justify-content-center">
            <div className="buttons">
              <button className="button is-danger" onClick={onClose}>
                Cancelar
              </button>
              <button className="button color-hover">Guardar</button>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Form_edit_profile_data;
