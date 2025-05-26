export enum ErrorCode {
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  INVALID_TOKEN = 'INVALID_TOKEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  PASSWORD_REQUIRED = 'PASSWORD_REQUIRED',
  SAME_PASSWORD = 'SAME_PASSWORD',
  EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED',
  GOOGLE_MISSING_REQUIRED_FIELDS = 'GOOGLE_MISSING_REQUIRED_FIELDS',
}

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    public message: string,
    public statusCode: number = 500,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const ErrorMessages = {
  [ErrorCode.USER_NOT_FOUND]: (email?: string) =>
    `User${email ? ` with email "${email}"` : ''} not found`,
  [ErrorCode.INVALID_CREDENTIALS]: () => 'Invalid credentials',
  [ErrorCode.INVALID_TOKEN]: () => 'Invalid or expired token',
  [ErrorCode.TOKEN_EXPIRED]: () => 'Token has expired',
  [ErrorCode.PASSWORD_REQUIRED]: (email: string) =>
    `User with email "${email}" doesn't have password. Try Google login`,
  [ErrorCode.SAME_PASSWORD]: () =>
    'New password must be different from the current password',
  [ErrorCode.EMAIL_NOT_VERIFIED]: () => 'Email address is not verified',
  [ErrorCode.GOOGLE_MISSING_REQUIRED_FIELDS]: () =>
    'Google account missing required fields',
};
