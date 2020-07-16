import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class HttpJwtAuthGuard extends AuthGuard('jwt') {}
