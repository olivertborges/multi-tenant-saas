import { Controller, Get } from '@nestjs/common';

@Controller()
export class TestController {
  @Get('ping')
  ping() {
    return { message: 'pong', status: 'ok', timestamp: new Date().toISOString() };
  }
}
