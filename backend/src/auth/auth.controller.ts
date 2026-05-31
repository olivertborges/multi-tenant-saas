import { Controller, Post, Body, Get, UseGuards, Req, Res, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: any, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(body.email, body.password, body.tenantSlug);
  }

  @Public()
  @Post('register')
  async register(@Body() body: any) {
    return this.authService.register(body.email, body.password, body.name, body.tenantSlug, body.tenantName);
  }

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Redirige a Google
  }

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: any, @Res() res: Response) {
    const { email, name, picture } = req.user;
    
    // Buscar o crear usuario con Google
    const result = await this.authService.loginWithGoogle(email, name, picture);
    
    // Redirigir al frontend con el token
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${result.accessToken}`);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refreshToken');
    return { message: 'Sesión cerrada correctamente' };
  }
}
