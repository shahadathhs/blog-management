import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UserEntity } from 'src/common/entity/user.entity';
import { handlePrismaError } from 'src/common/utils/prisma-error.util';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginWithPasswordDto } from './dto/login-with-password.dto';
import { RegisterWithPasswordDto } from './dto/register-with-password.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}
  async loginWithPassword(
    loginWithPasswordDto: LoginWithPasswordDto,
  ): Promise<{ user: UserEntity; token: string }> {
    const { email, password } = loginWithPasswordDto;
    console.log(password);
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new NotFoundException(`User with Email "${email}" not found`);
      }

      const plainUser = plainToInstance(UserEntity, user);

      return {
        user: plainUser,
        token: 'token',
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
      // * TODO: Hash the password before storing
      const user = await this.prisma.user.create({
        data: registerWithPasswordDto,
      });
      return plainToInstance(UserEntity, user);
    } catch (error) {
      console.log('Error creating users', error);
      handlePrismaError(error, 'Failed to create user', 'User');
    }
  }
}
