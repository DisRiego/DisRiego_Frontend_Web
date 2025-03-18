import { useEffect, useState } from "react";
import { MdError } from "react-icons/md";
import { IoMdWarning } from "react-icons/io";
import { validatePassword } from "../../../../hooks/useValidations";
import axios from "axios";

const Form_edit_profile_password = ({ title, onClose, id }) => {
  const [loginError, setLoginError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    hasNumber: false,
    hasUppercase: false,
    hasLowercase: false,
    hasSpecialChar: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setLoginError("");

    if (name === "new_password") {
      setPasswordCriteria({
        length: value.length >= 12,
        hasNumber: /\d/.test(value),
        hasUppercase: /[A-ZÑ]/.test(value),
        hasLowercase: /[a-zñ]/.test(value),
        hasSpecialChar: /[.,;_@%+\-]/.test(value),
      });
    }
  };

  console.log(errors);

  const handleSubmit = async () => {
    setSubmitted(true);

    const isOldPasswordValid = validatePassword(formData.old_password);
    const isNewPasswordValid = validatePassword(formData.new_password);
    const isConfirmPasswordValid = validatePassword(formData.confirm_password);

    let newErrors = {
      old_password: isOldPasswordValid ? "" : "Contraseña inválida",
      new_password: isNewPasswordValid ? "" : "Contraseña inválida",
      confirm_password: isConfirmPasswordValid ? "" : "Contraseña inválida",
    };

    if (
      !passwordCriteria.length ||
      !passwordCriteria.hasNumber ||
      !passwordCriteria.hasUppercase ||
      !passwordCriteria.hasLowercase ||
      !passwordCriteria.hasSpecialChar
    ) {
      setLoginError(
        "La nueva contraseña no cumple con los requisitos de seguridad."
      );
      newErrors.new_password =
        "La nueva contraseña no cumple con los requisitos.";
      setErrors(newErrors);
      return;
    }

    if (formData.new_password !== formData.confirm_password) {
      setLoginError("Las contraseñas no coinciden.");
      newErrors.new_password = "Las contraseñas no coinciden.";
      newErrors.confirm_password = "Las contraseñas no coinciden.";
    }

    setErrors(newErrors);

    // Espera un ciclo para que el estado se actualice
    await new Promise((resolve) => setTimeout(resolve, 0));

    if (Object.values(newErrors).some((error) => error !== "")) {
      return;
    }

    // Llamar API después de validar errores
    // try {
    //   const response = await axios.post(...);
    //   console.log(response);
    // } catch (error) {
    //   console.log(error);
    // }
  };

  // console.log(formData);
  console.log(errors);

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
              <label className="label">Actual Contraseña</label>
              <div className="control">
                <input
                  className={`input ${
                    submitted && (errors.old_password ? "is-false" : "is-true")
                  }`}
                  type="password"
                  name="old_password"
                  placeholder="Ingresa tu actual contraseña"
                  onChange={handleChange}
                />
              </div>
              {submitted && errors.old_password && (
                <p className="input-error">{errors.old_password}</p>
              )}
            </div>

            <div className="field">
              <label className="label">Nueva contraseña</label>
              <div className="control">
                <input
                  className={`input ${
                    submitted && (errors.new_password ? "is-false" : "is-true")
                  }`}
                  type="password"
                  name="new_password"
                  placeholder="Ingresa tu nueva contraseña"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Confirmar nueva contraseña</label>
              <div className="control">
                <input
                  className={`input ${
                    submitted &&
                    (errors.confirm_password ? "is-false" : "is-true")
                  }`}
                  type="password"
                  name="confirm_password"
                  placeholder="Ingresa nuevamente tu nueva contraseña"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="field">
              <div className="control">
                <div className="is-flex">
                  <MdError
                    className={
                      formData.new_password === ""
                        ? "icon-password"
                        : passwordCriteria.length
                        ? "icon-password is-true"
                        : "icon-password is-false"
                    }
                  />
                  <p>Mínimo 12 caracteres</p>
                </div>
                <div className="is-flex">
                  <MdError
                    className={
                      formData.new_password === ""
                        ? "icon-password"
                        : passwordCriteria.hasUppercase
                        ? "icon-password is-true"
                        : "icon-password is-false"
                    }
                  />
                  <p>Mínimo una letra mayúscula</p>
                </div>
                <div className="is-flex">
                  <MdError
                    className={
                      formData.new_password === ""
                        ? "icon-password"
                        : passwordCriteria.hasLowercase
                        ? "icon-password is-true"
                        : "icon-password is-false"
                    }
                  />
                  <p>Mínimo una letra minúscula</p>
                </div>
                <div className="is-flex">
                  <MdError
                    className={
                      formData.new_password === ""
                        ? "icon-password"
                        : passwordCriteria.hasNumber
                        ? "icon-password is-true"
                        : "icon-password is-false"
                    }
                  />
                  <p>Mínimo un número</p>
                </div>
                <div className="is-flex">
                  <MdError
                    className={
                      formData.new_password === ""
                        ? "icon-password"
                        : passwordCriteria.hasSpecialChar
                        ? "icon-password is-true"
                        : "icon-password is-false"
                    }
                  />
                  <p>Mínimo un carácter especial</p>
                </div>
              </div>
            </div>
            {loginError && (
              <div className="is-flex is-flex-direction-row	is-justify-content-center is-align-items-center">
                <IoMdWarning className="icon login-error mr-3" />
                <p className="login-error is-6">{loginError}</p>
              </div>
            )}
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
    </>
  );
};

export default Form_edit_profile_password;
