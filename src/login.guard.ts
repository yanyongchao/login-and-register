import { JwtService } from '@nestjs/jwt';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class LoginGuard implements CanActivate {
  @Inject(JwtService)
  private jwtService: JwtService;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const token = request.header('authorization') || '';

    if (!token) {
      throw new UnauthorizedException('登录 token 错误');
    }

    try {
      const info = this.jwtService.verify(token);
      (request as any).user = info.user;
      return true;
    } catch (e) {
      throw new UnauthorizedException('登录 token 失效，请重新登录');
    }
  }
}
