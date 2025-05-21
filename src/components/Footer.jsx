import { Link } from "react-router-dom";
import Facebook from "../img/icon/facebook.png";
import Instagram from "../img/icon/instagram.png";
import Twitter from "../img/icon/twitter.png";
import Logo from "../assets/icons/Disriego_title.png";

const Footer = () => {
  return (
    <footer
      style={{
        padding: "1.8rem 1.8rem",
        borderTop: "1px solid #e6e6e6",
      }}
    >
      <div
        style={{
          textAlign: "center",
          fontSize: "0.9rem",
          color: "#888",
        }}
      >
        © 2025 DisRiego. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
