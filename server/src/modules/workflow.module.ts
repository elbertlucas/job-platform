import { Module } from '@nestjs/common';
import { WorkflowController } from '../controllers/workflow.controller';
import { WorkflowService } from '../services/workflow.service';
import { PrismaModule } from './prisma.module';
import { LogModule } from './log.module';

@Module({
  imports: [PrismaModule, LogModule],
  controllers: [WorkflowController],
  providers: [WorkflowService],
  exports: [WorkflowService],
})
export class WorkflowModule {}
