import { Controller, Post, Body, Res, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: any, @Res({ passthrough: true }) response: any, @Req() request: any) {
    const result = await this.authService.login(
      body.email,
      body.password,
      body.tenantSlug,
      request.ip,
      request.headers['user-agent']
    );
    
    response.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    
    return { accessToken: result.accessToken, user: result.user };
  }

  @Public()
  @Post('register')
  async register(@Body() body: any) {
    return this.authService.register(body.email, body.password, body.name, body.tenantSlug);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) response: any) {
    response.clearCookie('refreshToken');
    return { message: 'Sesión cerrada correctamente' };
  }
}
