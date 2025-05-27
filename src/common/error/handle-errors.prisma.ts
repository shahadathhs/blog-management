import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AppError } from './handle-errors.utils';

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

  if (error instanceof AppError) {
    switch (error.statusCode) {
      case 400:
        throw new BadRequestException(error.message);
      case 401:
        throw new UnauthorizedException(error.message);
      case 404:
        throw new NotFoundException(error.message);
      case 409:
        throw new ConflictException(error.message);
      default:
        throw new InternalServerErrorException(error.message);
    }
  }

  throw new InternalServerErrorException(customMessage);
}
