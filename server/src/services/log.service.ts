import { Injectable, Logger } from '@nestjs/common';
import { CreateLog, UpdateLog } from '../entities/create-log.entity';
import { PrismaService } from './prisma.service';

@Injectable()
export class LogService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly logger = new Logger(LogService.name);
  async create(createLog: CreateLog) {
    const log = await this.prisma.log.create({ data: createLog });
    this.logger.debug(`log created: ${log.id} flow: ${log.workflow_name}`);
  }
  findAll(from: Date, to: Date) {
    return this.prisma.log.findMany({
      where: {
        start_at: {
          gte: from,
          lte: to,
        },
      },
      orderBy: { start_at: 'desc' },
      select: {
        id: true,
        code: true,
        status: true,
        message: true,
        start_at: true,
        finish_at: true,
        workflow: true,
        context: {
          select: {
            name: true,
          },
        },
      },
    });
  }
  findByID(id: string) {
    return this.prisma.log.findUnique({ where: { id } });
  }
  async updateLog(updateLog: UpdateLog) {
    try {
      this.logger.debug(
        `log updated: ${updateLog.id} flow: ${updateLog.workflow_name}`,
      );
      await this.prisma.log.update({
        where: { id: updateLog.id },
        data: {
          workflow_name: updateLog.workflow_name,
          message: updateLog.message,
          context_id: updateLog.context_id,
          code: updateLog.code,
          status: updateLog.status,
          finish_at: updateLog.finish_at,
        },
      });
    } catch (error) {
      this.logger.error(`log updated error: ${JSON.stringify(error)}`);
    }
  }
  dropLogByid(id: string) {
    return this.prisma.log.delete({
      where: { id },
    });
  }
  clearLogs() {
    return this.prisma.log.deleteMany();
  }
  clearLogsByWorkflowId(workflowId: string) {
    return this.prisma.log.deleteMany({ where: { workflow_id: workflowId } });
  }
  getByContext(id: string) {
    return this.prisma.log.findMany({
      where: {
        context_id: id,
        AND: {
          status: { equals: 'started' },
        },
      },
    });
  }
}
