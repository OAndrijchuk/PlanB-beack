import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
// export class CombinedAuthGuard extends AuthGuard(['auth0', 'jwt']) {}
export class CombinedAuthGuard extends AuthGuard(['jwt']) {}
