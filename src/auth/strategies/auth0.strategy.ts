// import { Injectable, Req } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { passportJwtSecret } from 'jwks-rsa';
// import * as dotenv from 'dotenv';
// import { UserService } from 'src/user/user.service';
// import { InjectRepository } from '@nestjs/typeorm';
// import { User } from 'src/user/entities/user.entity';
// import { Repository } from 'typeorm';

// dotenv.config();

// @Injectable()
// export class Auth0Strategy extends PassportStrategy(Strategy, 'auth0') {
//   @InjectRepository(User) private readonly userRepository: Repository<User>;
//   constructor(private userService: UserService) {
//     super({
//       secretOrKeyProvider: passportJwtSecret({
//         cache: true,
//         rateLimit: true,
//         jwksRequestsPerMinute: 5,
//         jwksUri: `${process.env.AUTH0_ISSUER_URL}.well-known/jwks.json`,
//       }),

//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       audience: process.env.AUTH0_AUDIENCE,
//       issuer: `${process.env.AUTH0_ISSUER_URL}`,
//       algorithms: ['RS256'],
//     });
//   }

//   async validate(@Req() req: any): Promise<any> {
//     const newUser = await this.userRepository.findOne({
//       where: { email: req.email },
//       relations: ['tokenId'],
//     });
//     if (!newUser) {
//       const createOptions = { email: req.email, userName: req.name };
//       const auth0User = await this.userService.createAuth0(createOptions);
//       // req.user = auth0User;
//       return auth0User;
//     }
//     // req.user = newUser;
//     return newUser;
//   }
// }
