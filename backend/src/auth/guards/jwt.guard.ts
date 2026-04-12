import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../../common/interfaces/jwt-payload.interface';

@Injectable()
export class JwtGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization as string | undefined;

    if (!authorization) {
      throw new UnauthorizedException('Authorization header is missing.');
    }

    const [scheme, token] = authorization.split(' ');
    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('Bearer token is required.');
    }

    const secret = process.env.ACCESS_SECRET;
    if (!secret) {
      throw new UnauthorizedException('ACCESS_SECRET is not configured.');
    }

    try {
      const decoded = jwt.verify(token, secret) as JwtPayload;
      request.user = decoded;
      return true;
    } catch {
      throw new UnauthorizedException('Token is invalid or expired.');
    }
  }
}
