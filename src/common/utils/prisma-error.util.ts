import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

export function handlePrismaError(
  error: unknown,
  customMessage = 'Operation failed',
  record = 'Record',
): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        throw new ConflictException(`${record} already exists`);
      case 'P2025':
        throw new NotFoundException(`${record} not found`);
    }
  }

  throw new InternalServerErrorException(customMessage);
}
