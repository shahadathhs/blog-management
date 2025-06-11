import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BlogEntity } from 'src/common/entity/blog.entity';
import { HandleErrors } from 'src/common/error/handle-errors.decorator';
import {
  successResponse,
  TSuccessResponse,
} from 'src/common/utils/response.util';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) {}

  create(createBlogDto: CreateBlogDto) {
    console.info(createBlogDto);
    return 'This action adds a new blog';
  }

  @HandleErrors('Failed to retrieve blogs')
  async findAll(): Promise<TSuccessResponse<BlogEntity[]>> {
    const blogs = await this.prisma.blog.findMany();
    return successResponse(
      plainToInstance(BlogEntity, blogs),
      'Blogs retrieved successfully',
    );
  }

  async findOne(id: string) {
    const blog = await this.prisma.blog.findUnique({
      where: { id },
    });
    return blog;
  }

  update(id: string, updateBlogDto: UpdateBlogDto) {
    console.info(updateBlogDto);
    return `This action updates a #${id} blog`;
  }

  remove(id: string) {
    return `This action removes a #${id} blog`;
  }
}
