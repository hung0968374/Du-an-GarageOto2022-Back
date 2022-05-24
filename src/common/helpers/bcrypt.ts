import { compare, hash, genSalt } from 'bcryptjs';

export const generateSaltPassword = async (password: string) => {
  try {
    const salt = await genSalt(12);
    const hashPassword = await hash(password, salt);
    return hashPassword;
  } catch (error) {
    throw new Error(`EXCEPTION generateSaltPassword(): ${error}`);
  }
};

export const compareSaltPassword = async (password: string, hash: string) => {
  try {
    const result = await compare(password, hash);
    return result;
  } catch (error) {
    throw new Error(`EXCEPTION compareSaltPassword(): ${error}`);
  }
};
