import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { UserEntity } from 'src/common/entity/user.entity';
import { UserEnum } from 'src/common/enum/user.enum';
import { JWTPayload } from 'src/common/interface/jwt.interface';
import { handlePrismaError } from 'src/common/utils/prisma-error.util';
import {
  successResponse,
  TSuccessResponse,
} from 'src/common/utils/success-response.utils';
import { MailService } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SetNewPasswordDto } from './dto/set-new-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async register(dto: RegisterDto): Promise<TSuccessResponse> {
    try {
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      const payload: JWTPayload = {
        sub: crypto.randomUUID(),
        email: dto.email,
        roles: UserEnum.User,
      };
      const verificationToken = this.jwtService.sign(payload);
      const user = await this.prisma.user.create({
        data: {
          ...dto,
          verificationToken,
          password: hashedPassword,
        },
      });

      await this.mailService.sendVerificationEmail(
        dto.email,
        verificationToken,
      );

      return successResponse(
        plainToInstance(UserEntity, user),
        'User registered',
      );
    } catch (error) {
      handlePrismaError(error, 'Failed to register user', 'User');
    }
  }

  async verifyEmail(token: string) {
    try {
      if (!token) throw new BadRequestException('Token Not Found');
      const user = await this.prisma.user.findFirst({
        where: { verificationToken: token },
      });
      if (!user) throw new BadRequestException('Invalid token');

      await this.prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: true, verificationToken: null },
      });

      return successResponse(null, 'Email verified successfully');
    } catch (error) {
      handlePrismaError(error, 'Error verifying the email', 'User');
    }
  }

  async login(dto: LoginDto): Promise<TSuccessResponse> {
    const { email, password } = dto;

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new NotFoundException(`User with email "${email}" not found`);
    }

    if (!user.password) {
      throw new NotFoundException(
        `User with email "${email}" doesn't have password. Try google login`,
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JWTPayload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    };
    const token = this.jwtService.sign(payload);

    return successResponse(
      {
        user: plainToInstance(UserEntity, user),
        token,
      },
      'Login successful',
    );
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<TSuccessResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new NotFoundException('User Not found');
    }

    const payload: JWTPayload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    };
    const resetToken = this.jwtService.sign(payload);
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // * 15 mins

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry: expiry,
      },
    });

    await this.mailService.sendPasswordResetEmail(user.email, resetToken);

    return successResponse(null, 'Reset link was sent to the email.');
  }

  async setNewPassword(dto: SetNewPasswordDto): Promise<TSuccessResponse> {
    if (!dto.token) {
      throw new NotFoundException('Token Not found');
    }
    const user = await this.prisma.user.findFirst({
      where: {
        resetToken: dto.token,
        resetTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired token');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

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

  async resetPassword(dto: ResetPasswordDto): Promise<TSuccessResponse> {
    const { email, currentPassword, newPassword } = dto;

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new NotFoundException(`User with email "${email}" not found`);
    }

    if (!user.password) {
      throw new BadRequestException(
        `User with email "${email}" has no password. Try Google login.`,
      );
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    if (currentPassword === newPassword) {
      throw new BadRequestException(
        'New password must be different from the current password',
      );
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { email },
      data: {
        password: hashedNewPassword,
      },
    });

    return successResponse(null, 'Password updated successfully');
  }
}
