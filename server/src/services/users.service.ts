import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { createHash } from '../utils/hash';
import { UserCreateDto } from '../dto/user-create.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) { }

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
    const userDeleted = await this.prisma.user.findUnique({ where: { id } });
    if (!userDeleted) throw new BadRequestException('User Id inválido');
    try {
      await this.prisma.user.delete({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
    return userDeleted
  }
  async findAll() {
    return this.prisma.user.findMany();
  }
}
