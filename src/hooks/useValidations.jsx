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
    /^(cl|cll|cra|calle|carrera|av|avenida|transversal|diagonal)\s*\d+[a-zA-Z]?\s*(#|n°)?\s*\d+[a-zA-Z]?\s*-?\s*\d*[a-zA-Z]?$/i;
  return regex.test(address.trim());
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

export const validateDescription = (fullText) => {
  const descriptionRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s.,]+$/;
  return descriptionRegex.test(fullText) && fullText.trim() !== "";
};

export const validateDescriptionReject = (fullText) => {
  const descriptionRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.,:]+$/;
  return descriptionRegex.test(fullText) && fullText.trim() !== "";
};

export const validatePhone = (phone) => {
  const nameRegex = /^[0-9]+$/;
  return nameRegex.test(phone);
};

export const validateLatitude = (latitude) => {
  const latRegex = /^-?(?:90(?:\.0+)?|[0-8]?\d(?:\.\d+)?)$/;
  return latRegex.test(latitude);
};

export const validateLongitude = (longitude) => {
  const lonRegex = /^-?(?:180(?:\.0+)?|1[0-7]\d(?:\.\d+)?|[0-9]?\d(?:\.\d+)?)$/;
  return lonRegex.test(longitude);
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

export const validatePlaningDate = (date) => {
  const dateRegex = /^(?:19|20)\d\d-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/;
  if (!dateRegex.test(date)) return false;

  const [year, month, day] = date.split("-").map(Number);
  const inputDate = new Date(year, month - 1, day);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return inputDate >= today;
};

export const validateBirthdate = (birthdate) => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!dateRegex.test(birthdate)) {
    return false;
  }

  const [year, month, day] = birthdate.split("-").map(Number);
  const inputDate = new Date(year, month - 1, day);
  const today = new Date();

  // Ajustar para comparar solo la fecha (sin la hora)
  today.setHours(0, 0, 0, 0);

  if (year < 1900 || inputDate > today) {
    return false;
  }

  return (
    inputDate.getFullYear() === year &&
    inputDate.getMonth() === month - 1 &&
    inputDate.getDate() === day
  );
};

export const validateIssuanceDate = (issuanceDate, birthdate) => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!dateRegex.test(issuanceDate) || !dateRegex.test(birthdate)) {
    return false;
  }

  const [issueYear, issueMonth, issueDay] = issuanceDate.split("-").map(Number);
  const [birthYear, birthMonth, birthDay] = birthdate.split("-").map(Number);

  const issuance = new Date(issueYear, issueMonth - 1, issueDay);
  const birth = new Date(birthYear, birthMonth - 1, birthDay);
  const today = new Date();

  // Ajustar la fecha actual para comparar solo la fecha (sin hora)
  today.setHours(0, 0, 0, 0);

  // La fecha de expedición no puede ser futura y no puede ser menor que la fecha de nacimiento
  if (issuance > today || issuance < birth) {
    return false;
  }

  return (
    issuance.getFullYear() === issueYear &&
    issuance.getMonth() === issueMonth - 1 &&
    issuance.getDate() === issueDay
  );
};

export const validateExpirationDate = (issuanceDate, expirationDate) => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!dateRegex.test(issuanceDate) || !dateRegex.test(expirationDate)) {
    return false;
  }

  const [issueYear, issueMonth, issueDay] = issuanceDate.split("-").map(Number);
  const [expireYear, expireMonth, expireDay] = expirationDate
    .split("-")
    .map(Number);

  const issuance = new Date(issueYear, issueMonth - 1, issueDay);
  const expiration = new Date(expireYear, expireMonth - 1, expireDay);
  const today = new Date();

  // Ajustar la fecha actual para comparar solo la fecha (sin hora)
  today.setHours(0, 0, 0, 0);

  // La fecha de expiración debe ser mayor que la fecha de emisión
  if (expiration <= issuance) {
    return false;
  }

  // La fecha de emisión no puede ser futura
  if (issuance > today) {
    return false;
  }

  return (
    issuance.getFullYear() === issueYear &&
    issuance.getMonth() === issueMonth - 1 &&
    issuance.getDate() === issueDay &&
    expiration.getFullYear() === expireYear &&
    expiration.getMonth() === expireMonth - 1 &&
    expiration.getDate() === expireDay
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
  const maxSize = 1 * 1024 * 1024;

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

export const validateImageEvidence = (file) => {
  if (!file)
    return { isValid: false, error: "No se ha seleccionado un archivo" };

  const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"];
  const maxSize = 5 * 1024 * 1024; //Maximo 5 megas

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
  const maxSize = 2 * 1024 * 1024; // 2 mb

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

export const validateModel = (model) => {
  const modelRegex =
    /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9][a-zA-Z0-9\s-]*[a-zA-Z0-9]$/;
  return modelRegex.test(model.trim());
};

export const validateEstimatedMaintenanceDate = (
  estimatedDate,
  installationDate
) => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!dateRegex.test(estimatedDate) || !dateRegex.test(installationDate)) {
    return false;
  }

  const estimated = new Date(estimatedDate);
  const installation = new Date(installationDate);

  // La fecha estimada debe ser igual o posterior a la fecha de instalación
  return estimated >= installation;
};

export const validateTime = (text) => {
  const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
  return timeRegex.test(text.trim());
};

export const validateOpenDate = (date) => {
  const [year, month, day] = date.split("-").map(Number);

  // Crear la fecha manualmente en zona horaria local
  const inputDate = new Date(year, month - 1, day);
  const today = new Date();

  // Normaliza ambas fechas a medianoche
  inputDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return inputDate >= today;
};

export const validateCloseDate = (openDate, closeDate) => {
  if (!openDate || !closeDate) return false;

  const [openYear, openMonth, openDay] = openDate.split("-").map(Number);
  const [closeYear, closeMonth, closeDay] = closeDate.split("-").map(Number);

  const open = new Date(openYear, openMonth - 1, openDay);
  const close = new Date(closeYear, closeMonth - 1, closeDay);

  // Normaliza ambas fechas a medianoche en zona local
  open.setHours(0, 0, 0, 0);
  close.setHours(0, 0, 0, 0);
  return close >= open;
};

export const validateCloseTime = (openDate, closeDate, openTime, closeTime) => {
  if (!openTime || !closeTime || !openDate || !closeDate) return false;

  // Solo comparar horas si la fecha de apertura y cierre son iguales
  if (openDate !== closeDate) return true;

  const [openHours, openMinutes] = openTime.split(":").map(Number);
  const [closeHours, closeMinutes] = closeTime.split(":").map(Number);

  const open = new Date();
  open.setHours(openHours, openMinutes, 0, 0);

  const close = new Date();
  close.setHours(closeHours, closeMinutes, 0, 0);

  return close > open;
};

export const validateMultInput = (fieldName, value) => {
  let regex;

  if (
    fieldName === "polo_1" ||
    fieldName === "polo_2" ||
    fieldName === "polo_3" ||
    fieldName === "polo_4"
  ) {
    regex = /^[0-9]+$/;
  } else if (fieldName === "direccion_mac" || fieldName === "dirección_mac") {
    regex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
  } else if (
    fieldName === "version_firmware" ||
    fieldName === "versión_firmware"
  ) {
    regex = /^(v)?\d+(\.\d+){1,2}$/;
  } else if (
    fieldName === "voltaje_(v)" ||
    fieldName === "voltaje_(vac)" ||
    fieldName === "potencia_(w)" ||
    fieldName === "amperaje_(a)" ||
    fieldName === "capacidad_(ah)" ||
    fieldName === "voltaje_maximo"
  ) {
    regex = /^\d+(\.\d+)?$/;
  } else {
    return true;
  }

  return regex?.test(value);
};
