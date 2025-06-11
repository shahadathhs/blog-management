import { Injectable } from '@nestjs/common';
import { UserEntity } from '@project/common/entity/user.entity';
import { HandleErrors } from '@project/common/error/handle-errors.decorator';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/prisma/prisma.service';
import { plainToInstance } from 'class-transformer';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleErrors('Failed to retrieve users')
  async findAll(): Promise<TResponse<UserEntity[]>> {
    const users = await this.prisma.user.findMany({
      include: {
        profile: true,
        blogs: true,
        notifications: true,
        triggeredNotifications: true,
        views: true,
        comments: true,
      },
    });

    return successResponse(
      plainToInstance(UserEntity, users),
      'Users retrieved successfully',
    );
  }

  @HandleErrors('Failed to retrieve user')
  async findOne(id: string): Promise<TResponse<UserEntity>> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        blogs: true,
        notifications: true,
        triggeredNotifications: true,
        views: true,
        comments: true,
      },
    });

    return successResponse(
      plainToInstance(UserEntity, user),
      'User retrieved successfully',
    );
  }

  @HandleErrors('Failed to remove user')
  async remove(id: string): Promise<TResponse<UserEntity>> {
    await this.findOne(id); // * ensure user exists
    const user = await this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
    return successResponse(
      plainToInstance(UserEntity, user),
      'User removed successfully',
    );
  }

  @HandleErrors('Failed to retriever user profile')
  async getProfile(userId: string): Promise<TResponse<UserEntity>> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        blogs: true,
        notifications: true,
        triggeredNotifications: true,
        views: true,
        comments: true,
      },
    });

    return successResponse(
      plainToInstance(UserEntity, user),
      'User profile retrieve successfully',
    );
  }

  @HandleErrors('Failed to update profile')
  async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
  ): Promise<TResponse<UserEntity>> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        profile: { update: dto },
      },
      include: {
        profile: true,
      },
    });

    return successResponse(
      plainToInstance(UserEntity, user),
      'Profile updated successfully',
    );
  }
}
