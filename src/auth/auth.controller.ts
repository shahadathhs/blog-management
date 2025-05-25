import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginWithPasswordDto } from './dto/login-with-password.dto';
import { RegisterWithPasswordDto } from './dto/register-with-password.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Login user with password',
    description:
      'Use POST method in `/auth/password-login` route to register a new user with password.',
  })
  @Get('/password-login')
  loginWithPassword(@Body() loginWithPasswordDto: LoginWithPasswordDto) {
    return this.authService.loginWithPassword(loginWithPasswordDto);
  }

  @ApiOperation({
    summary: 'Register user with password',
    description:
      'Use POST method in `/auth/password-register` route to register a new user with password.',
  })
  @Post('/password-register')
  registerWithPassword(
    @Body() registerWithPasswordDto: RegisterWithPasswordDto,
  ) {
    return this.authService.registerWithPassword(registerWithPasswordDto);
  }
}
