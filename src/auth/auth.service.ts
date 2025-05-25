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
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async register(dto: RegisterDto): Promise<UserEntity> {
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

      return plainToInstance(UserEntity, user);
    } catch (error) {
      handlePrismaError(error, 'Failed to register user', 'User');
    }
  }

  async verifyEmail(token: string) {
    const user = await this.prisma.user.findFirst({
      where: { verificationToken: token },
    });
    if (!user) throw new BadRequestException('Invalid token');

    await this.prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true, verificationToken: null },
    });

    return { message: 'Email verified successfully' };
  }

  async login(dto: LoginDto): Promise<{ user: UserEntity; token: string }> {
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

    return {
      user: plainToInstance(UserEntity, user),
      token,
    };
  }
}
