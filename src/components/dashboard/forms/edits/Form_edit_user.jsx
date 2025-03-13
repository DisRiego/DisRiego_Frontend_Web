const Form_edit_user = ({ title, onClose }) => {
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
              <label className="label">Nombres</label>
              <div className="control">
                <input
                  className="input"
                  name="description"
                  placeholder="Descripción del rol"
                />
              </div>
            </div>
            <div className="columns">
              <div className="column">
                <div className="field">
                  <label className="label">Primer apellido</label>
                  <div className="control">
                    <input
                      className="input"
                      name="description"
                      placeholder="Descripción del rol"
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Tipo de documento</label>
                  <div className="control">
                    <input
                      className="input"
                      name="description"
                      placeholder="Descripción del rol"
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Tipo de documento</label>
                  <div className="control">
                    <input
                      className="input"
                      name="description"
                      placeholder="Descripción del rol"
                    />
                  </div>
                </div>
              </div>
              <div className="column">
                <div className="field">
                  <label className="label">Fecha de expedición</label>
                  <div className="control">
                    <input
                      className="input"
                      name="description"
                      placeholder="Descripción del rol"
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">N° Documento</label>
                  <div className="control">
                    <input
                      className="input"
                      name="description"
                      placeholder="Descripción del rol"
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Rol</label>
                  <div className="control">
                    <input
                      className="input"
                      name="description"
                      placeholder="Descripción del rol"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
          <footer className="modal-card-foot is-flex is-justify-content-center">
            <div className="buttons">
              <button className="button" onClick={onClose}>
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

export default Form_edit_user;
