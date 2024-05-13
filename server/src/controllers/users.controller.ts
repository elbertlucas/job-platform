import { Body, Controller, Post, Get, Delete, Param } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UserCreateDto } from '../dto/user-create.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() userCreate: UserCreateDto) {
    const { username, password, role } = userCreate;
    return this.usersService.create({ username, password, role });
  }

  @Delete('/:id')
  delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
  @Post('/activate/:id')
  activate(@Param('id') id: string) {
    return this.usersService.activate(id);
  }
  @Post('/deactivate/:id')
  deactivate(@Param('id') id: string) {
    return this.usersService.deactivate(id);
  }

  @Get()
  allUsers() {
    return this.usersService.findAll();
  }
}
