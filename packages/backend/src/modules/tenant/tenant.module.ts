import { Module } from '@nestjs/common';
import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';
import { PrismaService } from '../../shared/database/prisma.service';
import { RedisService } from '../../shared/redis/redis.service';

@Module({
  controllers: [TenantController],
  providers: [TenantService, PrismaService, RedisService],
  exports: [TenantService],
})
export class TenantModule {}
