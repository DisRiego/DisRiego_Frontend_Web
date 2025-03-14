import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import "bulma/css/bulma.min.css";
import "bulma-carousel/dist/css/bulma-carousel.min.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
