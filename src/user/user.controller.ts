import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CombinedAuthGuard } from 'src/auth/guards/combined-Auth.guard';
import { IResponsUser } from 'src/types/types';

@UseGuards(CombinedAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.userService.findAll(+page, +limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<IResponsUser> {
    const user = await this.userService.findOneByID(+id);
    return this.userService.responseUserNormalize(user);
  }

  @Put()
  @UsePipes(new ValidationPipe())
  async update(@Body() updateUserDto: UpdateUserDto, @Req() req) {
    return await this.userService.update(+req.user.id, updateUserDto);
  }

  @Delete()
  async remove(@Req() req): Promise<IResponsUser> {
    return this.userService.remove(+req.user.id);
  }
}
