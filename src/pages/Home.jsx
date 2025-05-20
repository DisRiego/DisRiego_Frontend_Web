import { useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DemoImage from "../img/demo_dashboard.png";
import {
  FiZap,
  FiBarChart2,
  FiShield,
  FiMap,
  FiClock,
  FiDownload,
  FiMail,
  FiPhone,
  FiMapPin,
  FiUsers,
} from "react-icons/fi";

const Home = () => {
  const quienesRef = useRef(null);
  const beneficiosRef = useRef(null);
  const especificacionesRef = useRef(null);
  const contactoRef = useRef(null);

  const containerStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 1.5rem",
  };

  const sectionStyle = {
    padding: "7rem 0",
  };

  const cardStyle = {
    border: "1px solid #e6e6e6",
    borderRadius: "16px",
    padding: "2rem",
    backgroundColor: "#fff",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  };

  return (
    <>
      <Navbar
        onScrollTo={{
          quienes: () =>
            quienesRef.current.scrollIntoView({ behavior: "smooth" }),
          beneficios: () =>
            beneficiosRef.current.scrollIntoView({ behavior: "smooth" }),
          especificaciones: () =>
            especificacionesRef.current.scrollIntoView({ behavior: "smooth" }),
          contacto: () =>
            contactoRef.current.scrollIntoView({ behavior: "smooth" }),
        }}
      />

      {/* HERO */}
      <section
        style={{
          ...sectionStyle,
          backgroundColor: "#ffffff",
          paddingTop: "4rem",
        }}
      >
        <div style={containerStyle}>
          <h1
            style={{
              fontSize: "3rem",
              fontWeight: "800",
              textAlign: "center",
              marginBottom: "1rem",
              color: "#111",
            }}
          >
            Gestiona el riego con inteligencia
          </h1>
          <p
            style={{
              textAlign: "center",
              fontSize: "1.2rem",
              color: "#555",
              maxWidth: "700px",
              margin: "0 auto 1.25rem",
              lineHeight: "1.8",
            }}
          >
            Visualiza y controla tu consumo de agua, facturación y predios desde
            cualquier lugar.
          </p>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <button
              onClick={() =>
                quienesRef.current.scrollIntoView({ behavior: "smooth" })
              }
              className="button is-light"
              style={{
                border: "1px solid rgb(217, 217, 217)",
              }}
            >
              Conoce más
            </button>
          </div>
          <div style={{ textAlign: "center" }}>
            <img
              src={DemoImage}
              alt="Vista previa"
              style={{
                width: "100%",
                maxWidth: "1080px",
                borderRadius: "16px",
              }}
            />
          </div>
        </div>
      </section>

      {/* WAVE: Hero → Quienes */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          lineHeight: 0,
          transform: "rotate(180deg)",
        }}
      >
        <svg
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          style={{ display: "block", width: "100%", height: "80px" }}
        >
          <path
            d="M0,0 C480,100 960,0 1440,100 L1440,0 L0,0 Z"
            fill="#F3F2F7"
          />
        </svg>
      </div>

      {/* QUIÉNES SOMOS */}
      <section
        ref={quienesRef}
        style={{ ...sectionStyle, backgroundColor: "#F3F2F7" }}
      >
        <div style={containerStyle}>
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <FiUsers
              size={36}
              color="#2A6041"
              style={{ marginBottom: "0.5rem" }}
            />
            <h2
              style={{
                fontSize: "2.4rem",
                fontWeight: 700,
                color: "#111",
                margin: 0,
              }}
            >
              ¿Quiénes somos?
            </h2>
          </div>
          <p
            style={{
              textAlign: "center",
              maxWidth: "750px",
              margin: "0 auto",
              fontSize: "1.1rem",
              color: "#444",
              lineHeight: "1.8",
            }}
          >
            <strong>DisRiego</strong> es una solución tecnológica enfocada en
            modernizar la gestión del agua en los distritos de riego mediante
            herramientas inteligentes. Brindamos a usuarios y administradores
            información clara, accesible y segura para optimizar sus
            operaciones.
          </p>
        </div>
      </section>

      {/* WAVE: Quienes → Beneficios */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          lineHeight: 0,
          transform: "scaleX(-1,-1)",
        }}
      >
        <svg
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          style={{ display: "block", width: "100%", height: "80px" }}
        >
          <path
            d="M0,0 C480,100 960,0 1440,100 L1440,0 L0,0 Z"
            fill="#F3F2F7"
          />
        </svg>
      </div>

      {/* BENEFICIOS */}
      <section
        ref={beneficiosRef}
        style={{ ...sectionStyle, backgroundColor: "#ffffff" }}
      >
        <div style={containerStyle}>
          <h2
            style={{
              textAlign: "center",
              fontSize: "2.5rem",
              fontWeight: 700,
              marginBottom: "4rem",
              color: "#111",
            }}
          >
            Beneficios para usuarios
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "2.5rem",
            }}
          >
            {[
              {
                title: "Información en tiempo real",
                text: "Consulta tu consumo, facturas y predios desde cualquier dispositivo.",
                icon: <FiZap size={32} color="#2A6041" />,
              },
              {
                title: "Planificación inteligente",
                text: "Recibe proyecciones personalizadas y toma decisiones con base en datos.",
                icon: <FiBarChart2 size={32} color="#2A6041" />,
              },
              {
                title: "Privacidad y control",
                text: "Tu información está segura, accesible y bajo tu control.",
                icon: <FiShield size={32} color="#2A6041" />,
              },
            ].map((item, i) => (
              <div key={i} style={cardStyle}>
                <div style={{ marginBottom: "1rem" }}>{item.icon}</div>
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    color: "#111",
                    marginBottom: "0.75rem",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{ color: "#555", fontSize: "1rem", lineHeight: "1.7" }}
                >
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WAVE: Beneficios → Especificaciones */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          lineHeight: 0,
          transform: "rotate(180deg)",
        }}
      >
        <svg
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          style={{ display: "block", width: "100%", height: "80px" }}
        >
          <path
            d="M0,0 C480,100 960,0 1440,100 L1440,0 L0,0 Z"
            fill="#F3F2F7"
          />
        </svg>
      </div>

      {/* ESPECIFICACIONES */}
      <section style={{ ...sectionStyle, backgroundColor: "#F3F2F7" }}>
        <div style={containerStyle}>
          <h2
            ref={especificacionesRef}
            style={{
              textAlign: "center",
              fontSize: "2.5rem",
              fontWeight: 700,
              marginBottom: "3rem",
              color: "#111",
            }}
          >
            Especificaciones del sistema
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "2.5rem",
            }}
          >
            {[
              {
                title: "Gestión de predios",
                text: "Administra todos tus predios desde una sola cuenta.",
                icon: <FiMap size={28} color="#2A6041" />,
              },
              {
                title: "Historial visual",
                text: "Gráficos y reportes para visualizar tu consumo en el tiempo.",
                icon: <FiClock size={28} color="#2A6041" />,
              },
              {
                title: "Exportación de datos",
                text: "Accede a la documentación de tus terrenos y genera reportes en pdf.",
                icon: <FiDownload size={28} color="#2A6041" />,
              },
            ].map((item, i) => (
              <div key={i} style={cardStyle}>
                <div style={{ marginBottom: "1rem" }}>{item.icon}</div>
                <h4
                  style={{
                    fontSize: "1.15rem",
                    fontWeight: 600,
                    color: "#111",
                    marginBottom: "0.5rem",
                  }}
                >
                  {item.title}
                </h4>
                <p
                  style={{
                    color: "#555",
                    fontSize: "0.95rem",
                    lineHeight: "1.6",
                  }}
                >
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section
        ref={contactoRef}
        style={{
          padding: "4rem 0",
          backgroundColor: "#ffffff",
          borderTop: "1px solid #e6e6e6",
        }}
      >
        <div style={containerStyle}>
          <h3
            style={{
              textAlign: "center",
              fontSize: "2rem",
              fontWeight: "700",
              marginBottom: "2rem",
              color: "#111",
            }}
          >
            Contáctanos
          </h3>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
              maxWidth: "600px",
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            <p style={{ color: "#444", lineHeight: "1.6", fontSize: "1rem" }}>
              ¿Tienes dudas o necesitas ayuda? Escríbenos directamente.
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <p
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "#2A6041",
                }}
              >
                <FiMail /> disriego@outlook.com
              </p>
              <p
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "#2A6041",
                }}
              >
                <FiPhone /> +57 313 654 3212
              </p>
              <p
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "#2A6041",
                }}
              >
                <FiMapPin /> Neiva, Huila
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Home;
