export const validateLastName = (text) => {
  const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/;
  return nameRegex.test(text) && text.trim() !== "";
};

export const validateEmail = (email) => {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  const minLength = 12;

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

export const validatePhone = (phone) => {
  const nameRegex = /^[0-9]+$/;
  return nameRegex.test(phone);
};

export const validateDate = (birthdate) => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!dateRegex.test(birthdate)) {
    return false;
  }

  const [year, month, day] = birthdate.split("-").map(Number);

  const currentYear = new Date().getFullYear();
  if (year < 1900 || year > currentYear) {
    return false;
  }

  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};
