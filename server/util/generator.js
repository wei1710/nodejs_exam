import crypto from "crypto";

const generateUniqueIdentifier = () => {
  return crypto.randomUUID();
};

export { generateUniqueIdentifier };