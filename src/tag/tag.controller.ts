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
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserEnum } from '@project/common/enum/user.enum';
import { JwtAuthGuard } from '@project/common/jwt/jwt-auth.guard';
import { Roles } from '@project/common/jwt/jwt-roles.decorator';
import { RolesGuard } from '@project/common/jwt/jwt-roles.guard';
import { CreateTagDto } from './dto/create-tag.dto';
import { FindAllTagsQueryDto } from './dto/find-all-tags-query.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagService } from './tag.service';

@ApiTags('Tag')
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  // ----------------
  @ApiOperation({ summary: 'Create a new tag' })
  @ApiBearerAuth()
  @ApiBody({ type: CreateTagDto })
  @ApiResponse({ status: 201, description: 'Tag created successfully' })
  @ApiResponse({
    status: 409,
    description: 'Tag with this slug already exists',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserEnum.Moderator)
  @Post()
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagService.create(createTagDto);
  }

  // ----------------
  @ApiOperation({ summary: 'Get all tags with pagination and search' })
  @ApiResponse({ status: 200, description: 'List of tags' })
  @Roles(UserEnum.Admin, UserEnum.Moderator, UserEnum.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll(@Query() query: FindAllTagsQueryDto) {
    return this.tagService.findAll(query);
  }

  // ----------------
  @ApiOperation({ summary: 'Get a single tag by ID' })
  @ApiResponse({ status: 200, description: 'Tag details' })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagService.findOne(id);
  }

  // ----------------
  @ApiOperation({ summary: 'Update a tag' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Tag updated successfully' })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserEnum.Moderator)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagService.update(id, updateTagDto);
  }

  // ----------------
  @ApiOperation({ summary: 'Delete a tag and cascade delete BlogTag records' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Tag deleted successfully' })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserEnum.Moderator)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tagService.remove(id);
  }

  // ----------------
  @ApiOperation({ summary: 'Search tags by name or slug' })
  @ApiResponse({ status: 200, description: 'Filtered tag list' })
  @Get('search/autocomplete')
  searchTags(@Query('searchTerm') searchTerm: string) {
    return this.tagService.searchTags(searchTerm);
  }
}
