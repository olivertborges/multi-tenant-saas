import { Controller, Get, Post, Put, Delete, Body, Param, Req } from '@nestjs/common';
import { AgendasService } from './agendas.service';

@Controller('agendas')
export class AgendasController {
  constructor(private readonly agendasService: AgendasService) {}

  @Get()
  async findAll(@Req() req: any) {
    const tenantId = req.user?.tenantId;
    return this.agendasService.findAll(tenantId);
  }

  @Get('my')
  async findMy(@Req() req: any) {
    const userId = req.user?.userId;
    const tenantId = req.user?.tenantId;
    return this.agendasService.findByUser(userId, tenantId);
  }

  @Post()
  async create(@Body() body: any, @Req() req: any) {
    const userId = req.user?.userId;
    const tenantId = req.user?.tenantId;
    return this.agendasService.create(body, userId, tenantId);
  }

  @Put(':id/status')
  async updateStatus(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    const tenantId = req.user?.tenantId;
    return this.agendasService.updateStatus(id, body.status, tenantId);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req: any) {
    const tenantId = req.user?.tenantId;
    return this.agendasService.delete(id, tenantId);
  }
}
