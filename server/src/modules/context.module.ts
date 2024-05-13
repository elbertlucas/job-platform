import { Module } from '@nestjs/common';
import { ContextService } from '../services/context.service';
import { ContextController } from '../controllers/context.controller';
import { PrismaModule } from './prisma.module';
import { TaskModule } from './task.module';
import { WorkflowModule } from './workflow.module';

@Module({
  imports: [PrismaModule, TaskModule, WorkflowModule],
  controllers: [ContextController],
  providers: [ContextService],
})
export class ContextModule {}
