import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../../shared/database/prisma.service';
import { RedisService } from '../../shared/redis/redis.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, RedisService],
  exports: [UserService],
})
export class UserModule {}
