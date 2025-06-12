import { Injectable } from '@nestjs/common';
import { TagEntity } from '@project/common/entity/tag.entity';
import { AppError } from '@project/common/error/handle-errors.app';
import { HandleErrors } from '@project/common/error/handle-errors.decorator';
import { ErrorCodeEnum } from '@project/common/error/handle-errors.enum';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/prisma/prisma.service';
import { plainToInstance } from 'class-transformer';
import { CreateTagDto } from './dto/create-tag.dto';
import { FindAllTagsQueryDto } from './dto/find-all-tags-query.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagService {
  constructor(private prisma: PrismaService) {}

  // ------------
  @HandleErrors('Failed to create tag', 'Tag')
  async create(createTagDto: CreateTagDto): Promise<TResponse<TagEntity>> {
    const name = createTagDto.name;
    let slug = createTagDto.slug?.trim();

    if (slug) {
      // * Validate provided slug
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
        throw new AppError(
          ErrorCodeEnum.INVALID_TAG,
          'The provided tag is not valid',
          400,
        );
      }
    } else {
      // * Generate slug from name
      slug = await this.generateUniqueSlug(name);
    }

    const tag = await this.prisma.tag.create({
      data: { name, slug },
    });

    return successResponse(
      plainToInstance(TagEntity, tag),
      'Tag Created successfully',
    );
  }

  // ------------
  @HandleErrors('Failed to get tags', 'Tags')
  async findAll(
    query: FindAllTagsQueryDto,
  ): Promise<TResponse<{ data: TagEntity[]; total: number }>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const search = query.search ?? '';
    const order = query.order ?? 'asc';

    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            {
              name: {
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

    const [data, total] = await this.prisma.$transaction([
      this.prisma.tag.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: order },
      }),
      this.prisma.tag.count({ where }),
    ]);

    return successResponse(
      {
        data: plainToInstance(TagEntity, data),
        total,
      },
      'Tags fetched successfully',
    );
  }

  // ------------
  @HandleErrors('Failed to retrieve tag', 'Tag')
  async findOne(id: string): Promise<TResponse<TagEntity>> {
    const tag = await this.prisma.tag.findUniqueOrThrow({
      where: { id },
    });

    return successResponse(
      plainToInstance(TagEntity, tag),
      'Tag fetched successfully',
    );
  }

  // ------------
  @HandleErrors('Failed to update tag', 'Tag or Slug')
  async update(
    id: string,
    updateTagDto: UpdateTagDto,
  ): Promise<TResponse<TagEntity>> {
    const data = {
      ...(updateTagDto.name && { name: updateTagDto.name }),
      ...(updateTagDto.slug && { slug: updateTagDto.slug }),
    };

    const tag = await this.prisma.tag.update({
      where: { id },
      data,
    });

    return successResponse(
      plainToInstance(TagEntity, tag),
      'Tag updated successfully',
    );
  }

  // ------------
  @HandleErrors('Failed to delete tag', 'Tag')
  async remove(id: string): Promise<TResponse<null>> {
    await this.prisma.tag.delete({ where: { id } });

    return successResponse(null, 'Tag deleted successfully');
  }

  @HandleErrors('Failed to autocomplete tags', 'Tag')
  async autocomplete(search: string): Promise<TResponse<TagEntity[]>> {
    const results = await this.prisma.tag.findMany({
      where: {
        OR: [
          {
            name: {
              startsWith: search,
              mode: this.prisma.utils.QueryMode.insensitive,
            },
          },
          {
            slug: {
              startsWith: search,
              mode: this.prisma.utils.QueryMode.insensitive,
            },
          },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    });

    return successResponse(
      plainToInstance(TagEntity, results),
      'Autocomplete tags fetched successfully',
    );
  }

  private generateSlug(input: string): string {
    return input
      .toLowerCase()
      .normalize('NFKD') // Handle accents
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[^a-z0-9 -]/g, '') // Remove invalid chars
      .replace(/\s+/g, '-') // Replace spaces with dashes
      .replace(/-+/g, '-') // Collapse multiple dashes
      .replace(/^-|-$/g, ''); // Trim starting/ending dashes
  }

  private async generateUniqueSlug(name: string): Promise<string> {
    let slug = this.generateSlug(name);
    let count = 1;
    const originalSlug = slug;

    while (await this.prisma.tag.findUnique({ where: { slug } })) {
      slug = `${originalSlug}-${count++}`;
    }

    return slug;
  }
}
