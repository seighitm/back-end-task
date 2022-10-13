import bcrypt from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(dbPassword: string, newPassword: string): Promise<any> {
  await bcrypt.compare(dbPassword, newPassword);
}

