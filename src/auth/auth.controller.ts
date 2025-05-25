import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Register user with password',
    description:
      'Use POST method in `/auth/register` route to register a new user with password.',
  })
  @Post('/register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Get('/verify')
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @ApiOperation({
    summary: 'Login user with password',
    description:
      'Use POST method in `/auth/login` route to register a new user with password.',
  })
  @Post('/login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('/forgot-password')
  forgotPassword() {
    return 'Send Reset email';
  }

  @Post('/reset-password')
  resetPassword() {
    return 'set new email';
  }

  @Get('/google')
  google() {
    return 'Test';
  }

  @Get('/google-redirect')
  googleRedirect() {
    return 'Test';
  }
}
