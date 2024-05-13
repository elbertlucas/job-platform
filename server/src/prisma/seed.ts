import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { createHash } from '../utils/hash';

const prisma = new PrismaClient();

async function main() {
  dotenv.config();

  const user = {
    id: '008fdc20-12c6-4017-9f24-90b23513f109',
    username: 'user',
    password: await createHash('123456'),
    role: 'admin',
  };

  await prisma.user.upsert({
    where: { id: user.id },
    update: { ...user },
    create: { ...user },
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
