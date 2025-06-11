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
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagService {
  constructor(private prisma: PrismaService) {}

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

  findAll() {
    return `This action returns all tag`;
  }

  findOne(id: string) {
    return `This action returns a #${id} tag`;
  }

  update(id: string, updateTagDto: UpdateTagDto) {
    return `This action updates a #${id} tag`;
  }

  remove(id: string) {
    return `This action removes a #${id} tag`;
  }

  searchTags(searchTerm: string) {
    return `This return tag based on ${searchTerm}`;
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
