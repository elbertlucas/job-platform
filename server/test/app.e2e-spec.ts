import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/modules/app.module';
import { AppService } from '../src/services/app.service';
import { AppController } from '../src/controllers/app.controller';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [AppService],
      controllers: [AppController],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Deve retornar não autorizado quando não está logado', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(401)
      .expect({ "message": "Unauthorized", "statusCode": 401 });
  });

  
});
