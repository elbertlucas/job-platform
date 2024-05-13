import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { createHash } from '../utils/hash';
import { UserCreateDto } from '../dto/user-create.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userCreate: UserCreateDto) {
    const userFound = await this.prisma.user.findUnique({
      where: { username: userCreate.username },
    });
    if (userFound) throw new BadRequestException('Login de usuário já existe');
    return this.prisma.user.create({
      data: {
        username: userCreate.username,
        password: await createHash(userCreate.password),
        role: userCreate.role,
      },
    });
  }
  async findOne(username: string) {
    return this.prisma.user.findUnique({ where: { username } });
  }
  async activate(id: string) {
    return this.prisma.user.update({ where: { id }, data: { active: true } });
  }
  async deactivate(id: string) {
    return this.prisma.user.update({ where: { id }, data: { active: false } });
  }
  async delete(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
  async findAll() {
    return this.prisma.user.findMany();
  }
}
