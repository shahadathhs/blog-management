import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserEnum } from '@project/common/enum/user.enum';
import { JwtAuthGuard } from '@project/common/jwt/jwt-auth.guard';
import { Roles } from '@project/common/jwt/jwt-roles.decorator';
import { RolesGuard } from '@project/common/jwt/jwt-roles.guard';
import { AuthService } from './auth.service';
import { EmailLoginRequestDto } from './dto/email-login-request.dto';
import { EmailLoginVerifyDto } from './dto/email-login-verify.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { GoogleLoginDto } from './dto/google-login.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SetNewPasswordDto } from './dto/set-new-password.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ----------
  @ApiOperation({
    summary: 'Register user with password',
    description: 'Registers a new user and sends a verification email.',
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Validation error or email exists' })
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
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  @Get('verify')
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  // ----------
  @ApiOperation({
    summary: 'Login user with password',
    description: 'Logs in a user with email and password.',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // ----------
  @ApiOperation({
    summary: 'Send reset password email',
    description: 'Sends a password reset link to the user’s email.',
  })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({ status: 200, description: 'Reset link sent successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  // ----------
  @ApiOperation({
    summary: 'Set new password with token',
    description: 'Sets a new password using the reset token.',
  })
  @ApiBody({ type: SetNewPasswordDto })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  @Post('new-password')
  newPassword(@Body() dto: SetNewPasswordDto) {
    return this.authService.setNewPassword(dto);
  }

  // ----------
  @ApiOperation({
    summary: 'Reset password (user must be authenticated)',
    description:
      'Allows logged-in user to reset password by providing current password.',
  })
  @ApiBearerAuth()
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ status: 200, description: 'Password updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserEnum.Admin, UserEnum.Moderator, UserEnum.User)
  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  // ----------
  @ApiOperation({
    summary: 'Login/Register using Google OAuth',
    description: `Accepts a Google ID token and either logs in an existing user or registers a new user if not found.

**Client Responsibility**: 
Obtain a Google ID token from frontend via Google Sign-In (e.g., @react-oauth/google) and pass it to this endpoint.

**Response**: 
Returns the authenticated user and JWT token.`,
  })
  @ApiBody({
    type: GoogleLoginDto,
    description: `Google ID token payload from frontend.

Example:
{
  "token": "eyJhbGciOiJSUzI1..."
}`,
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully logged in or registered with Google',
    schema: {
      example: {
        success: true,
        message: 'Google login successful',
        data: {
          user: {
            id: 'a1b2c3d4-5678',
            email: 'john.doe@gmail.com',
            roles: 'USER',
            emailVerified: true,
          },
          token: 'jwt.token.here',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid Google ID token' })
  @Post('google')
  googleLogin(@Body() dto: GoogleLoginDto) {
    return this.authService.googleLogin(dto);
  }

  // ----------
  @ApiOperation({
    summary: 'Request login code via email',
    description: 'Sends a login code to the user’s email address.',
  })
  @ApiBody({ type: EmailLoginRequestDto })
  @ApiResponse({ status: 200, description: 'Login code sent successfully' })
  @Post('email-login/request')
  requestEmailLogin(@Body() dto: EmailLoginRequestDto) {
    return this.authService.sendLoginCode(dto);
  }

  // ----------
  @ApiOperation({
    summary: 'Verify email login code',
    description: 'Verifies the code and logs the user in if valid.',
  })
  @ApiBody({ type: EmailLoginVerifyDto })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully with email code',
  })
  @Post('email-login/verify')
  verifyEmailLogin(@Body() dto: EmailLoginVerifyDto) {
    return this.authService.verifyLoginCode(dto);
  }
}
