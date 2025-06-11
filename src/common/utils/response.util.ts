export type TResponse<T = unknown> = {
  success: boolean;
  message: string | string[];
  data: T;
};

export const successResponse = <T>(
  data: T,
  message = 'Request Success',
): TResponse<T> => ({
  success: true,
  message,
  data,
});

export const errorResponse = <T>(
  data: T,
  message = 'Request Failed',
): TResponse<T> => ({
  success: false,
  message,
  data,
});
