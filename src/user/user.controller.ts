import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { Roles } from 'src/common/decorator/roles.decorator';
import { UserEnum } from 'src/common/enum/user.enum';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Get all users',
    description:
      'Use GET method on `/user` to retrieve a list of all users. Accessible only to Admin users.',
  })
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserEnum.Admin)
  findAll() {
    return this.userService.findAll();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserEnum.Admin, UserEnum.Moderator, UserEnum.User)
  getProfile(@GetUser('userId') userId: string) {
    return this.userService.getProfile(userId);
  }

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
      'Use GET method on `/user/:id` to retrieve a single user by their ID. Accessible to Admins.',
  })
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserEnum.Admin)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @ApiOperation({
    summary: 'Soft delete a user by ID',
    description:
      'Use DELETE method on `/user/:id` to **soft delete** a user by setting `isActive` to `false` instead of permanently removing them from the database. Only Admins can perform this action.',
  })
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserEnum.Admin)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
