const Form_edit_property_user = ({ title, onClose }) => {
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
            {/* Aqui van los inputs */}
            <div className="field">
              <label className="label">Tipo de cultivo</label>
              <div className="control">
                <div className="select is-fullwidth">
                  <select>
                    <option value="">Seleccione una opción</option>
                    <option value="cultivo1">Cultivo 1</option>
                    <option value="cultivo2">Cultivo 2</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="field">
              <label className="label">Intervalo de pago</label>
              <div className="control">
                <div className="select is-fullwidth">
                  <select>
                    <option value="">Seleccione una opción</option>
                    <option value="mensual">Mensual</option>
                    <option value="trimestral">Trimestral</option>
                  </select>
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

export default Form_edit_property_user;
