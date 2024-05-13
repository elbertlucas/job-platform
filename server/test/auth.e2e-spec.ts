import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthModule } from '../src/modules/auth.module';
import { AuthService } from '../src/services/auth.service';
import { AuthController } from '../src/controllers/auth.controller';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../src/guard/auth.guard';
import { UsersModule } from '../src/modules/users.module';
import { UsersService } from '../src/services/users.service';
import { createHash } from '../src/utils/hash';
import { PrismaService } from '../src/services/prisma.service';

describe('AuthController (e2e)', () => {
    let app: INestApplication;
    let authGuard: AuthGuard;


    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AuthModule, UsersModule],
            providers: [
                {
                    provide: APP_GUARD,
                    useExisting: AuthGuard,
                },
                AuthGuard,
                AuthService,
            ],
            controllers: [AuthController],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalGuards(authGuard)
        await app.init();

        const prisma = await app.resolve(PrismaService)

        const user = {
            id: '008fdc20-12c6-4017-9f24-90b23513f109',
            username: 'bi',
            password: await createHash('bi'),
            role: 'admin',
        };

        await prisma.user.upsert({
            where: { id: user.id },
            update: { ...user },
            create: { ...user },
        });

    });

    afterEach(async () => {
        const prisma = await app.resolve(PrismaService)
        await prisma.user.deleteMany();
    });

    it('Deve logar com sucesso', async () => {
        return request(app.getHttpServer())
            .post('/login')
            .send({ username: 'bi', password: 'bi' })
            .expect(200)
            .then(response => {
                expect(response.body).toEqual({ access_token: expect.any(String), });
            })
    });

    it('Deve ocorrer um erro ao tentar logar com um usuário desativado', async () => {
        const userService = await app.resolve(UsersService)
        const newUser = { username: 'elbert', password: '1234', role: 'user' }
        const user = await userService.create(newUser)
        await userService.deactivate(user.id)

        return request(app.getHttpServer())
            .post('/login')
            .send({ username: newUser.username, password: newUser.password })
            .expect(401)
            .then(response => {
                expect(response.body).toEqual({
                    "message": "Unauthorized",
                    "statusCode": 401,
                });
            })
    });

    it('Deve conseguir consultar seus dados de usuário', async () => {
        const output = await request(app.getHttpServer()).post('/login').send({ username: 'bi', password: 'bi' })

        return request(app.getHttpServer())
            .get('/me')
            .send({ username: 'bi', password: 'bi' })
            .set('Authorization', `Bearer ${output.body.access_token}`)
            .expect(200)
            .then(response => {
                expect(response.body).toEqual({
                    id: expect.any(String),
                    username: expect.any(String),
                    active: expect.any(Boolean),
                    role: expect.any(String),
                });
            })
    });

});
