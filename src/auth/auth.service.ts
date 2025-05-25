import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { HandleErrors } from 'src/common/decorator/handle-errors.decorator';
import { UserEntity } from 'src/common/entity/user.entity';
import { UserEnum } from 'src/common/enum/user.enum';
import { JWTPayload } from 'src/common/interface/jwt.interface';
import {
  AppError,
  ErrorCode,
  ErrorMessages,
} from 'src/common/utils/error-handler.util';
import {
  successResponse,
  TSuccessResponse,
} from 'src/common/utils/response.util';
import { MailService } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SetNewPasswordDto } from './dto/set-new-password.dto';

@Injectable()
export class AuthService {
  private readonly RESET_TOKEN_EXPIRY_MINUTES = 15;
  private readonly BCRYPT_ROUNDS = 10;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  @HandleErrors('Failed to register user')
  async register(dto: RegisterDto): Promise<TSuccessResponse<UserEntity>> {
    const hashedPassword = await this.hashPassword(dto.password);
    const verificationToken = this.generateVerificationToken(dto.email);

    const user = await this.prisma.user.create({
      data: {
        ...dto,
        password: hashedPassword,
        verificationToken,
      },
    });

    await this.mailService.sendVerificationEmail(dto.email, verificationToken);

    return successResponse(
      plainToInstance(UserEntity, user),
      'User registered successfully',
    );
  }

  @HandleErrors('Failed to verify email')
  async verifyEmail(token: string): Promise<TSuccessResponse<null>> {
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
  ): Promise<TSuccessResponse<{ user: UserEntity; token: string }>> {
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
  async forgotPassword(
    dto: ForgotPasswordDto,
  ): Promise<TSuccessResponse<null>> {
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
  async setNewPassword(
    dto: SetNewPasswordDto,
  ): Promise<TSuccessResponse<null>> {
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
  async resetPassword(dto: ResetPasswordDto): Promise<TSuccessResponse<null>> {
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

  // * private helper
  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.BCRYPT_ROUNDS);
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
      throw new AppError(ErrorCode.INVALID_TOKEN, 'Token not found', 400);
    }
  }

  private async findUserByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError(
        ErrorCode.USER_NOT_FOUND,
        ErrorMessages[ErrorCode.USER_NOT_FOUND](email),
        404,
      );
    }
    return user;
  }

  private async findUserByVerificationToken(token: string): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: { verificationToken: token },
    });
    if (!user) {
      throw new AppError(
        ErrorCode.USER_NOT_FOUND,
        ErrorMessages[ErrorCode.USER_NOT_FOUND](),
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
    });
    if (!user) {
      throw new AppError(
        ErrorCode.USER_NOT_FOUND,
        ErrorMessages[ErrorCode.USER_NOT_FOUND](),
        404,
      );
    }
    return user;
  }

  private validateUserForLogin(user: User, email: string): void {
    if (!user.password) {
      throw new AppError(
        ErrorCode.PASSWORD_REQUIRED,
        ErrorMessages[ErrorCode.PASSWORD_REQUIRED](email),
        400,
      );
    }
  }

  private validateUserHasPassword(user: User, email: string): void {
    if (!user.password) {
      throw new AppError(
        ErrorCode.PASSWORD_REQUIRED,
        ErrorMessages[ErrorCode.PASSWORD_REQUIRED](email),
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
        ErrorCode.INVALID_CREDENTIALS,
        ErrorMessages[ErrorCode.INVALID_CREDENTIALS](),
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
        ErrorCode.SAME_PASSWORD,
        ErrorMessages[ErrorCode.SAME_PASSWORD](),
        400,
      );
    }
  }
}
