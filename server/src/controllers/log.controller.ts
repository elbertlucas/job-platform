import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { LogService } from '../services/log.service';
import { endOfDay, formatISO, startOfDay } from 'date-fns';

@Controller('logs')
export class LogController {
  constructor(private readonly logService: LogService) {}
  @Get('?')
  getAll(@Query('from') fromText: string, @Query('to') toText: string) {
    let from = undefined;
    let to = undefined;
    if (fromText == 'undefined' || toText == 'undefined') {
      from = new Date(formatISO(startOfDay(new Date(2024, 1, 1))));
      to = new Date(formatISO(endOfDay(new Date(2099, 1, 1))));
    } else {
      from = new Date(formatISO(startOfDay(new Date(fromText))));
      to = new Date(formatISO(endOfDay(new Date(toText))));
    }
    return this.logService.findAll(from, to);
  }

  @Get('/context/:id')
  getByContext(@Param('id') id: string) {
    return this.logService.getByContext(id);
  }

  @Delete('/:id')
  deleteFlowsById(@Param('id') id: string) {
    return this.logService.dropLogByid(id);
  }
  @Delete()
  deleteFlows() {
    return this.logService.clearLogs();
  }
}
