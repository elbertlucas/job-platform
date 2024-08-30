import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateContextDto } from '../dto/update-context.dto';
import { CreateContextDto } from '../dto/create-context.dto';
import { PrismaService } from './prisma.service';
import { TaskService } from './task.service';
import { WorkflowService } from './workflow.service';

@Injectable()
export class ContextService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly task: TaskService,
    private readonly workflowService: WorkflowService,
  ) { }

  async createContext(createContextDto: CreateContextDto) {
    const context = await this.prisma.context.findUnique({
      where: { name: createContextDto.name },
    });
    if (context) throw new BadRequestException('Grupo já existe');
    await this.prisma.context.create({
      data: {
        name: createContextDto.name,
      },
    });
  }
  async findAllContext() {
    return await this.prisma.context.findMany({
      select: {
        id: true,
        name: true,
        create_at: true,
        active: true,
        workflow: {
          select: {
            name: true,
          },
        },
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
      },
    });
  }
  async findAllContextByName(name: string) {
    const context = await this.prisma.context.findUnique({
      where: { name },
      select: {
        id: true,
        name: true,
        create_at: true,
        active: true,
        workflow: {
          select: {
            id: true,
            name: true,
            active: true,
          },
        },
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
      },
    });
    if (!context) throw new BadRequestException('Nome do grupo é inválido');
    return context
  }

  async startFlowByContextName(name: string) {
    const context = await this.findAllContextByName(name);
    if (!context) throw new BadRequestException('Nome do grupo é inválido');
    if (context.workflow.length == 0)
      throw new BadRequestException('Nenhuma tarefa atrelada ao grupo');
    for (const flow of context.workflow) {
      await this.task.runningWorkflow(flow.id);
    }
  }

  async update(id: string, updateContextDto: UpdateContextDto) {
    return await this.prisma.context.update({
      where: { id },
      data: { ...updateContextDto },
    });
  }

  async activate(id: string) {
    const context = await this.prisma.context.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        workflow: { select: { id: true } },
      },
    });
    if (!context) throw new BadRequestException('id do grupo inválido');
    await this.prisma.context.update({
      where: { id },
      data: { active: true },
    });
    for (const workflow of context.workflow) {
      await this.workflowService.activate(workflow.id);
    }
  }

  async deactivate(id: string) {
    const context = await this.prisma.context.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        workflow: { select: { id: true } },
      },
    });
    if (!context) throw new BadRequestException('id do grupo inválido');
    await this.prisma.context.update({
      where: { id },
      data: { active: false },
    });
    for (const workflow of context.workflow) {
      await this.workflowService.deactivate(workflow.id);
    }
  }

  async deleteContextById(id: string) {
    const context = await this.prisma.context.findUnique({
      where: { id },
      select: {
        id: true,
        workflow: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (!context) throw new BadRequestException('id do grupo inválido');
    if (context.workflow.length > 0) {
      for (const workflow of context.workflow) {
        await this.workflowService.remove(workflow.id);
      }
    }
    return await this.prisma.context.delete({
      where: { id: context.id },
    });
  }
}
