export const validateEmail = (email) => {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  const minLength = 8;

  const hasLowercase = /[a-zñ]/.test(password);
  const hasUppercase = /[A-ZÑ]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[.,;_@%+\-]/.test(password);
  const isValidLength = password.length >= minLength;

  return (
    hasLowercase && hasUppercase && hasNumber && hasSpecialChar && isValidLength
  );
};

export const validateText = (text) => {
  const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
  return nameRegex.test(text) && text.trim() !== "";
};

export const validateTextArea = (fullText) => {
  const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
  return nameRegex.test(fullText) && fullText.trim() !== "";
};
