import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { IResponsToken, IResponsUser, IToken } from 'src/types/types';
import { Tokens } from 'src/auth/entities/tokens.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { TryCatchWrapper } from 'src/decorators/error-cach.decorator';
import { TryCatchWrapper } from '../decorators/error-cach.decorator';
import { User } from 'src/user/entities/user.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { cookieOptions } from '../utils/save-cookie-obj';
import { Response } from 'express';
// import * as dotenv from 'dotenv';
// dotenv.config();
// const { JWT_SECRET } = process.env;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Tokens)
    private readonly tokensRepository: Repository<Tokens>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @TryCatchWrapper()
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (user && isPasswordValid) {
      return user;
    }
    throw new UnauthorizedException('Email os password are incorrect');
  }

  // @TryCatchWrapper()
  async validateToken(token: string) {
    if (!token) {
      throw new UnauthorizedException();
    }
    return this.jwtService.verify(token);
  }

  // @TryCatchWrapper()
  async responseTokenNormalize(tokenAll: any): Promise<IResponsToken> {
    const { accessToken: token } = tokenAll;
    return token;
  }

  // @TryCatchWrapper()
  private async generateTokens(payload: object) {
    const accessToken = this.jwtService.sign(payload, {
      // algorithm: 'RS256',
      expiresIn: '5m',
    });
    const refreshToken = this.jwtService.sign(payload, {
      // algorithm: 'RS256',
      expiresIn: '15d',
    });
    return { accessToken, refreshToken };
  }

  // @TryCatchWrapper()
  private async saveToken(userId: User, tokens: any): Promise<IToken> {
    const { refreshToken, accessToken } = tokens;

    const data = await this.userService.findOneByID(userId.id);

    if (!data.tokenId) {
      throw new UnauthorizedException();
    }
    return await this.tokensRepository.save({
      ...data.tokenId,
      refreshToken,
      accessToken,
    });
  }

  // @TryCatchWrapper()
  async signUp(createUserDto: CreateUserDto): Promise<IResponsUser> {
    const user = await this.userService.create(createUserDto);
    return await this.userService.responseUserNormalize(user);
  }

  // @TryCatchWrapper()
  async signIn(res: Response, userEmail: string, password: string) {
    const user = await this.validateUser(userEmail, password);
    const { id, email, userName } = user;
    const tokens = await this.generateTokens({
      id,
      email,
      userName,
    });
    const newTokens = await this.saveToken(user, tokens);
    const goodUser = await this.userService.findOneByID(id);
    const token = goodUser.tokenId.accessToken;

    res.cookie('refreshToken', newTokens.refreshToken, cookieOptions);

    return {
      token,
      user: await this.userService.responseUserNormalize(goodUser),
    };
  }

  // @TryCatchWrapper()
  async logOut(refreshToken: string) {
    const { id } = await this.tokensRepository.findOne({
      where: { refreshToken },
    });

    await this.tokensRepository.update(id, {
      refreshToken: '',
      accessToken: '',
    });
    return { massage: 'The exit was completed successfully!' };
  }

  // @TryCatchWrapper()
  async verify(verificationKey: string) {
    const { id } = await this.userRepository.findOne({
      where: { verificationKey },
    });

    if (!id) {
      throw new NotFoundException('The verification link not found!');
    }
    await this.userRepository.update(id, {
      verificationKey: '',
      isVerify: true,
    });
    return { massage: 'The verification was successful. ' };
  }

  // @TryCatchWrapper()
  async refresh(res: Response, refToken: string) {
    await this.validateToken(refToken);

    const token = await this.tokensRepository.findOne({
      where: { refreshToken: refToken },
      relations: ['userId'],
    });

    const { id, email, userName } = token.userId;

    const tokens = await this.generateTokens({
      id,
      email,
      userName,
    });
    const { refreshToken, accessToken } = await this.saveToken(
      token.userId,
      tokens,
    );
    res.cookie('refreshToken', refreshToken, cookieOptions);
    return {
      token: accessToken,
      user: await this.userService.responseUserNormalize(token.userId),
    };
  }
}
