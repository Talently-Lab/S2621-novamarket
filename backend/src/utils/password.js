import bcrypt from "bcrypt";

const PASSWORD_RULE = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

export const validatePassword = (password) => {
  if (!PASSWORD_RULE.test(password)) {
    return "Debe tener al menos 8 caracteres, una letra y un número";
  }

  return null;
};

export const hashPassword = async (password) => {
  return bcrypt.hash(password, 10);
};

export const comparePassword = async (password, passwordHash) => {
  return bcrypt.compare(password, passwordHash);
};
