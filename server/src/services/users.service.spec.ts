import { UserCreateDto } from '../dto/user-create.dto';
import { PrismaService } from './prisma.service';
import { UsersService } from './users.service';

describe('UserService', () => {
  let usersService: UsersService;
  let prismaService: PrismaService;

  beforeEach(() => {
    prismaService = new PrismaService();
    usersService = new UsersService(prismaService);
  });

  describe('Create', () => {
    it('Deve criar um usuário caso todos os dados obrigatórios passados estejam corretos', async () => {
      const newUser: UserCreateDto = {
        username: 'jonhdoe',
        password: '123123',
        role: 'admin',
      };
      const output = {
        id: 'any_id',
        username: 'jonhdoe',
        password: '123123',
        active: true,
        role: 'admin',
        create_at: new Date(),
      };

      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValueOnce(undefined);
      jest
        .spyOn(prismaService.user, 'create')
        .mockResolvedValueOnce(output);

      expect(await usersService.create(newUser)).toBe(output);
    });

    it('Deve gerar um erro caso o usuário já exista', async () => {
      const newUser: UserCreateDto = {
        username: 'jonhdoe',
        password: '123123',
        role: 'admin',
      };

      const output = {
        id: 'any_id',
        username: 'jonhdoe',
        password: '123123',
        active: true,
        role: 'admin',
        create_at: new Date(),
      };

      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValueOnce(output);

      await expect(usersService.create(newUser)).rejects.toThrow(
        new Error('Login de usuário já existe'),
      );
    });
  });
});
