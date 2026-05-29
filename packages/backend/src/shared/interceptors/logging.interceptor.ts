import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip, headers, user, tenant } = request;
    const start = Date.now();

    return next.handle().pipe(
      tap(async (response) => {
        const duration = Date.now() - start;
        const statusCode = context.switchToHttp().getResponse().statusCode;

        // Log solo acciones importantes
        if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method) && tenant?.id) {
          await this.prisma.auditLog.create({
            data: {
              tenantId: tenant?.id,
              userId: user?.id,
              action: `${method} ${url}`,
              entityType: url.split('/')[1] || 'unknown',
              ipAddress: ip,
              userAgent: headers['user-agent'],
            },
          });
        }

        console.log(`[${new Date().toISOString()}] ${method} ${url} ${statusCode} - ${duration}ms - Tenant: ${tenant?.slug || 'none'}`);
      }),
    );
  }
}
