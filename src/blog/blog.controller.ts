import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BlogEntity } from '@project/common/entity/blog.entity';
import { UserEnum } from '@project/common/enum/user.enum';
import { JwtAuthGuard } from '@project/common/jwt/jwt-auth.guard';
import { Roles } from '@project/common/jwt/jwt-roles.decorator';
import { RolesGuard } from '@project/common/jwt/jwt-roles.guard';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { FindAllBlogsQueryDto } from './dto/find-all-blogs-query.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@ApiTags('Blog')
@ApiBearerAuth()
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @ApiOperation({ summary: 'Create a new blog' })
  @ApiResponse({ status: 201, description: 'Blog created successfully' })
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserEnum.User)
  create(@Body() createBlogDto: CreateBlogDto) {
    return this.blogService.create(createBlogDto);
  }

  @ApiOperation({
    summary: 'Get all blogs with pagination, search, and tag filtering',
  })
  @ApiResponse({
    status: 200,
    description: 'Blogs retrieved successfully',
    type: [BlogEntity],
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    example: 'nestjs',
  })
  @ApiQuery({
    name: 'tag',
    required: false,
    type: String,
    example: 'typescript',
  })
  @Get()
  findAll(@Query() query: FindAllBlogsQueryDto) {
    return this.blogService.findAll(query);
  }

  @ApiOperation({ summary: 'Get a single blog by ID' })
  @ApiResponse({ status: 200, type: BlogEntity })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a blog' })
  @ApiResponse({ status: 200, description: 'Blog updated successfully' })
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserEnum.User)
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogService.update(id, updateBlogDto);
  }

  @ApiOperation({ summary: 'Delete a blog by ID' })
  @ApiResponse({ status: 200, description: 'Blog deleted successfully' })
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserEnum.User)
  remove(@Param('id') id: string) {
    return this.blogService.remove(id);
  }
}
