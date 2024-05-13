import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { TaskService } from '../services/task.service';
import { CreateTaskDto } from '../dto/create-task.dto';

@Controller()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('tasks')
  addCronJob(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.addCronJob(createTaskDto);
  }

  @Get('tasks/:id')
  startFlow(@Param('id') flowId: string): Promise<string> {
    return this.taskService.runningWorkflow(flowId);
  }

  @Post('tasks/deactivate/:id')
  deactivateTask(@Param('id') id: string): Promise<string> {
    return this.taskService.deactivateTask(id);
  }

  @Post('tasks/activate/:id')
  activateTask(@Param('id') id: string): Promise<string> {
    return this.taskService.activateTask(id);
  }

  @Get('tasks')
  getCronsJobs() {
    return this.taskService.getCrons();
  }

  @Delete('tasks/:id')
  removeCronJob(@Param('id') id: string) {
    return this.taskService.deleteCron(id);
  }
}
