import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../../shared/database/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('No autorizado');
    }

    const userWithRole = await this.prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!userWithRole || !requiredRoles.includes(userWithRole.role)) {
      throw new ForbiddenException('No tienes permisos para esta acción');
    }

    return true;
  }
}
