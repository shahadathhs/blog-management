import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorator/roles.decorator';
import { UserEnum } from 'src/common/enum/user.enum';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SetNewPasswordDto } from './dto/set-new-password.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Register user with password',
    description: 'Registers a new user and sends a verification email.',
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @ApiOperation({
    summary: 'Verify email',
    description: 'Verify email with token from the verification link.',
  })
  @ApiQuery({ name: 'token', required: true })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @Get('verify')
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @ApiOperation({
    summary: 'Login user with password',
    description: 'Logs in a user with email and password.',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @ApiOperation({
    summary: 'Send reset password email',
    description: 'Sends a password reset link to the user’s email.',
  })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({ status: 200, description: 'Reset link sent successfully' })
  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @ApiOperation({
    summary: 'Set new password with token',
    description: 'Sets a new password using the reset token.',
  })
  @ApiBody({ type: SetNewPasswordDto })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @Post('new-password')
  newPassword(@Body() dto: SetNewPasswordDto) {
    return this.authService.setNewPassword(dto);
  }

  @ApiOperation({
    summary: 'Reset password (user must be authenticated)',
    description:
      'Allows logged-in user to reset password by providing current password.',
  })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ status: 200, description: 'Password updated successfully' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserEnum.Admin, UserEnum.Moderator, UserEnum.User)
  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Get('google')
  @ApiOperation({ summary: 'Google OAuth test route' })
  google() {
    return 'Test';
  }

  @Get('google-redirect')
  @ApiOperation({ summary: 'Google OAuth redirect route' })
  googleRedirect() {
    return 'Test';
  }
}
