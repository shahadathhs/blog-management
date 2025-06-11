import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserEntity } from '@project/common/entity/user.entity';
import { UserEnum } from '@project/common/enum/user.enum';
import { JwtAuthGuard } from '@project/common/jwt/jwt-auth.guard';
import { GetUser } from '@project/common/jwt/jwt-get-user.decorator';
import { Roles } from '@project/common/jwt/jwt-roles.decorator';
import { RolesGuard } from '@project/common/jwt/jwt-roles.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Get all users',
    description:
      'Retrieve a list of all users. Accessible only to Admin users.',
  })
  @ApiOkResponse({
    description: 'Users retrieved successfully',
    type: [UserEntity],
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden: Admins only' })
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserEnum.Admin)
  findAll() {
    return this.userService.findAll();
  }

  @ApiOperation({
    summary: 'Get logged-in user profile',
    description:
      'Retrieve the profile of the currently authenticated user. Accessible to all authenticated roles.',
  })
  @ApiOkResponse({
    description: 'User profile retrieved successfully',
    type: UserEntity,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserEnum.Admin, UserEnum.Moderator, UserEnum.User)
  getProfile(@GetUser('userId') userId: string) {
    return this.userService.getProfile(userId);
  }

  @ApiOperation({
    summary: 'Update profile of logged-in user',
    description: 'Allows logged-in user to update their own profile.',
  })
  @ApiBody({ type: UpdateProfileDto })
  @ApiOkResponse({
    description: 'Profile updated successfully',
    type: UserEntity,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @Patch('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserEnum.Admin, UserEnum.Moderator, UserEnum.User)
  updateProfile(
    @GetUser('userId') userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.userService.updateProfile(userId, dto);
  }

  @ApiOperation({
    summary: 'Get a specific user by ID',
    description:
      'Retrieve a single user by their ID. Accessible only to Admins.',
  })
  @ApiOkResponse({
    description: 'User retrieved successfully',
    type: UserEntity,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden: Admins only' })
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserEnum.Admin)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @ApiOperation({
    summary: 'Soft delete a user by ID',
    description:
      'Soft delete a user by setting `isActive` to `false`. This action is only permitted for Admins.',
  })
  @ApiOkResponse({ description: 'User removed successfully', type: UserEntity })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden: Admins only' })
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserEnum.Admin)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
