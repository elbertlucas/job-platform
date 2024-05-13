import { IsNotEmpty, IsString } from 'class-validator';
import { Context } from '../entities/context.entity';

export class CreateContextDto implements Context {
  @IsString()
  @IsNotEmpty()
  name: string;
}
