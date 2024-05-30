import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { MinLength } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  userName: string;

  token: string;
}
