import { useState } from "react";
import Head from "./Head";
import { FaCamera, FaEdit } from "react-icons/fa";

const Profile = () => {
  const head_data = {
    title: "Mi perfil",
    description: "En esta sección podrás visualizar y editar tu información personal",
  };
  const [isPersonalModalOpen, setIsPersonalModalOpen] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);


  const [user] = useState({
    name: "Nombre del usuario",
    birthdate: "Fecha de nacimiento",
    documentType: "Tipo de documento",
    documentNumber: "No. de documento",
    personType: "Tipo de persona",
    gender: "Género",
    email: "Correo Electrónico",
    phone: "Teléfono",
    address: "Dirección",
    password: "************",
  });
  
  const [formData, setFormData] = useState({
    genero: "",
    direccion: "",
    telefono: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Head head_data={head_data} />
      <div className="container profile-container p-4">
        {/* Sección del perfil */}
        <div className=" profile-box">
          <div className="media">
            <div className="media-left">
              <figure className="image is-128x128 profile-image">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135768.png"
                  alt="Perfil"
                  className="is-rounded"
                />
              </figure>
              <button className="button is-small is-light mt-2 profile-btn">
                <FaCamera className="mr-2" />
              </button>
            </div>
            <div className="media-content">
              <h2 className="title is-5"><strong>{user.name}</strong></h2>
              <p className="subtitle is-6">[{user.birthdate}]</p>
            </div>
          </div>
        </div>

        {/* Información Personal */}
        <div className="profile-box">
          <div className="level">
            <h3 className="title is-5">Información personal</h3>
            <button className="button is-small is-light" onClick={() => setIsPersonalModalOpen(true)}>
              <FaEdit className="mr-2"/> Editar
            </button>  
          </div>

          {/* Modal */}
      {isPersonalModalOpen && (
        <div className="modal is-active">
          <div className="modal-background" onClick={() => setIsPersonalModalOpen(false)}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Editar mi información</p>
              <button className="delete" aria-label="close" onClick={() => setIsPersonalModalOpen(false)}></button>
            </header>
            <section className="modal-card-body">
              <div className="field">
                <label className="label">Género</label>
                <div className="control">
                  <div className="select is-fullwidth">
                    <select name="genero" value={formData.genero} onChange={handleChange}>
                      <option value="">Seleccione una opción</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Femenino">Femenino</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="field">
                <label className="label">Dirección</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    placeholder="Dirección"
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Teléfono</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="Teléfono"
                  />
                </div>
              </div>
            </section>
            <footer className="modal-card-foot is-flex is-justify-content-center">
              <button className="button is-danger" onClick={() => setIsPersonalModalOpen(false)}>
                Cancelar
              </button>
              <button className="button confirm-button">
                Confirmar
              </button>
            </footer>
          </div>
        </div>
      )}

          <div className="columns is-multiline">
            <div className="column is-half"><strong>Tipo de documento</strong><br />[{user.documentType}]</div>
            <div className="column is-half"><strong>Número de documento</strong><br />[{user.documentNumber}]</div>
            <div className="column is-half"><strong>Tipo de persona</strong><br />[{user.personType}]</div>
            <div className="column is-half"><strong>Género</strong><br />[{user.gender}]</div>
            <div className="column is-half"><strong>Correo electrónico</strong><br />[{user.email}]</div>
            <div className="column is-half"><strong>Teléfono</strong><br />[{user.phone}]</div>
            <div className="column is-full"><strong>Dirección de correspondencia</strong><br />[{user.address}]</div>
          </div>
        </div>

        {/* Cuenta y Seguridad */}
        <div className="profile-box">
          <div className="level">
            <h3 className="title is-5">Cuenta y Seguridad</h3>
            <button className="button is-small is-light" onClick={() => setIsSecurityModalOpen(true)}>
              <FaEdit className="mr-2"/> Editar
            </button>      
          </div>

      {/* Modal */}
      {isSecurityModalOpen && (
      <div className="modal is-active">
        <div className="modal-background" onClick={() => setIsSecurityModalOpen(false)}></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Editar Seguridad y acceso</p>
            <button className="delete" aria-label="close" onClick={() => setIsSecurityModalOpen(false)}></button>
          </header>
          <section className="modal-card-body">
            <div className="field">
              <label className="label">Contraseña</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Contraseña Actual"
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Nueva Contraseña</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="password1"
                  value={formData.password1}
                  onChange={handleChange}
                  placeholder="Contraseña Nueva"
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Confirmar Contraseña</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="password2"
                  value={formData.password2}
                  onChange={handleChange}
                  placeholder="Confirmar Nueva Contraseña"
                />
              </div>
            </div>
          </section>
          <footer className="modal-card-foot is-flex is-justify-content-center">
            <button className="button is-danger" onClick={() => setIsSecurityModalOpen(false)}>Cancelar</button>
            <button className="button confirm-button">Confirmar</button>
          </footer>
        </div>
      </div>
      )}

          <div className="columns">
            <div className="column"><strong>Correo Electrónico</strong><br />[{user.email}]</div>
            <div className="column"><strong>Contraseña</strong><br />{user.password}</div>
          </div>
        </div>
      </div>
    </>



  );
};

export default Profile;
