import bcrypt from "bcrypt";
export async function encryptPassword(password) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

export async function checkPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}
