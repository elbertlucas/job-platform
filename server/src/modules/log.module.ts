import { Module } from '@nestjs/common';
import { LogService } from '../services/log.service';
import { PrismaModule } from './prisma.module';
import { LogController } from '../controllers/log.controller';

@Module({
  imports: [PrismaModule],
  controllers: [LogController],
  providers: [LogService],
  exports: [LogService],
})
export class LogModule {}
