import {
  BadRequestException,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { CronJob } from 'cron';
import { SchedulerRegistry } from '@nestjs/schedule';
import { WorkflowService } from './workflow.service';
import { join, resolve } from 'node:path';
import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { LogService } from './log.service';
import { PrismaService } from './prisma.service';
import { CreateTaskDto } from '../dto/create-task.dto';

@Injectable()
export class TaskService implements OnModuleInit {
  constructor(
    private readonly workflow: WorkflowService,
    private readonly prisma: PrismaService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly log: LogService,
  ) { }
  private readonly logger = new Logger(TaskService.name);

  async onModuleInit() {
    const workflows = await this.workflow.findAll();
    for (const workflow of workflows) {
      if (workflow.scheduled) {
        for (const task of workflow.tasks) {
          this.addCronJob({
            cron_time: task.cron_time,
            label: task.label,
            workflow_id: workflow.id,
            task_id: task.id,
          });
        }
      }
    }
  }

  async addCronJob(createTaskDto: CreateTaskDto) {
    const { workflow_id, cron_time, label, task_id } = createTaskDto;
    const workflow = await this.workflow.findOne(workflow_id);
    if (!workflow) throw new BadRequestException('id da tarefa é inválido');
    try {
      const taskId = task_id || randomUUID();
      const slug = taskId.substring(0, 8);
      const job = new CronJob(cron_time, () =>
        this.runningWorkflowSchedule(taskId),
      );
      this.schedulerRegistry.addCronJob(slug, job);
      job.start();

      if (!task_id) {
        await this.prisma.task.create({
          data: {
            id: taskId,
            slug: slug,
            label: label,
            name: workflow.name,
            cron_time: cron_time,
            workflow_id: workflow.id,
          },
        });
      }

      await this.prisma.workflow.update({
        where: { id: workflow.id },
        data: { scheduled: true },
      });

      const msg = `job ${workflow.name} added for cron time (${cron_time}) !`;
      this.logger.warn(msg);
      return msg;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Codigo cron é inválido');
    }
  }

  async getCrons() {
    const jobsList = [];
    const jobs = this.schedulerRegistry.getCronJobs();
    jobs.forEach((value, key) => {
      this.logger.log(`job: ${key} -> cron_time: ${value.cronTime.toString()}`);
      jobsList.push({ name: key, time: value.cronTime.toString() });
    });

    return await this.prisma.task.findMany();
  }

  async deleteCron(id: string) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) throw new BadRequestException(`Id da tarefa inválido`);
    this.schedulerRegistry.deleteCronJob(task.slug);
    const workflow = await this.workflow.findOne(task.workflow_id);
    await this.prisma.task.delete({ where: { id: task.id } });
    if (workflow.tasks.length == 1)
      await this.prisma.workflow.update({
        where: { id: workflow.id },
        data: { scheduled: false },
      });
    this.logger.warn(`job ${task.name} deleted!`);
    return `job ${task.name} deleted!`;
  }

  async deactivateTask(id: string): Promise<string> {
    const task = await this.prisma.task.update({
      where: { id },
      data: { active: false },
    });
    return `workflow activate =  ${task.active}`;
  }

  async activateTask(id: string): Promise<string> {
    const task = await this.prisma.task.update({
      where: { id },
      data: { active: true },
    });
    return `workflow activate =  ${task.active}`;
  }

  async runningWorkflow(flowId: string): Promise<string> {
    const workflow = await this.workflow.findOne(flowId);
    if (!workflow) return `workflow ${flowId} not started!`;
    const pathFile = resolve(join('./src/workflows', `${workflow.name}.${workflow.extension}`));
    this.execProcess(workflow.name, workflow.id, pathFile, workflow.context_id, workflow.extension);
    return `workflow ${workflow.name} started!`;
  }

  async runningWorkflowSchedule(task_id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: task_id },
    });
    if (task.active) {
      const workflow = await this.workflow.findOne(task.workflow_id);
      const pathFile = resolve(join('./src/workflows', `${task.name}.${workflow.extension}`));
      this.execProcess(task.name, task.workflow_id, pathFile, workflow.context_id, workflow.extension);
    } else {
      this.logger.warn(`Fluxo ${task.id} está desativado`);
    }
  }

  async execProcess(
    flow: string,
    flowId: string,
    path: string,
    context_id: string,
    extension: string
  ) {
    const newLog = {
      id: randomUUID(),
      workflow_name: flow,
      workflow_id: flowId,
      status: 'started',
      context_id: context_id || null,
      message: '',
    };
    await this.log.create(newLog);
    const log = await this.log.findByID(newLog.id);
    this.logger.debug(`job ${log.workflow_name} started!`);

    const shell = extension == 'bat' ? 'cmd.exe' : 'powershell.exe'
    const command = spawn(path, { shell: shell, windowsHide: true });

    command.on('error', (error) =>
      this.log.updateLog({
        id: log.id,
        workflow_name: log.workflow_name,
        workflow_id: log.workflow_id,
        context_id: context_id,
        message: error.name,
        code: null,
        status: 'error',
        finish_at: new Date(),
      }),
    );

    command.on('close', (code) => {
      if (code == 0) {
        this.log.updateLog({
          id: log.id,
          workflow_name: log.workflow_name,
          workflow_id: log.workflow_id,
          context_id: context_id || null,
          message: 'flow finish',
          code,
          status: 'success',
          finish_at: new Date(),
        });
        console.log(path)
      } else {
        this.log.updateLog({
          id: log.id,
          workflow_name: log.workflow_name,
          workflow_id: log.workflow_id,
          context_id: context_id || null,
          message: 'No success code returned',
          code,
          status: 'error',
          finish_at: new Date(),
        });
      }
    });
  }
}
