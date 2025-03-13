const Form_add_batch = ({ title, onClose }) => {
    return (
      <>
        <div className="modal is-active">
          <div className="modal-background" onClick={onClose}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">{title}</p>
              <button className="delete" aria-label="close" onClick={onClose}></button>
            </header>
            <section className="modal-card-body">
              <div className="field">
                <label className="label">Nombre del predio</label>
                <div className="control">
                  <input className="input" type="text" placeholder="Nombre del predio" />
                </div>
              </div>
              
              <div className="field">
                <label className="label">Nombre del lote</label>
                <div className="control">
                  <input className="input" type="text" placeholder="Nombre del lote" />
                </div>
              </div>
              
              <div className="field is-flex">
                <div className="control is-expanded">
                  <label className="label">Folio de matrícula inmobiliaria</label>
                  <input className="input" type="text" placeholder="Folio de matrícula" />
                </div>
                <div className="control is-expanded">
                  <label className="label">Extensión (m²)</label>
                  <input className="input" type="number" placeholder="Extensión del lote (m²)" />
                </div>
              </div>
              
              <div className="field is-flex">
                <div className="control is-expanded">
                  <label className="label">Latitud</label>
                  <input className="input" type="text" placeholder="Latitud" />
                </div>
                <div className="control is-expanded">
                  <label className="label">Longitud</label>
                  <input className="input" type="text" placeholder="Longitud" />
                </div>
              </div>
              
              <label className="label">Ubicación de la caseta</label>
              <div className="field is-flex">
                <div className="control is-expanded">
                  <input className="input" type="text" placeholder="Latitud" />
                </div>
                <div className="control is-expanded">
                  <input className="input" type="text" placeholder="Longitud" />
                </div>
              </div>
              
              <div className="field is-flex">
                <div className="control is-expanded">
                  <label className="label">Escritura pública</label>
                  <div className="file has-name is-boxed">
                    <label className="file-label">
                      <input className="file-input" type="file" />
                      <span className="file-cta">
                        <span className="file-icon">📄</span>
                        <span className="file-label">Haga click o arrastre y suelte el archivo</span>
                      </span>
                    </label>
                  </div>
                </div>
                <div className="control is-expanded">
                  <label className="label">CTL</label>
                  <div className="file has-name is-boxed">
                    <label className="file-label">
                      <input className="file-input" type="file" />
                      <span className="file-cta">
                        <span className="file-icon">📄</span>
                        <span className="file-label">Haga click o arrastre y suelte el archivo</span>
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </section>
            <footer className="modal-card-foot is-flex is-justify-content-center">
              <div className="buttons">
                <button className="button is-danger" onClick={onClose}>Cancelar</button>
                <button className="button is-success">Guardar</button>
              </div>
            </footer>
          </div>
        </div>
      </>
    );
  };
  
  export default Form_add_batch;
  