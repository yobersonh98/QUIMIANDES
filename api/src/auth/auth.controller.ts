import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { PublicEnpoint } from '../common/PublicEndpoint';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @PublicEnpoint()
  @UseGuards(AuthGuard('local'))
  @Post()
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
