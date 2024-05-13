import { Module } from '@nestjs/common';
import { TaskService } from '../services/task.service';
import { TaskController } from '../controllers/task.controller';
import { PrismaModule } from './prisma.module';
import { LogModule } from './log.module';
import { WorkflowModule } from './workflow.module';

@Module({
  imports: [PrismaModule, LogModule, WorkflowModule],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
