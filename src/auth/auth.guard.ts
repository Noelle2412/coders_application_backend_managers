import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ROLES_KEY } from './roles.decorator.js';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // 1. Is the header present?
    const header: string | undefined = request.headers['authorization'];
    if (!header) {
      throw new UnauthorizedException('Missing authorization header');
    }
    const token = header.startsWith('Bearer ') ? header.slice(7) : header;

    // 2. Is the token valid?
    let payload: any;
    try {
      payload = await this.jwtService.verifyAsync(token);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    // 3. Is the user's role in the roles declared on the controller/route?
    const allowedRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (allowedRoles && !allowedRoles.includes(payload.role)) {
      throw new ForbiddenException('You do not have access to this resource');
    }

    // 4. Inject user info into the request
    request.user = { id: payload.id, role: payload.role };
    return true;
  }
}
