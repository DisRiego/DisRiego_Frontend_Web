import { useState } from "react";
import axios from "axios";
import "bulma/css/bulma.min.css"; // Importar Bulma

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("https://disriego-backend.onrender.com/login", {
        email,
        password,
      });

      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="hero is-fullheight is-flex is-align-items-center is-justify-content-center">
      <div className="box" style={{ width: "350px" }}>
        <h2 className="title has-text-centered">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="field">
            <label className="label">Email</label>
            <div className="control">
              <input
                type="email"
                className="input"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Password</label>
            <div className="control">
              <input
                type="password"
                className="input"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit" className="button is-primary is-fullwidth">Login</button>
        </form>
        {message && <p className="has-text-danger has-text-centered mt-3">{message}</p>}
      </div>
    </div>
  );
};

export default Login;
