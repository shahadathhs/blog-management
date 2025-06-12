import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogEntity } from '@project/common/entity/blog.entity';
import { HandleErrors } from '@project/common/error/handle-errors.decorator';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/prisma/prisma.service';
import { plainToInstance } from 'class-transformer';
import { CreateBlogDto } from './dto/create-blog.dto';
import { FindAllBlogsQueryDto } from './dto/find-all-blogs-query.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleErrors('Failed to create blog', 'Slug or Blog')
  async create(
    createBlogDto: CreateBlogDto,
    userId: string,
  ): Promise<TResponse<BlogEntity>> {
    const { tagIds, ...rest } = createBlogDto;

    // * Create or connect tags
    const tagConnections = tagIds?.map((tagId) => ({
      tag: { connect: { id: tagId } },
    }));

    const createdBlog = await this.prisma.blog.create({
      data: {
        ...rest,
        authorId: userId,
        tags: {
          create: tagConnections,
        },
      },
      include: {
        tags: { include: { tag: true } },
        comments: true,
      },
    });

    return successResponse(
      plainToInstance(BlogEntity, createdBlog),
      'Blog created successfully',
    );
  }

  @HandleErrors('Failed to retrieve blogs')
  async findAll(
    query: FindAllBlogsQueryDto,
  ): Promise<TResponse<{ data: BlogEntity[]; total: number }>> {
    const {
      page = 1,
      limit = 10,
      search = '',
      order = 'asc',
      published,
      authorId,
    } = query;

    const sanitizedOrder = order.toLowerCase() === 'desc' ? 'desc' : 'asc';
    const skip = (page - 1) * limit;

    const searchFilter = search
      ? {
          OR: [
            {
              title: {
                contains: search,
                mode: this.prisma.utils.QueryMode.insensitive,
              },
            },
            {
              slug: {
                contains: search,
                mode: this.prisma.utils.QueryMode.insensitive,
              },
            },
          ],
        }
      : {};

    const whereClause = {
      ...(typeof published === 'boolean' ? { published } : {}),
      ...(authorId ? { authorId } : {}),
      ...searchFilter,
    };

    const [total, blogs] = await this.prisma.$transaction([
      this.prisma.blog.count({ where: whereClause }),
      this.prisma.blog.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: sanitizedOrder },
        include: {
          tags: { include: { tag: true } },
          comments: true,
          author: { include: { profile: true } },
        },
      }),
    ]);

    const blogsWithFlatTagsAndAuthor = blogs.map((blog) => {
      const { author, tags, ...rest } = blog;
      const { profile, email, id } = author ?? {};

      return {
        ...rest,
        tags: tags?.map((tagRelation) => tagRelation.tag) ?? [],
        author: {
          id,
          email,
          name: profile?.name ?? null,
          bio: profile?.bio ?? '',
          avatar: profile?.avatar ?? null,
          website: profile?.website ?? null,
          location: profile?.location ?? '',
        },
      };
    });

    return successResponse(
      { data: plainToInstance(BlogEntity, blogsWithFlatTagsAndAuthor), total },
      'Blogs retrieved successfully',
    );
  }

  @HandleErrors('Failed to retrieve blog')
  async findOne(id: string): Promise<TResponse<BlogEntity>> {
    const blog = await this.prisma.blog.findUniqueOrThrow({
      where: { id },
      include: {
        tags: { include: { tag: true } },
        author: true,
      },
    });

    return successResponse(
      plainToInstance(BlogEntity, blog),
      'Blog retrieved successfully',
    );
  }

  @HandleErrors('Failed to update blog')
  async update(
    id: string,
    updateBlogDto: UpdateBlogDto,
  ): Promise<TResponse<BlogEntity>> {
    const { tagIds, ...rest } = updateBlogDto;

    const existingBlog = await this.prisma.blog.findUnique({ where: { id } });
    if (!existingBlog) throw new NotFoundException('Blog not found');

    // Reset tags and reassign
    await this.prisma.blogTag.deleteMany({ where: { blogId: id } });

    const tagConnections = tagIds?.map((tagId) => ({
      tag: { connect: { id: tagId } },
    }));

    const updatedBlog = await this.prisma.blog.update({
      where: { id },
      data: {
        ...rest,
        tags: {
          create: tagConnections,
        },
      },
      include: {
        tags: { include: { tag: true } },
        author: true,
      },
    });

    return successResponse(
      plainToInstance(BlogEntity, updatedBlog),
      'Blog updated successfully',
    );
  }

  @HandleErrors('Failed to toggle publish status')
  async togglePublish(id: string): Promise<TResponse<BlogEntity>> {
    const blog = await this.prisma.blog.findUniqueOrThrow({
      where: { id },
      include: {
        tags: { include: { tag: true } },
        author: true,
      },
    });

    const updatedBlog = await this.prisma.blog.update({
      where: { id },
      data: {
        published: !blog.published,
      },
      include: {
        tags: { include: { tag: true } },
        author: true,
      },
    });

    return successResponse(
      plainToInstance(BlogEntity, updatedBlog),
      `Blog has been ${updatedBlog.published ? 'published' : 'unpublished'} successfully`,
    );
  }

  @HandleErrors('Failed to delete blog')
  async remove(id: string): Promise<TResponse<null>> {
    await this.prisma.blog.findUniqueOrThrow({ where: { id } });

    await this.prisma.blog.delete({
      where: { id },
    });

    return successResponse(null, 'Blog deleted successfully');
  }
}
