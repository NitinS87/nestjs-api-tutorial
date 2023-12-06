import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDTO, LoginDTO } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: LoginDTO) {
    // console.log(dto);
    return this.authService.login(dto);
  }

  @Post('signup')
  async signup(@Body() dto: SignUpDTO) {
    return this.authService.signup(dto);
  }
}
