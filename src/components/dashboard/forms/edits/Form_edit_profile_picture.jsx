import { useState } from "react";
import Confirm_modal from "../../reusable/Confirm_modal";
import { validateImage } from "../../../../hooks/useValidations";
import { FaUpload } from "react-icons/fa6";

const Form_edit_profile_picture = ({
  title,
  onClose,
  id,
  setShowMessage,
  setTitleMessage,
  setMessage,
  setStatus,
  loading,
  setLoading,
  updateData,
  token,
}) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirMessage, setConfirMessage] = useState();
  const [method, setMethod] = useState();
  const [uriPost, setUriPost] = useState("");
  const [typeForm, setTypeForm] = useState("");
  const [newData, setNewData] = useState(null);

  const feedbackMessages = {
    update_picture: {
      successTitle: "Actualización exitosa",
      successMessage: "La foto de perfil ha sido actualizada correctamente.",
      errorTitle: "Error al actualizar",
      errorMessage: `No se pudo actualizar la foto de perfil.
      \n Por favor, inténtelo de nuevo.`,
    },
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    const validation = validateImage(selectedFile);

    if (!validation.isValid) {
      setFile(null);
      setFileName("");
      setError(validation.error);
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setError("");
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Debe de subir una imagen si desea cambiar su foto de perfil");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("profile_picture", file);
    setNewData(formData);

    setConfirMessage("¿Desea actualizar su foto de perfil?");
    setMethod("put");
    setUriPost(
      import.meta.env.VITE_URI_BACKEND +
        import.meta.env.VITE_ROUTE_BACKEND_USERS_CHANGE_PICTURE +
        id
    );
    setTypeForm("update_picture");
    setShowConfirm(true);
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
              <button className="button" onClick={onClose}>
                Cancelar
              </button>
              <button className="button color-hover" onClick={handleUpload}>
                Guardar
              </button>
            </div>
          </footer>
        </div>
      </div>
      {showConfirm && (
        <Confirm_modal
          onClose={() => {
            setShowConfirm(false);
          }}
          onSuccess={onClose}
          confirMessage={confirMessage}
          method={method}
          formData={newData}
          setShowMessage={setShowMessage}
          setTitleMessage={setTitleMessage}
          setMessage={setMessage}
          setStatus={setStatus}
          updateData={updateData}
          uriPost={uriPost}
          typeForm={typeForm}
          loading={loading}
          setLoading={setLoading}
          token={token}
          feedbackMessages={feedbackMessages}
        />
      )}
    </>
  );
};

export default Form_edit_profile_picture;
