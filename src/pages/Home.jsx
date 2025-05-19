import { useEffect } from "react";
import { Link } from "react-router-dom";
import bulmaCarousel from "bulma-carousel";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Img_carousel1 from "../img/distrito_riego.jpg";
import Img_carousel2 from "../img/distrito_riego2.jpg";
import Img_carousel3 from "../img/distrito_riego3.webp";

const Home = () => {
  useEffect(() => {
    bulmaCarousel.attach("#carousel-demo", {
      slidesToScroll: 1,
      slidesToShow: 1,
      loop: true,
      autoplay: true,
      pauseOnHover: true,
      navigation: true,
      pagination: true,
    });
  }, []);

  return (
    <>
      <Navbar />
      <section className="hero is-large has-carousel">
        <div id="carousel-demo" className="hero-carousel">
          <div className="item-1">
            <img className="is-background" src={Img_carousel1} alt="Imagen 1" />
          </div>
          <div className="item-2">
            <img className="is-background" src={Img_carousel2} alt="Imagen 2" />
          </div>
          <div className="item-3">
            <img className="is-background" src={Img_carousel3} alt="Imagen 3" />
          </div>
        </div>
        <div className="hero-head"></div>
        <div className="hero-body"></div>
        <div className="hero-foot"></div>
      </section>
      <section className="section has-text-centered has-background-black-ter	">
        <div className="container">
          <h1 className="title is-4">¿Quiénes Somos?</h1>
          <p>
            Somos una empresa dedicada a proporcionar soluciones innovadoras,
            comprometidos con la calidad y el desarrollo sostenible. Nuestro
            equipo está formado por expertos apasionados por la tecnología y el
            bienestar de nuestros clientes.
          </p>
          <div className="buttons is-centered mgb-5">
            <Link className="button is-primary mt-5 mgb-4" to={"/nosotros"}>
              Conocer Más
            </Link>
          </div>
        </div>
      </section>
      <section className="section has-text-centered">
        <div className="container">
          <h1 className="title is-4">Nuestros Servicios</h1>
          <p className="mb-5">
            Ofrecemos una amplia gama de servicios para satisfacer las
            necesidades de nuestros clientes.
          </p>

          <div className="columns is-centered is-multiline is-mobile">
            <div className="column is-3-tablet is-8-mobile">
              <figure className="image is-5by3">
                <img src={Img_carousel1} alt="Servicio 1" />
              </figure>
              <h2>Gestionador</h2>
            </div>
            <div className="column is-3-tablet is-8-mobile">
              <figure className="image is-5by3">
                <img src={Img_carousel2} alt="Servicio 2" />
              </figure>
              <h2>Gestionador</h2>
            </div>
            <div className="column is-3-tablet is-8-mobile">
              <figure className="image is-5by3">
                <img src={Img_carousel3} alt="Servicio 3" />
              </figure>
              <h2>Visualizador</h2>
            </div>
          </div>

          <div className="buttons is-centered">
            <Link className="button is-primary" to="/">
              Conocer Más
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Home;
