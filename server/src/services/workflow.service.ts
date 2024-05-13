import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreateWorkflowDto } from '../dto/create-workflow.dto';
import { UpdateWorkflowDto } from '../dto/update-workflow.dto';
import { ConfigService } from '@nestjs/config';
import { unlinkSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { existsSync, mkdirSync } from 'node:fs';
import { workflowMapper } from '../utils/mappers';
import { Workflow } from '../entities/workflow.entity';
import { LogService } from './log.service';
import { ModuleRef } from '@nestjs/core';
import { TaskService } from './task.service';

@Injectable()
export class WorkflowService {
  constructor(
    private moduleRef: ModuleRef,
    private readonly prisma: PrismaService,
    private readonly logService: LogService,
    private readonly configService: ConfigService,
  ) {}
  private readonly logger = new Logger(WorkflowService.name);
  async create(createWorkflowDto: CreateWorkflowDto) {
    if (!existsSync('./src/workflows')) mkdirSync('./src/workflows');
    const newWorkflow = await this.prisma.workflow.create({
      data: {
        name: createWorkflowDto.name,
        context_id: createWorkflowDto.context_id,
      },
    });

    this.createBatch(newWorkflow);
  }

  async createBatch(newWorkflow: Workflow) {
    const kinmeInstalation = this.configService.get('KNIME_INSTALATION_PATH');
    const args = this.configService.get('KNIME_ARGS');
    const directoryBase = this.configService.get('KNIME_WORKSPACE');
    const extension = '.bat';
    const script = `${kinmeInstalation} ${args} ${directoryBase}${newWorkflow.name}"`;
    const pathFile = resolve(
      join('./src/workflows', `${newWorkflow.name}${extension}`),
    );
    writeFileSync(pathFile, script);
    this.logger.debug(`workflow ${newWorkflow.name} created`);
  }

  async findAll() {
    const values = await this.prisma.workflow.findMany({
      select: {
        id: true,
        name: true,
        scheduled: true,
        context_id: true,
        active: true,
        Log: {
          where: {
            status: {
              equals: 'started',
            },
          },
          select: {
            workflow: true,
          },
        },
        Task: {
          select: {
            id: true,
            name: true,
            active: true,
            cron_time: true,
            label: true,
          },
        },
      },
    });

    return values.map((workflow) => workflowMapper(workflow));
  }

  async findOne(id: string) {
    const workflow = await this.prisma.workflow.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        scheduled: true,
        context_id: true,
        active: true,
        Log: {
          where: {
            status: {
              equals: 'started',
            },
          },
          select: {
            workflow: true,
          },
        },
        Task: {
          select: {
            id: true,
            name: true,
            active: true,
            cron_time: true,
            label: true,
          },
        },
      },
    });

    return workflowMapper(workflow);
  }

  update(id: string, updateWorkflowDto: UpdateWorkflowDto) {
    return this.prisma.workflow.update({
      where: { id },
      data: { ...updateWorkflowDto },
    });
  }
  async deactivate(id: string) {
    const workflow = await this.findOne(id);
    if (!workflow) throw new BadRequestException('Workflow id é inválido');
    await this.prisma.workflow.update({
      where: { id },
      data: { active: false },
    });
    for (const task of workflow.tasks) {
      await this.prisma.task.update({
        where: { id: task.id },
        data: { active: false },
      });
    }
  }

  async activate(id: string) {
    const workflow = await this.findOne(id);
    if (!workflow) throw new BadRequestException('Workflow id é inválido');
    await this.prisma.workflow.update({
      where: { id },
      data: { active: true },
    });
    for (const task of workflow.tasks) {
      await this.prisma.task.update({
        where: { id: task.id },
        data: { active: true },
      });
    }
  }

  async remove(id: string) {
    const workflow = await this.findOne(id);
    if (!workflow) throw new BadRequestException('workflow id invalid');
    const tasks = await this.prisma.task.findMany({
      where: { workflow_id: workflow.id },
    });
    const taskService = await this.moduleRef.create(TaskService);
    if (tasks.length > 0) {
      for (const task of tasks) {
        await taskService.deleteCron(task.id);
      }
    }
    await this.logService.clearLogsByWorkflowId(workflow.id);
    this.removeBatch(workflow);
    return this.prisma.workflow.delete({
      where: { id },
    });
  }

  async removeBatch(workflow: Workflow) {
    const extension = '.bat';
    const pathFile = resolve(
      join('./src/workflows', `${workflow.name}${extension}`),
    );

    unlinkSync(pathFile);
    this.logger.warn(`workflow deleted: ${workflow.name}`);
  }
}
