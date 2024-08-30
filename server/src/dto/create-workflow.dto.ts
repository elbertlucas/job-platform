import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsIn } from 'class-validator';
import { Workflow } from 'src/entities/workflow.entity';

export class CreateWorkflowDto implements Workflow {
  @IsString()
  @IsOptional()
  id: string;
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsBoolean()
  @IsOptional()
  active: boolean;
  @IsBoolean()
  @IsOptional()
  scheduled: boolean;
  @IsString()
  @IsNotEmpty()
  context_id: string;
  @IsNotEmpty()
  @IsIn(['bat', 'ps1'])
  extension: string;
  @IsString()
  @IsNotEmpty()
  script: string;
}
