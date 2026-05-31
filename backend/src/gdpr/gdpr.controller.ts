import { Controller, Get, Delete, Post, Body, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { GDPRService } from './gdpr.service';

@Controller('gdpr')
export class GDPRController {
  constructor(private readonly gdprService: GDPRService) {}

  @Get('export')
  async exportData(@Req() req: any, @Res() res: Response) {
    const userId = req.user?.userId;
    const data = await this.gdprService.exportUserData(userId);
    
    // Enviar como archivo JSON descargable
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="mis-datos.json"');
    res.send(JSON.stringify(data, null, 2));
  }

  @Delete('delete')
  async deleteData(@Req() req: any) {
    const userId = req.user?.userId;
    return this.gdprService.deleteUserData(userId);
  }

  @Get('consent')
  async getConsent(@Req() req: any) {
    const userId = req.user?.userId;
    return this.gdprService.getUserConsent(userId);
  }

  @Post('consent')
  async updateConsent(@Body() body: any, @Req() req: any) {
    const userId = req.user?.userId;
    return this.gdprService.updateUserConsent(userId, body);
  }
}
