import { ErrorCodeEnum } from './handle-errors.enum';

export class AppError extends Error {
  constructor(
    public code: ErrorCodeEnum | string,
    public message: string,
    public statusCode: number = 500,
  ) {
    super(message);
    this.name = 'AppError';
  }
}
