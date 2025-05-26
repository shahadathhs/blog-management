import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { HandleErrors } from 'src/common/decorator/handle-errors.decorator';
import { UserEntity } from 'src/common/entity/user.entity';
import {
  successResponse,
  TSuccessResponse,
} from 'src/common/utils/response.util';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleErrors('Failed to retrieve users')
  async findAll(): Promise<TSuccessResponse<UserEntity[]>> {
    const users = await this.prisma.user.findMany();

    return successResponse(
      plainToInstance(UserEntity, users),
      'Users retrieved successfully',
    );
  }

  @HandleErrors('Failed to retrieve user')
  async findOne(id: string): Promise<TSuccessResponse<UserEntity>> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return successResponse(
      plainToInstance(UserEntity, user),
      'User retrieved successfully',
    );
  }

  @HandleErrors('Failed to remove user')
  async remove(id: string): Promise<TSuccessResponse<UserEntity>> {
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
  async getProfile(userId: string): Promise<TSuccessResponse<UserEntity>> {
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
  ): Promise<TSuccessResponse<UserEntity>> {
    const { name, ...profileData } = dto;
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        profile: {
          update: profileData,
        },
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
