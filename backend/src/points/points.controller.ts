import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { PointsService } from './points.service';

@Controller('points')
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @Get()
  async getPoints(@Req() req: any) {
    const userId = req.user?.userId;
    return { points: await this.pointsService.getUserPoints(userId) };
  }

  @Get('history')
  async getHistory(@Req() req: any) {
    const userId = req.user?.userId;
    return this.pointsService.getPointsHistory(userId);
  }
}
