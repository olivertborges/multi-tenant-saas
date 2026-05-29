import { Controller, Post, Body, Res, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() body: { email: string; password: string; tenantSlug: string },
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request
  ) {
    const result = await this.authService.login(
      body.email,
      body.password,
      body.tenantSlug,
      request.ip,
      request.headers['user-agent']
    );
    
    response.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: false, // true en producción con HTTPS
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    
    return { accessToken: result.accessToken, user: result.user };
  }

  @Post('register')
  async register(@Body() body: { email: string; password: string; name: string; tenantSlug: string }) {
    return this.authService.register(body.email, body.password, body.name, body.tenantSlug);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('refreshToken');
    return { message: 'Sesión cerrada correctamente' };
  }
}
