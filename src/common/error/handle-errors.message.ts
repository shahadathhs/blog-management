import { ErrorCodeEnum } from './handle-errors.enum';

export const ErrorMessages = {
  [ErrorCodeEnum.USER_NOT_FOUND]: (email?: string) =>
    `User${email ? ` with email "${email}"` : ''} not found`,
  [ErrorCodeEnum.INVALID_CREDENTIALS]: () => 'Invalid credentials',
  [ErrorCodeEnum.INVALID_TOKEN]: () => 'Invalid or expired token',
  [ErrorCodeEnum.TOKEN_EXPIRED]: () => 'Token has expired',
  [ErrorCodeEnum.PASSWORD_REQUIRED]: (email: string) =>
    `User with email "${email}" doesn't have password. Try Google login`,
  [ErrorCodeEnum.SAME_PASSWORD]: () =>
    'New password must be different from the current password',
  [ErrorCodeEnum.EMAIL_NOT_VERIFIED]: () => 'Email address is not verified',
  [ErrorCodeEnum.GOOGLE_MISSING_REQUIRED_FIELDS]: () =>
    'Google account missing required fields',
  [ErrorCodeEnum.CODE_EXPIRED]: () =>
    'Login code expired. Please request new code',
  [ErrorCodeEnum.INVALID_CODE]: () =>
    'The provided code is invalid. Please try again with valid code',
};
