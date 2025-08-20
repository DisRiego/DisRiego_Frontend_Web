import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [decodedToken, setDecodedToken] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        setToken(storedToken);
        setDecodedToken(decoded);
        setPermissions(
          decoded.rol?.flatMap((rol) => rol.permisos?.map((p) => p.name)) || []
        );
      } catch (e) {
        console.error("Token inválido, cerrando sesión:", e);
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);

    try {
      const decoded = jwtDecode(newToken);
      setDecodedToken(decoded);
      setPermissions(
        decoded.rol?.flatMap((rol) => rol.permisos?.map((p) => p.name)) || []
      );
    } catch (e) {
      console.error("Error al decodificar el token al logear:", e);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setDecodedToken(null);
    setPermissions([]);
  };

  return (
    <AuthContext.Provider
      value={{ token, decodedToken, permissions, login, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
