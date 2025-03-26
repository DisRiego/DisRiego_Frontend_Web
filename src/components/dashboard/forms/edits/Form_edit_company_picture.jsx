import { useEffect, useState } from "react";
import { FaUpload } from "react-icons/fa6";
import { validateImage } from "../../../../hooks/useValidations";
import Confirm_company from "../../confirm_view/Confirm_company";

const Form_edit_company_picture = ({
  title,
  onClose,
  data,
  setShowMessage,
  setTitleMessage,
  setMessage,
  setStatus,
  loading,
  setLoading,
  updateData,
}) => {
  const id = data.id;
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirMessage, setConfirMessage] = useState();
  const [method, setMethod] = useState();
  const [uriPost, setUriPost] = useState("");
  const [typeForm, setTypeForm] = useState("");
  const [newData, setNewData] = useState(null);

  const [formData, setFormData] = useState({
    icon_company: null,
  });

  useEffect(() => {
    getCompany();
  }, []);

  const getCompany = () => {
    setFormData({
      icon_company: data.logo,
    });
  };

  const [errors, setErrors] = useState({});

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    const validation = validateImage(selectedFile);

    if (!validation.isValid) {
      setErrors((prev) => ({
        ...prev,
        icon_company: validation.error,
      }));
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);

    setFormData((prev) => ({
      ...prev,
      icon_company: selectedFile,
    }));

    setErrors((prev) => ({ ...prev, icon_company: "" }));
  };

  const handleSubmit = async () => {
    let newErrors = {};
    if (!formData.icon_company)
      newErrors.icon_company = "Debe subir un logo si desea cambiarlo";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const formDataToSend = new FormData();

      if (file) {
        formDataToSend.append("logo", file);
      }
      setNewData(formDataToSend);

      setConfirMessage('¿Desea actualizar el logo de "' + data.name + '"?');
      setMethod("patch");
      setUriPost(
        import.meta.env.VITE_URI_BACKEND +
          import.meta.env.VITE_ROUTE_BACKEND_COMPANY_EDIT_LOGO
      );
      setTypeForm("update_logo_profile");
      setShowConfirm(true);

      // try {
      //   const response = await axios.patch(
      //     import.meta.env.VITE_URI_BACKEND +
      //       import.meta.env.VITE_ROUTE_BACKEND_COMPANY_EDIT_BASIC,
      //     data,
      //     {
      //       headers: {
      //         "Content-Type": "multipart/form-data",
      //       },
      //     }
      //   );

      //   console.log(response.data);
      // } catch (error) {
      //   console.error(error);
      // }
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
            <form onSubmit={handleSubmit}>
              <div className="field">
                <div
                  className={`file has-name is-fullwidth ${
                    errors.icon_company ? "is-danger" : ""
                  } error-file`}
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
                      <span className="file-label">Subir imagen...</span>
                    </span>
                    <span className="file-name">
                      {fileName || "Ningún archivo seleccionado"}
                    </span>
                  </label>
                </div>
                {errors.icon_company && (
                  <p className="has-text-danger is-6">{errors.icon_company}</p>
                )}
              </div>
            </form>
          </section>
          <footer className="modal-card-foot is-flex is-justify-content-center">
            <div className="buttons">
              <button className="button" onClick={onClose}>
                Cancelar
              </button>
              <button className="button color-hover" onClick={handleSubmit}>
                Guardar
              </button>
            </div>
          </footer>
        </div>
      </div>
      {showConfirm && (
        <Confirm_company
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
        />
      )}
    </>
  );
};

export default Form_edit_company_picture;
