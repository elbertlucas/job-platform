import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { TaskModule } from './task.module';
import { ScheduleModule } from '@nestjs/schedule';
import { Module } from '@nestjs/common';
import { WorkflowModule } from './workflow.module';
import { ConfigModule } from '@nestjs/config';
import { LogModule } from './log.module';
import { PrismaModule } from './prisma.module';
import { AuthModule } from './auth.module';
import { UsersModule } from './users.module';
import { ContextModule } from './context.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    TaskModule,
    PrismaModule,
    LogModule,
    WorkflowModule,
    AuthModule,
    UsersModule,
    ContextModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
