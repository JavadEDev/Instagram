"use server";

const bcrypt = require("bcrypt");
const saltRounds = 10;

export const hashPW = (password: string) => {
  return bcrypt.hash(password, saltRounds);
};

export const comparePW = (password: string, hashedPW: string) => {
  return bcrypt.compare(password, hashedPW);
};
