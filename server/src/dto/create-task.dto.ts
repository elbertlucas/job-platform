import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Task } from '../entities/task.entity';

export class CreateTaskDto implements Task {
  @IsString()
  @IsNotEmpty()
  cron_time: string;
  @IsString()
  @IsNotEmpty()
  workflow_id: string;
  @IsString()
  @IsNotEmpty()
  label: string;
  @IsOptional()
  @IsString()
  task_id?: string;
}
