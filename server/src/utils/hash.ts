import * as bcrypt from 'bcrypt';

export async function createHash(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function compareHash(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}
