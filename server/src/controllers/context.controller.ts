import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ContextService } from '../services/context.service';
import { UpdateContextDto } from '../dto/update-context.dto';
import { CreateContextDto } from '../dto/create-context.dto';

@Controller('context')
export class ContextController {
  constructor(private readonly contextService: ContextService) {}

  @Post()
  createContext(@Body() createContextDto: CreateContextDto) {
    return this.contextService.createContext(createContextDto);
  }

  @Post(':name')
  startFlowByContextName(@Param('name') name: string) {
    return this.contextService.startFlowByContextName(name);
  }

  @Post('activate/:id')
  activate(@Param('id') id: string) {
    return this.contextService.activate(id);
  }

  @Post('deactivate/:id')
  deactivate(@Param('id') id: string) {
    return this.contextService.deactivate(id);
  }

  @Get()
  findAllContext() {
    return this.contextService.findAllContext();
  }

  @Get(':name')
  findAllContextByName(@Param('name') name: string) {
    return this.contextService.findAllContextByName(name);
  }

  @Delete(':id')
  deleteContextById(@Param('id') id: string) {
    return this.contextService.deleteContextById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContextDto: UpdateContextDto) {
    return this.contextService.update(id, updateContextDto);
  }
}
