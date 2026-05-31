import { Controller, Post, Body, Get, Req } from '@nestjs/common';
import { AIService } from './ai.service';

@Controller('ai')
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Post('chat')
  async chat(@Body() body: any, @Req() req: any) {
    const userId = req.user?.userId;
    const tenantId = req.user?.tenantId;
    return this.aiService.chat(body.message, userId, tenantId);
  }

  @Get('recommendations')
  async getRecommendations(@Req() req: any) {
    const userId = req.user?.userId;
    const tenantId = req.user?.tenantId;
    return this.aiService.recommendProducts(userId, tenantId);
  }
}
