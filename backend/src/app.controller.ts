import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  root() {
    return {
      message: 'SaaS Backend API',
      status: 'online',
      version: '1.0.0',
      endpoints: {
        auth: '/api/auth',
        users: '/api/users',
        products: '/api/products',
        services: '/api/services',
        agendas: '/api/agendas',
        cart: '/api/cart',
        purchases: '/api/purchases',
        points: '/api/points',
        reports: '/api/reports',
        health: '/api/health'
      }
    };
  }

  @Get('health')
  health() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    };
  }

  @Get('ping')
  ping() {
    return { pong: true, timestamp: new Date().toISOString() };
  }
}