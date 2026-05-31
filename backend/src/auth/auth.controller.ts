import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: { 
    email: string; 
    password: string; 
    name: string;
    tenantSlug: string;
    tenantName?: string;
  }) {
    return this.authService.register(
      body.email, 
      body.password, 
      body.name, 
      body.tenantSlug,
      body.tenantName
    );
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string; tenantSlug: string }) {
    return this.authService.login(body.email, body.password, body.tenantSlug);
  }
}
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    const { user } = req;
    // Aquí creas o actualizas el usuario en tu base de datos
    // Generas JWT y rediriges al frontend con el token
    const token = this.authService.generateSocialToken(user);
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  }
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    const { email, name, picture } = req.user;
    
    // Buscar o crear usuario
    let user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Crear usuario con Google
      user = await this.prisma.user.create({
        data: {
          email,
          name,
          avatar: picture,
          password: await this.authService.hashPassword(Math.random().toString(36)),
          tenantId: 'default-tenant-id', // Necesitas manejar esto
          roleId: 'default-role-id',
        },
      });
    }

    // Generar JWT
    const token = await this.authService.generateToken(user.id, user.tenantId);
    
    // Redirigir al frontend con el token
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  }
