import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Icon from "../assets/icons/DisRiego.svg";
import IconGoogle from "../img/icon/iconGoogle.svg";
import IconOutlook from "../img/icon/iconOutlook.svg";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(import.meta.env.URI_USER + "/login", {
        email,
        password,
      });

      setMessage(response.data.message);
      navigate("/dashboard");
    } catch (error) {
      setMessage(error.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="container-login">
      <div className="columns background-image">
        <div className="column is-4-tablet is-4-desktop is-4-widescreen is-offset-two-thirds is-one-third is-flex is-flex-direction-column is-justify-content-center form-container column-padding">
          <div className="">
            <div className="is-flex is-flex-direction-row	is-justify-content-center is-align-items-center title-mb">
              <img src={Icon} alt="Logo de la Empresa" className="icon-login" />
              <h2 className="title has-text-centered ">Dis Riego</h2>
            </div>

            <div className="field">
              <div className="buttons">
                <button className="button is-fullwidth">
                  <span className="icon">
                    <img src={IconGoogle} alt="Icono Club" />
                  </span>
                  <p>Google</p>
                </button>
                <button className="button is-fullwidth">
                  <span className="icon">
                    <img src={IconOutlook} alt="Icono Club" />
                  </span>
                  <p>Microsoft</p>
                </button>
              </div>
            </div>

            <div className="field">
              <div className="separator">
                <p>O</p>
              </div>
            </div>

            <form className="" onSubmit={handleLogin}>
              <div className="field">
                <div className="control">
                  <input
                    type="email"
                    className="input input-padding"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <input
                    type="password"
                    className="input input-padding"
                    value={password}
                    placeholder="Contraseña"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="button is-fullwidth is-primary button-login"
              >
                Iniciar Sesión
              </button>
            </form>

            <div className="has-text-centered">
              <span>¿No tienes cuenta? </span>
              <Link to="/signup">Haz clic aquí.</Link>
            </div>
          </div>
        </div>
        {message && (
          <p className="has-text-danger has-text-centered m-3">{message}</p>
        )}
      </div>
    </div>
  );
};

export default Login;
