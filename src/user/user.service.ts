import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { handlePrismaError } from 'src/common/utils/prisma-error.util';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    try {
      const user = await this.prisma.user.create({
        data: createUserDto,
      });
      return plainToInstance(UserEntity, user);
    } catch (error) {
      console.log('Error creating users', error);
      handlePrismaError(error, 'Failed to create user', 'User');
    }
  }

  async findAll(): Promise<UserEntity[]> {
    try {
      const users = await this.prisma.user.findMany();
      return plainToInstance(UserEntity, users);
    } catch (error) {
      console.log('Error fetching users', error);
      handlePrismaError(error, 'Failed to fetch users');
    }
  }

  async findOne(id: string): Promise<UserEntity> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException(`User with ID "${id}" not found`);
      }

      return plainToInstance(UserEntity, user);
    } catch (error) {
      console.log('Error fetching user', error);
      handlePrismaError(error, 'Failed to fetch user', 'User');
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    try {
      await this.findOne(id); // optional: ensure user exists
      const user = await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
      });
      return plainToInstance(UserEntity, user);
    } catch (error) {
      console.error('Error updating user', error);
      handlePrismaError(error, 'Failed to update user', 'User');
    }
  }

  async remove(id: string): Promise<UserEntity> {
    try {
      await this.findOne(id); // ensure user exists
      const user = await this.prisma.user.update({
        where: { id },
        data: { isActive: false },
      });
      return plainToInstance(UserEntity, user);
    } catch (error) {
      console.error('Error deleting user', error);
      handlePrismaError(error, 'Failed to delete user', 'User');
    }
  }
}
