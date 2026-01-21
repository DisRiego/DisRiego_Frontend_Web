import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Icon from "../assets/icons/DisRiego.svg";
import { IoMdWarning } from "react-icons/io";

const SSOLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ssoToken = params.get("token");

    if (!ssoToken) {
      setError("Token SSO no encontrado.");
      setLoading(false);
      return;
    }

    const authenticateSSO = async () => {
      try {
        const response = await axios.post(
          import.meta.env.VITE_URI_BACKEND +
            import.meta.env.VITE_ROUTE_BACKEND_SSO_LOGIN,
          {
            sso_token: ssoToken,
          }
        );

        const accessToken = response.data.access_token;
        const decoded = jwtDecode(accessToken);

        // Guardar token (usa el mismo flujo que login normal)
        login(accessToken);

        // Limpia el token de la URL (buena práctica)
        window.history.replaceState({}, document.title, "/sso");

        if (decoded.first_login_complete === false) {
          navigate("/login/update-info");
        } else {
          navigate("/dashboard/profile");
        }
      } catch (error) {
        console.log(error)
        setError("No fue posible iniciar sesión con SSO.");
      } finally {
        setLoading(false);
      }
    };

    authenticateSSO();
  }, []);

  return (
    <div className="container-login">
      <div className="columns background-image">
        <div className="column is-4-tablet is-4-desktop is-4-widescreen is-offset-two-thirds is-one-third is-flex is-flex-direction-column is-justify-content-center form-container column-padding">
          <div className="has-text-centered">
            <img src={Icon} alt="Dis Riego" className="icon-login mb-4" />

            {loading && (
              <>
                <h3 className="subtitle has-text-weight-semibold">
                  Iniciando sesión…
                </h3>
                <p>Validando tus credenciales</p>
              </>
            )}

            {error && (
              <div className="is-flex is-flex-direction-row is-justify-content-center is-align-items-center">
                <IoMdWarning className="icon login-error mr-3" />
                <p className="login-error">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SSOLogin;
