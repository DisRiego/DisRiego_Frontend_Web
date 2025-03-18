import axios from "axios";
import { useState } from "react";
import { FaUpload } from "react-icons/fa6";

const Form_edit_profile_picture = ({ title, onClose, id }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/gif",
      ];
      const maxSize = 2 * 1024 * 1024; // 2MB

      if (!allowedTypes.includes(selectedFile.type)) {
        setFile(null);
        setFileName("");
        setError(
          "Por favor, sube un archivo de imagen (PNG, JPG, JPEG o GIF)."
        );
        return;
      }

      if (selectedFile.size > maxSize) {
        setFile(null);
        setFileName("");
        setError("La imagen no debe superar los 2 MB.");
        return;
      }

      setFile(selectedFile);
      setFileName(selectedFile.name);
      setError("");
    } else {
      setFile(null);
      setFileName("");
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Por favor, selecciona una imagen antes de subir.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("id", id);

    try {
      console.log(formData);
      const response = await axios.post(
        "https://tu-servidor.com/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Respuesta del servidor:", response.data);
      alert("Imagen subida con éxito.");
      onClose();
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      setError("Error al subir la imagen. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="modal is-active">
        <div className="modal-background" onClick={onClose}></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">{title}</p>
            <button
              className="delete"
              aria-label="close"
              onClick={onClose}
            ></button>
          </header>
          <section className="modal-card-body">
            <div className="field">
              <div
                className={`file has-name is-fullwidth ${
                  error ? "is-danger" : ""
                }`}
              >
                <label className="file-label">
                  <input
                    className="file-input"
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/gif"
                    onChange={handleFileChange}
                  />
                  <span className="file-cta">
                    <span className="file-icon">
                      <FaUpload />
                    </span>
                    <span className="file-label"> Subir foto… </span>
                  </span>
                  <span className="file-name">
                    {fileName || "Ningún archivo seleccionado"}
                  </span>
                </label>
              </div>
              {error && <p className="has-text-danger is-6">{error}</p>}
            </div>
          </section>
          <footer className="modal-card-foot is-flex is-justify-content-center">
            <div className="buttons">
              <button className="button is-danger" onClick={onClose}>
                Cancelar
              </button>
              <button className="button color-hover" onClick={handleUpload}>
                Guardar
              </button>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Form_edit_profile_picture;
