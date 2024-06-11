import validator from "validator";

//-- ********************************* USERNAME REQUIREMENTS *********************** --//
const validateUsername = (username) => {
  const regex = /^[a-zA-Z0-9_-]{5,13}$/;
  return regex.test(username);
};

//-- ********************************* PASSWORD REQUIREMENTS *********************** --//
const validatePassword = (password) => {
  const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,71}$/;
  return regex.test(password);
};

//-- ********************************* EMAIL REQUIREMENTS *********************** --//
const validateEmail = (email) => {
  return validator.isEmail(email);
};

export { validateUsername, validatePassword, validateEmail };
