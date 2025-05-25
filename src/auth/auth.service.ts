import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { UserEntity } from 'src/common/entity/user.entity';
import { JWTPayload } from 'src/common/interface/jwt.interface';
import { handlePrismaError } from 'src/common/utils/prisma-error.util';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

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

  async register(dto: RegisterDto): Promise<UserEntity> {
    try {
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      const user = await this.prisma.user.create({
        data: {
          ...dto,
          password: hashedPassword,
        },
      });

      return plainToInstance(UserEntity, user);
    } catch (error) {
      handlePrismaError(error, 'Failed to register user', 'User');
    }
  }
}
