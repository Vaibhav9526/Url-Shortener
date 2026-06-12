import { createHmac } from "node:crypto";

export const hashPassword = (password, salt) => {
  const hashed = createHmac("sha256", salt).update(password).digest("hex");
  return hashed;
};
