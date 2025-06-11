import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UserEntity } from '@project/common/entity/user.entity';
import { ENVEnum } from '@project/common/enum/env.enum';
import { UserEnum } from '@project/common/enum/user.enum';
import { AppError } from '@project/common/error/handle-errors.app';
import { HandleErrors } from '@project/common/error/handle-errors.decorator';
import { ErrorCodeEnum } from '@project/common/error/handle-errors.enum';
import { ErrorMessages } from '@project/common/error/handle-errors.message';
import { JWTPayload } from '@project/common/jwt/jwt-payload.interface';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { MailService } from '@project/mail/mail.service';
import { PrismaService } from '@project/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { randomInt } from 'crypto';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { EmailLoginRequestDto } from './dto/email-login-request.dto';
import { EmailLoginVerifyDto } from './dto/email-login-verify.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { GoogleLoginDto } from './dto/google-login.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SetNewPasswordDto } from './dto/set-new-password.dto';

@Injectable()
export class AuthService {
  private readonly RESET_TOKEN_EXPIRY_MINUTES = 15;
  private readonly BCRYPT_ROUNDS = 10;

  private googleClient: OAuth2Client;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {
    this.googleClient = new OAuth2Client(
      this.configService.get<string>(ENVEnum.OAUTH_CLIENT_ID),
    );
  }

  @HandleErrors('Failed to register user')
  async register(dto: RegisterDto): Promise<TResponse<UserEntity>> {
    const hashedPassword = await this.hashPassword(dto.password);
    const verificationToken = this.generateVerificationToken(dto.email);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        verificationToken,
        profile: {
          create: {
            name: dto.name,
            bio: '',
            avatar: null,
            website: '',
            location: '',
          },
        },
      },
    });

    await this.mailService.sendVerificationEmail(dto.email, verificationToken);

    return successResponse(
      plainToInstance(UserEntity, user),
      'User registered successfully',
    );
  }

  @HandleErrors('Failed to verify email')
  async verifyEmail(token: string): Promise<TResponse<null>> {
    this.validateToken(token);

    const user = await this.findUserByVerificationToken(token);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
      },
    });

    return successResponse(null, 'Email verified successfully');
  }

  @HandleErrors('Failed to login')
  async login(
    dto: LoginDto,
  ): Promise<TResponse<{ user: UserEntity; token: string }>> {
    const user = await this.findUserByEmail(dto.email);
    this.validateUserForLogin(user, dto.email);
    await this.validatePassword(dto.password, user.password as string);

    const token = this.generateAuthToken(user);

    return successResponse(
      {
        user: plainToInstance(UserEntity, user),
        token,
      },
      'Login successful',
    );
  }

  @HandleErrors('Failed to process forgot password request')
  async forgotPassword(dto: ForgotPasswordDto): Promise<TResponse<null>> {
    const user = await this.findUserByEmail(dto.email);

    const resetToken = this.generateAuthToken(user);
    const expiry = this.getResetTokenExpiry();

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry: expiry,
      },
    });

    await this.mailService.sendPasswordResetEmail(user.email, resetToken);

    return successResponse(null, 'Reset link was sent to your email');
  }

  @HandleErrors('Failed to set new password')
  async setNewPassword(dto: SetNewPasswordDto): Promise<TResponse<null>> {
    this.validateToken(dto.token);

    const user = await this.findUserByResetToken(dto.token);

    const hashedPassword = await this.hashPassword(dto.newPassword);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return successResponse(null, 'Password updated successfully');
  }

  @HandleErrors('Failed to reset password')
  async resetPassword(dto: ResetPasswordDto): Promise<TResponse<null>> {
    const user = await this.findUserByEmail(dto.email);
    this.validateUserHasPassword(user, dto.email);
    await this.validatePassword(dto.currentPassword, user.password as string);
    this.validatePasswordChange(dto.currentPassword, dto.newPassword);

    const hashedNewPassword = await this.hashPassword(dto.newPassword);

    await this.prisma.user.update({
      where: { email: dto.email },
      data: { password: hashedNewPassword },
    });

    return successResponse(null, 'Password updated successfully');
  }

  @HandleErrors('Failed to login with google')
  async googleLogin(
    dto: GoogleLoginDto,
  ): Promise<TResponse<{ user: UserEntity; token: string }>> {
    this.validateToken(dto.token);

    const payload = await this.verifyGoogleToken(dto.token);

    // * Check if user already exists
    let user = await this.prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (!user) {
      // * Create new user
      user = await this.prisma.user.create({
        data: {
          email: payload.email as string,
          googleId: payload.sub,
          emailVerified: true,
          profile: {
            create: {
              name: payload.name ?? 'Unnamed Google User',
              bio: '',
              avatar: payload.picture,
              website: '',
              location: '',
            },
          },
        },
      });
    } else if (!user.googleId) {
      // * Link Google account to existing user
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          googleId: payload.sub,
          emailVerified: true,
        },
        include: { profile: true },
      });
    }

    const token = this.generateAuthToken(user);

    return successResponse(
      {
        user: plainToInstance(UserEntity, user),
        token,
      },
      'Google login successful',
    );
  }

  @HandleErrors('Failed to generate login code')
  async sendLoginCode(dto: EmailLoginRequestDto): Promise<TResponse<null>> {
    const user = await this.findUserByEmail(dto.email);

    const { code, hashedCode } = await this.generateLoginCode();

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailLoginCode: hashedCode,
        emailLoginCodeExpiry: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    await this.mailService.sendLoginCodeEmail(user.email, code.toString());

    return successResponse(null, 'Login code send successfully');
  }

  @HandleErrors('Failed to verify code')
  async verifyLoginCode(
    dto: EmailLoginVerifyDto,
  ): Promise<TResponse<{ user: UserEntity; token: string }>> {
    const user = await this.findUserByEmail(dto.email);

    await this.validateLoginCode(
      dto.code.toString(),
      user.emailLoginCode as string,
      user.emailLoginCodeExpiry as Date,
    );

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailLoginCode: null,
        emailLoginCodeExpiry: null,
      },
    });

    const token = this.generateAuthToken(user);

    return successResponse(
      {
        user: plainToInstance(UserEntity, user),
        token,
      },
      'Login successful',
    );
  }

  // * private helper
  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.BCRYPT_ROUNDS);
  }

  private async generateLoginCode(): Promise<{
    code: number;
    hashedCode: string;
  }> {
    const code = randomInt(100000, 1000000);
    const hashedCode = await bcrypt.hash(code.toString(), this.BCRYPT_ROUNDS);

    return {
      code,
      hashedCode,
    };
  }

  private async validateLoginCode(
    inputCode: string,
    storedCode: string,
    emailLoginCodeExpiry: Date,
  ): Promise<void> {
    if (emailLoginCodeExpiry.getTime() <= Date.now()) {
      throw new AppError(
        ErrorCodeEnum.CODE_EXPIRED,
        ErrorMessages[ErrorCodeEnum.CODE_EXPIRED](),
        401,
      );
    }

    const isMatch = await bcrypt.compare(inputCode, storedCode);
    if (!isMatch) {
      throw new AppError(
        ErrorCodeEnum.INVALID_CODE,
        ErrorMessages[ErrorCodeEnum.INVALID_CODE](),
        401,
      );
    }
  }

  private generateVerificationToken(email: string): string {
    const payload: JWTPayload = {
      sub: crypto.randomUUID(),
      email,
      roles: UserEnum.User,
    };
    return this.jwtService.sign(payload);
  }

  private generateAuthToken(user: User): string {
    const payload: JWTPayload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    };
    return this.jwtService.sign(payload);
  }

  private getResetTokenExpiry(): Date {
    return new Date(Date.now() + this.RESET_TOKEN_EXPIRY_MINUTES * 60 * 1000);
  }

  private validateToken(token: string): void {
    if (!token) {
      throw new AppError(ErrorCodeEnum.INVALID_TOKEN, 'Token not found', 400);
    }
  }

  private async findUserByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });
    if (!user) {
      throw new AppError(
        ErrorCodeEnum.USER_NOT_FOUND,
        ErrorMessages[ErrorCodeEnum.USER_NOT_FOUND](email),
        404,
      );
    }
    return user;
  }

  private async findUserByVerificationToken(token: string): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: { verificationToken: token },
      include: { profile: true },
    });
    if (!user) {
      throw new AppError(
        ErrorCodeEnum.USER_NOT_FOUND,
        ErrorMessages[ErrorCodeEnum.USER_NOT_FOUND](),
        404,
      );
    }
    return user;
  }

  private async findUserByResetToken(token: string): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() },
      },
      include: { profile: true },
    });
    if (!user) {
      throw new AppError(
        ErrorCodeEnum.USER_NOT_FOUND,
        ErrorMessages[ErrorCodeEnum.USER_NOT_FOUND](),
        404,
      );
    }
    return user;
  }

  private validateUserForLogin(user: User, email: string): void {
    if (!user.password) {
      throw new AppError(
        ErrorCodeEnum.PASSWORD_REQUIRED,
        ErrorMessages[ErrorCodeEnum.PASSWORD_REQUIRED](email),
        400,
      );
    }
  }

  private validateUserHasPassword(user: User, email: string): void {
    if (!user.password) {
      throw new AppError(
        ErrorCodeEnum.PASSWORD_REQUIRED,
        ErrorMessages[ErrorCodeEnum.PASSWORD_REQUIRED](email),
        400,
      );
    }
  }

  private async validatePassword(
    inputPassword: string,
    storedPassword: string,
  ): Promise<void> {
    const isMatch = await bcrypt.compare(inputPassword, storedPassword);
    if (!isMatch) {
      throw new AppError(
        ErrorCodeEnum.INVALID_CREDENTIALS,
        ErrorMessages[ErrorCodeEnum.INVALID_CREDENTIALS](),
        401,
      );
    }
  }

  private validatePasswordChange(
    currentPassword: string,
    newPassword: string,
  ): void {
    if (currentPassword === newPassword) {
      throw new AppError(
        ErrorCodeEnum.SAME_PASSWORD,
        ErrorMessages[ErrorCodeEnum.SAME_PASSWORD](),
        400,
      );
    }
  }

  private async verifyGoogleToken(token: string): Promise<TokenPayload> {
    const ticket = await this.googleClient.verifyIdToken({
      idToken: token,
      audience: this.configService.get<string>(ENVEnum.OAUTH_CLIENT_ID),
    });

    const payload = ticket.getPayload();

    if (!payload) {
      throw new AppError(
        ErrorCodeEnum.INVALID_TOKEN,
        ErrorMessages[ErrorCodeEnum.INVALID_TOKEN](),
        400,
      );
    }

    const { sub, email } = payload;

    if (!email || !sub) {
      throw new AppError(
        ErrorCodeEnum.INVALID_TOKEN,
        ErrorMessages[ErrorCodeEnum.INVALID_TOKEN](),
        400,
      );
    }

    return payload;
  }
}
