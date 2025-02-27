import { Link } from "react-router-dom";
import Facebook from "../img/icon/facebook.png";
import Instagram from "../img/icon/instagram.png";
import Twitter from "../img/icon/twitter.png";

const Footer = () => {
  return (
    <>
      <footer class="">
        <div className="columns">
          <div className="column">
            <div className="column columnCopyright">
              <p className="columnCopyright mt-1 has-text-centered">
                Copyright © 2025 Dis_Riego{" "}
              </p>
            </div>
          </div>
          <div className="column">
            <div className="iconos has-text-centered">
              <Link to="" className="icon m-1">
                <img src={Facebook} alt="" />
              </Link>
              <Link className="icon m-1">
                <img src={Instagram} alt="" />
              </Link>
              <Link className="icon m-1">
                <img src={Twitter} alt="" />
              </Link>
            </div>
            <p className="has-text-centered">Redes Sociales</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
