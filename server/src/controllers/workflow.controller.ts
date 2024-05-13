import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WorkflowService } from '../services/workflow.service';
import { CreateWorkflowDto } from '../dto/create-workflow.dto';
import { UpdateWorkflowDto } from '../dto/update-workflow.dto';

@Controller()
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Post('workflow')
  create(@Body() createWorkflowDto: CreateWorkflowDto) {
    return this.workflowService.create(createWorkflowDto);
  }

  @Get('workflow')
  findAll() {
    return this.workflowService.findAll();
  }

  @Get('workflow/:name')
  findOne(@Param('name') name: string) {
    return this.workflowService.findOne(name);
  }

  @Post('workflow/deactivate/:id')
  deactivate(@Param('id') id: string) {
    return this.workflowService.deactivate(id);
  }

  @Post('workflow/activate/:id')
  activate(@Param('id') id: string) {
    return this.workflowService.activate(id);
  }

  @Patch('workflow/:id')
  update(
    @Param('id') id: string,
    @Body() updateWorkflowDto: UpdateWorkflowDto,
  ) {
    return this.workflowService.update(id, updateWorkflowDto);
  }

  @Delete('workflow/:id')
  remove(@Param('id') id: string) {
    return this.workflowService.remove(id);
  }
}
