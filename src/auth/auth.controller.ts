import {
  Controller,
  Post,
  UseGuards,
  Get,
  Body,
  Res,
  Param,
  Req,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import * as dotenv from 'dotenv';
import { CombinedAuthGuard } from './guards/combined-Auth.guard';
import { IResponsUser } from 'src/types/types';
import { Request, Response } from 'express';
import { UserService } from 'src/user/user.service';
dotenv.config();
const { CLIENT_URL } = process.env;

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('signUp')
  @HttpCode(201)
  async signUp(@Body() createUserDto: CreateUserDto): Promise<IResponsUser> {
    return this.authService.signUp(createUserDto);
  }

  @HttpCode(200)
  @Post('signIn')
  async signIn(
    @Res({ passthrough: true }) res: Response,
    @Body() { email, password },
  ) {
    return await this.authService.signIn(res, email, password);
  }

  @Get('verify/:verificationKey')
  async verify(
    @Res({ passthrough: true }) res: Response,
    @Param('verificationKey') verificationKey: string,
  ) {
    const response = await this.authService.verify(verificationKey);
    res.redirect(CLIENT_URL);
    return response;
  }

  @UseGuards(CombinedAuthGuard)
  @HttpCode(200)
  @Post('logOut')
  async logOut(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const { refreshToken } = req.cookies;
    const token = await this.authService.logOut(refreshToken);
    res.clearCookie('refreshToken');
    return token;
  }

  @Get('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken } = req.cookies;
    const token = await this.authService.refresh(res, refreshToken);
    return token;
  }

  @UseGuards(CombinedAuthGuard)
  @Get('me')
  async getProfile(@Req() req: any) {
    return await this.userService.responseUserNormalize(req.user);
  }
}
