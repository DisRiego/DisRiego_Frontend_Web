export const validateLastName = (text) => {
  const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/;
  return nameRegex.test(text) && text.trim() !== "";
};

export const validateEmail = (email) => {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
  return emailRegex.test(email);
};

export const validateAddress = (address) => {
  const regex =
    /^(Calle|Carrera|Avenida|Transversal|Diagonal)\s\d+\s*(#|n°)\s*\d+(-\d+)?$/i;
  return regex.test(address);
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

export const validateSerial = (serial) => {
  const onlyNumbers = /^[0-9]+$/;
  const onlyLetters = /^[a-zA-Z]+$/;
  const alphanumeric = /^[a-zA-Z0-9]+$/;

  return (
    onlyNumbers.test(serial) ||
    onlyLetters.test(serial) ||
    alphanumeric.test(serial)
  );
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

export const validateImage = (file) => {
  if (!file)
    return { isValid: false, error: "No se ha seleccionado un archivo" };

  const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"];
  const maxSize = 2 * 1024 * 1024; // 2 MB

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error:
        "Por favor, sube un archivo de imagen válido (PNG, JPG, JPEG o GIF)",
    };
  }

  if (file.size > maxSize) {
    return { isValid: false, error: "La imagen no debe superar los 2 MB" };
  }

  return { isValid: true, error: "" };
};

export const validateFile = (file) => {
  if (!file) {
    return { isValid: false, error: "No se ha seleccionado un archivo" };
  }

  const allowedTypes = ["application/pdf"];
  const maxSize = 2 * 1024 * 1024; // 5 MB

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: "Por favor, sube un archivo válido (PDF)",
    };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: "El archivo no debe superar los 5 MB.",
    };
  }

  return { isValid: true, error: "" };
};
