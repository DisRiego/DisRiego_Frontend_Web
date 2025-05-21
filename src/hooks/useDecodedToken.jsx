import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function useDecodedToken() {
  const [decodedToken, setDecodedToken] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        setToken(storedToken);
        setDecodedToken(decoded);
      } catch (error) {
        console.error("Error al decodificar el token:", error);
      }
    }
  }, []);

  return { token, decodedToken };
}
