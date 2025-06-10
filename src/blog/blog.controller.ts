import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BlogEntity } from 'src/common/entity/blog.entity';
import { UserEnum } from 'src/common/enum/user.enum';
import { JwtAuthGuard } from 'src/common/jwt/jwt-auth.guard';
import { Roles } from 'src/common/jwt/jwt-roles.decorator';
import { RolesGuard } from 'src/common/jwt/jwt-roles.guard';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  create(@Body() createBlogDto: CreateBlogDto) {
    return this.blogService.create(createBlogDto);
  }

  @ApiOperation({
    summary: 'Get all blogs',
    description:
      'Retrieve a list of all blogs. Accessible only to Admin users.',
  })
  @ApiOkResponse({
    description: 'Blogs retrieved successfully',
    type: [BlogEntity],
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden: Admins only' })
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserEnum.Admin)
  findAll() {
    return this.blogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogService.update(id, updateBlogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogService.remove(id);
  }
}
