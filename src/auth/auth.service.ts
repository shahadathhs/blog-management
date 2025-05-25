import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { UserEntity } from 'src/common/entity/user.entity';
import { handlePrismaError } from 'src/common/utils/prisma-error.util';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginWithPasswordDto } from './dto/login-with-password.dto';
import { RegisterWithPasswordDto } from './dto/register-with-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async loginWithPassword(
    loginWithPasswordDto: LoginWithPasswordDto,
  ): Promise<{ user: UserEntity; token: string }> {
    const { email, password } = loginWithPasswordDto;

    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new NotFoundException(`User with Email "${email}" not found`);
      }

      if (!user.password) {
        throw new UnauthorizedException(
          'User does not password. Try google login',
        );
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (!isPasswordMatch) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const token = this.jwtService.sign({ sub: user.id, email: user.email });

      return {
        user: plainToInstance(UserEntity, user),
        token,
      };
    } catch (error) {
      console.log('Error fetching user', error);
      handlePrismaError(error, 'Failed to fetch user', 'User');
    }
  }

  async registerWithPassword(
    registerWithPasswordDto: RegisterWithPasswordDto,
  ): Promise<UserEntity> {
    try {
      const hashedPassword = await bcrypt.hash(
        registerWithPasswordDto.password,
        10,
      );

      const user = await this.prisma.user.create({
        data: {
          ...registerWithPasswordDto,
          password: hashedPassword,
        },
      });

      return plainToInstance(UserEntity, user);
    } catch (error) {
      console.log('Error creating users', error);
      handlePrismaError(error, 'Failed to create user', 'User');
    }
  }
}
