import { Module } from '@nestjs/common';
import { GDPRController } from './gdpr.controller';
import { GDPRService } from './gdpr.service';

@Module({
  controllers: [GDPRController],
  providers: [GDPRService],
  exports: [GDPRService],
})
export class GDPRModule {}
