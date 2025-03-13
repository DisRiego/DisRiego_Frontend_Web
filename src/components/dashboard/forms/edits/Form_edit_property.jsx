import { FaSearch } from "react-icons/fa";

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
            {/* Aqui van los inputs */}
            <form>
            <div className="field is-horizontal">
              <div className="field-body">
                <div className="field">
                  <label className="label">Tipo de documento</label>
                  <div className="control">
                    <div className="select is-fullwidth">
                      <select name="tipoDocumento">
                        <option value="">Seleccione</option>
                        <option value="CC">Cédula de Ciudadanía (CC)</option>
                        <option value="TI">Tarjeta de Identidad (TI)</option>
                        <option value="RC">Registro Civil (RC)</option>
                        <option value="CE">Cédula de Extranjería (CE)</option>
                        <option value="PA">Pasaporte (PA)</option>
                        <option value="NIT">Número de Identificación Tributaria (NIT)</option>
                        <option value="DNI">Documento Nacional de Identidad (DNI)</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="control is-expanded">
                  <label className="label">No. de documento</label>
                  <div className="field has-addons">
                    <div className="control is-expanded">
                      <input className="input" type="text" name="numeroDocumento" />
                    </div>
                    <div className="control" style={{ height: "100%" }}>
                        <button className="button" style={{ height: "100%", borderRadius: "6px" }}>
                          <FaSearch />
                        </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="field">
              <label className="label">Nombre del predio</label>
              <div className="control">
                <input className="input" type="text" name="nombrePredio" />
              </div>
            </div>

            <div className="field is-horizontal">
              <div className="field-body">
                <div className="field">
                  <label className="label">Número de folio inmobiliario</label>
                  <div className="control">
                    <input className="input" type="text" name="folioInmobiliario" />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Extensión (m²)</label>
                  <div className="control">
                    <input className="input" type="number" name="extension" />
                  </div>
                </div>
              </div>
            </div>

            <div className="field is-horizontal">
              <div className="field-body">
                <div className="field">
                  <label className="label">Latitud</label>
                  <div className="control">
                    <input className="input" type="text" name="latitud" />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Longitud</label>
                  <div className="control">
                    <input className="input" type="text" name="longitud" />
                  </div>
                </div>
              </div>
            </div>

            <div className="field">
              <label className="label">Escritura pública</label>
              <div className="file has-name is-fullwidth">
                <label className="file-label">
                  <input className="file-input" type="file" name="escrituraPublica" />
                  <span className="file-cta">
                    <span className="file-label">Subir archivo</span>
                  </span>
                </label>
              </div>
            </div>

            <div className="field">
              <label className="label">Certificado de libertad y tradición (CTL)</label>
              <div className="file has-name is-fullwidth">
                <label className="file-label">
                  <input className="file-input" type="file" name="ctl" />
                  <span className="file-cta">
                    <span className="file-label">Subir archivo</span>
                  </span>
                </label>
              </div>
            </div>
          </form>
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
