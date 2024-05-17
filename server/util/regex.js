import validator from "validator";

//-- ********************************* Username requirements *********************** --//
const validateUsername = (username) => {
  const regex = /^[a-zA-Z0-9_-]{5,13}$/;
  return regex.test(username);
};

//-- ********************************* Password requirements *********************** --//
const validatePassword = (password) => {
  const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,13}$/;
  return regex.test(password);
};

//-- ********************************* Email requirements *********************** --//
const validateEmail = (email) => {
  return validator.isEmail(email);
};

export { validateUsername, validatePassword, validateEmail };
