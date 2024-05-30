import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { TryCatchWrapper } from 'src/decorators/error-cach.decorator';
import { paginate } from 'src/utils/pagination.util';
import { Tokens } from 'src/auth/entities/tokens.entity';
import { v4 as uuidv4 } from 'uuid';
// import sendEmail from 'src/utils/sendEmail';
// import * as dotenv from 'dotenv';
// dotenv.config();

// const { BASE_URL } = process.env;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Tokens)
    private readonly tokensRepository: Repository<Tokens>,
  ) {}

  @TryCatchWrapper()
  private async checkEmail(email: string) {
    const existUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existUser) {
      throw new BadRequestException('This email already exists!');
    }
    return existUser;
  }

  @TryCatchWrapper()
  private async checkUserExist(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['tokenId'],
    });
    if (!user) {
      throw new BadRequestException(`User with id:${id} does not exist!`);
    }
    return user;
  }

  @TryCatchWrapper()
  async responseUserNormalize(res: any) {
    const { id, email, userName, isVerify } = res;
    const normalizeRes = {
      id,
      email,
      userName,
      isVerify,
    };
    return normalizeRes;
  }

  @TryCatchWrapper()
  async findAll(page: number = 1, limit: number = 20) {
    const users = await this.userRepository.find();

    const paginatedUsers = paginate(users, { page, limit });
    // const newUsers = paginatedUsers.map(
    //   async user => await this.responseUserNormalize(user),
    // );

    // return await Promise.all(newUsers);
    return await Promise.all(paginatedUsers);
  }

  @TryCatchWrapper()
  async create(createUserDto: CreateUserDto) {
    await this.checkEmail(createUserDto.email);

    const hashPassword = await bcrypt.hash(createUserDto.password, 10);
    const verificationKey = uuidv4();
    const user = await this.userRepository.save({
      ...createUserDto,
      password: hashPassword,
      verificationKey,
      token: '',
    });
    const setTok = await this.tokensRepository.save({
      userId: user,
    });
    await this.userRepository.update(user.id, {
      tokenId: setTok,
    });
    // const massage = {
    //   userEmail: user.email,
    //   title: 'NodeJS verification!',
    //   bodyContent: `<a target="_blank" href="${BASE_URL}/auth/verify/${verificationKey}">!!!Click to verify your email!!!</a>`,
    // };
    // sendEmail(massage);

    return user;
  }
  @TryCatchWrapper()
  async createAuth0(userOptions: any) {
    const user = await this.userRepository.save({
      ...userOptions,
      password: '',
      isVerify: true,
      token: '',
    });
    const setTok = await this.tokensRepository.save({
      userId: user,
    });
    await this.userRepository.update(user.id, {
      tokenId: setTok,
    });
    return user;
  }

  @TryCatchWrapper()
  async findOneByID(id: number) {
    const user = await this.checkUserExist(id);
    return user;
  }

  @TryCatchWrapper()
  async findOneByEmail(email: string) {
    const existUser = await this.userRepository.findOne({
      where: { email },
      relations: ['tokenId'],
      select: [
        'password',
        'verificationKey',
        'id',
        'isVerify',
        'userName',
        'email',
        'tokenId',
        'createdAt',
        'updatedAt',
      ],
    });

    if (!existUser) {
      throw new BadRequestException(`User with email:${email} does not exist!`);
    }
    return existUser;
  }

  @TryCatchWrapper()
  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.checkUserExist(id);

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    const updatedUser = { ...user, ...updateUserDto };
    const newUser = await this.userRepository.save(updatedUser);

    return await this.responseUserNormalize(newUser);
  }

  @TryCatchWrapper()
  async remove(id: number) {
    await this.checkUserExist(id);
    const newUser = await this.userRepository.delete({
      id,
    });

    return await this.responseUserNormalize({ user: newUser });
  }
}
